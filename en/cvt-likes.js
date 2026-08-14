/**
 * ═══════════════════════════════════════════════════════════════════════
 *  CVT LIKES — кнопка лайка й лічильник у кібер-табличці
 *  Розмітка: #cvt-likes в index.html   Стилі: cyber-video-tab.css
 *  Бекенд:   worker/src/index.js (Cloudflare Worker + KV)
 * ═══════════════════════════════════════════════════════════════════════
 *
 *  ЯК ПРАЦЮЄ:
 *   1. Стан тягнемо ЛІНИВО — лише коли табличка реально відкрилась
 *      (перше 'is-open' на #cyber-video-tab). Головна сторінка від цього
 *      не важчає: поки табличку не показали, у бік Worker'а нуль запитів.
 *   2. Клік = оптимістичне перемикання: цифра й серце міняються миттєво,
 *      а вже тоді летить POST. Якщо Worker відмовив — відкат до
 *      попереднього стану плюс трясця кнопки.
 *   3. Подвійний лайк ріже сервер (хеш IP+UA), а localStorage лише
 *      підмальовує серце ще до відповіді — щоб при поверненні на сайт
 *      кнопка не блимала «не лайкнуто → лайкнуто».
 *
 *  ЧОМУ СЕРВЕР — ДЖЕРЕЛО ІСТИНИ:
 *      localStorage чиститься й обходиться інкогніто, тож він тут
 *      виключно косметика. Реальний підрахунок — виключно на Worker'і.
 *
 *  Ручки для консолі: CvtLikes.refresh() / .state()
 */
(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────
  //  НАЛАШТУВАННЯ
  // ─────────────────────────────────────────────────────────────────────

  /**
   * Базовий шлях до API.
   * Worker сидить на маршруті того самого домену, тож шлях відносний —
   * ні CORS, ні preflight, ні зайвого DNS-запиту.
   * Якщо колись переїде на workers.dev, тут стане повний URL, напр.:
   *   'https://like-counter.ВАШ-АКАУНТ.workers.dev/api/likes'
   */
  var API_BASE = '/api/likes';

  /** Скільки чекати на Worker, поки не вважати, що мережа лягла. */
  var TIMEOUT_MS = 8000;

  var LS_PREFIX = 'cvtLiked:';
  var DEBUG = false;

  function log() {
    if (!DEBUG) return;
    try {
      console.log.apply(console, ['[cvt-likes]'].concat([].slice.call(arguments)));
    } catch (e) {}
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  onReady(function init() {
    var wrap  = document.getElementById('cvt-likes');
    var btn   = document.getElementById('cvt-like-btn');
    var out   = document.getElementById('cvt-like-count');
    var live  = document.getElementById('cvt-like-live');
    var tab   = document.getElementById('cyber-video-tab');

    // Розмітки немає — тихо йдемо, нічого не ламаючи (як у cyber-video-tab.js)
    if (!wrap || !btn || !out) {
      log('розмітки лайка немає — виходжу');
      return;
    }

    var slug    = wrap.getAttribute('data-slug') || 'default';
    var lsKey   = LS_PREFIX + slug;
    var endpoint = API_BASE + '/' + encodeURIComponent(slug);

    var count   = null;      // null = ще не знаємо
    var liked   = localStorage.getItem(lsKey) === '1';
    var loaded  = false;     // чи приїхав стан із сервера
    var busy    = false;     // POST у дорозі
    var fetched = false;     // щоб не смикати сервер двічі

    // ── Малювання ─────────────────────────────────────────────────────

    function fmt(n) {
      // 1200 → 1.2K, щоб довге число не рвало кнопку
      if (n < 1000) return String(n);
      if (n < 10000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
      return Math.round(n / 1000) + 'K';
    }

    function render(opts) {
      var bump = opts && opts.bump;

      btn.classList.toggle('is-liked', liked);
      btn.setAttribute('aria-pressed', liked ? 'true' : 'false');
      btn.disabled = !loaded;

      var text = count === null ? '—' : fmt(count);
      if (out.textContent !== text) {
        out.textContent = text;
        if (bump) {
          out.classList.remove('is-bump');
          void out.offsetWidth;            // рестарт анімації
          out.classList.add('is-bump');
        }
      }

      btn.setAttribute('title', liked ? 'You liked this' : 'Like');
      btn.setAttribute('aria-label',
        (liked ? 'Remove your like. ' : 'Like this video. ') +
        (count === null ? '' : count + ' likes'));

      if (live && count !== null) {
        live.textContent = count + (count === 1 ? ' like' : ' likes');
      }
    }

    function pop() {
      btn.classList.remove('is-pop');
      void btn.offsetWidth;
      btn.classList.add('is-pop');
    }

    btn.addEventListener('animationend', function (e) {
      if (e.target === btn) btn.classList.remove('is-pop', 'is-error');
    });
    out.addEventListener('animationend', function () {
      out.classList.remove('is-bump');
    });

    function flashError() {
      btn.classList.remove('is-error');
      void btn.offsetWidth;
      btn.classList.add('is-error');
    }

    // ── Дрібні звуки, у стилі решти сайту й з повагою до SoundPrefs ────

    var SOUND_DIR = '../sound/';
    var sfxCache = {};

    function sfx(file) {
      if (window.SoundPrefs && window.SoundPrefs.isMuted()) return;
      try {
        var base = sfxCache[file] || (sfxCache[file] = new Audio(SOUND_DIR + file));
        var inst = base.cloneNode();
        inst.play().catch(function () { /* автоплей до першого жесту */ });
      } catch (e) {}
    }

    btn.addEventListener('mouseenter', function () {
      if (!btn.disabled) sfx('QAHover.mp3');
    });

    // ── Мережа ────────────────────────────────────────────────────────

    /** fetch із таймаутом: інакше «вічний» запит залишить кнопку мертвою. */
    function request(method) {
      var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var timer = setTimeout(function () {
        if (ctrl) ctrl.abort();
      }, TIMEOUT_MS);

      return fetch(endpoint, {
        method: method,
        // Кеш браузера тут — ворог: лічильник має бути свіжим
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        signal: ctrl ? ctrl.signal : undefined
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .finally(function () { clearTimeout(timer); });
    }

    function load() {
      if (fetched) return;
      fetched = true;
      log('тягну стан для', slug);

      request('GET')
        .then(function (data) {
          count  = typeof data.count === 'number' ? data.count : 0;
          loaded = true;
          // Сервер головніший за localStorage: він знає про всі пристрої
          liked = !!data.liked;
          localStorage.setItem(lsKey, liked ? '1' : '0');
          render({ bump: true });
          log('стан:', count, liked);
        })
        .catch(function (err) {
          // Worker недоступний — кнопка лишається неактивною з «—».
          // Свідомо НЕ показуємо 0: краще «невідомо», ніж брехня.
          loaded = false;
          render();
          log('не вдалось прочитати лічильник', err);
        });
    }

    function toggle() {
      if (busy || !loaded) return;
      busy = true;

      var prevLiked = liked;
      var prevCount = count;

      // Оптимістично: інтерфейс реагує зараз, мережа наздогонить
      liked = !liked;
      count = Math.max(0, (count || 0) + (liked ? 1 : -1));
      localStorage.setItem(lsKey, liked ? '1' : '0');
      render({ bump: true });
      if (liked) { pop(); sfx('QAClick.mp3'); }

      request('POST')
        .then(function (data) {
          // Сервер міг не погодитись (уже лайкав з іншої вкладки,
          // спрацював rate limit і т.д.) — вирівнюємось по ньому
          if (typeof data.count === 'number') count = data.count;
          if (typeof data.liked === 'boolean') liked = data.liked;
          localStorage.setItem(lsKey, liked ? '1' : '0');
          render({ bump: true });
        })
        .catch(function (err) {
          liked = prevLiked;
          count = prevCount;
          localStorage.setItem(lsKey, liked ? '1' : '0');
          render({ bump: true });
          flashError();
          log('POST не вдався — відкат', err);
        })
        .finally(function () { busy = false; });
    }

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();      // щоб клік не пішов у бекдроп і не закрив табличку
      toggle();
    });

    // ── Коли вантажити: тільки-но табличка відкрилась ──────────────────
    //
    // cyber-video-tab.js вішає .is-open на #cyber-video-tab. Ловимо це
    // замість того, щоб лізти в його внутрішній код або дублювати
    // логіку прелоадера.

    render();   // початковий кадр: «—», кнопка неактивна

    if (!tab) {
      load();                                  // таблички немає — вантажимо одразу
    } else if (tab.classList.contains('is-open')) {
      load();                                  // встигла відкритись раніше за нас
    } else {
      var mo = new MutationObserver(function () {
        if (tab.classList.contains('is-open')) {
          mo.disconnect();
          load();
        }
      });
      mo.observe(tab, { attributes: true, attributeFilter: ['class'] });
    }

    // Публічні ручки
    window.CvtLikes = {
      refresh: function () { fetched = false; load(); },
      state: function () { return { slug: slug, count: count, liked: liked, loaded: loaded }; }
    };
  });
})();
