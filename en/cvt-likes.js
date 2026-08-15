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
 *  ─────────────────────────────────────────────────────────────────────
 *  ТЕСТОВИЙ (МОК) РЕЖИМ — щоб подивитись анімації без Cloudflare
 *  ─────────────────────────────────────────────────────────────────────
 *  Відкрили index.html просто подвійним кліком (адресний рядок починається
 *  з file://) — справжнього Worker'а там нема й не буде, fetch завжди
 *  провалиться, кнопка лишиться мертвою. Тому в такому разі скрипт САМ
 *  підміняє мережевий запит на фейковий лічильник у localStorage:
 *  клік працює, три кадри (empty/set/full) можна побачити наживо.
 *
 *  Як увімкнути/вимкнути вручну (для http/https теж):
 *    ?cvtLikes=mock  у адресному рядку — увімкнути тестовий режим
 *    ?cvtLikes=live  у адресному рядку — примусово силою вимкнути,
 *                    навіть на file:// (щоб перевірити реальний Worker)
 *
 *  Ручки для консолі:
 *    CvtLikes.state()      — поточний стан
 *    CvtLikes.refresh()     — перечитати з (мок-)сервера
 *    CvtLikes.isMock()      — чи зараз тестовий режим
 *    CvtLikes.resetMock()   — скинути тестовий лічильник до стартового
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

  // ─────────────────────────────────────────────────────────────────────
  //  ТЕСТОВИЙ РЕЖИМ (мок-сервер у localStorage) — див. коментар вище
  // ─────────────────────────────────────────────────────────────────────

  var MOCK_LS_PREFIX = 'cvtMock:';
  var MOCK_START_COUNT = 1167;   // з чого стартує лічильник у тестовому режимі
  var MOCK_DELAY_MS = 220;     // імітація мережевої затримки, щоб відчувалось як сервер

  function queryParam(name) {
    try {
      return new URLSearchParams(location.search).get(name);
    } catch (e) {
      return null;
    }
  }

  function resolveMockMode() {
    var forced = queryParam('cvtLikes');
    if (forced === 'live') return false;
    if (forced === 'mock') return true;
    // За замовчуванням: file:// (просто відкрили html подвійним кліком)
    // не має де взяти справжній Worker — тестовий режим сам увімкнеться.
    return location.protocol === 'file:';
  }

  var IS_MOCK = resolveMockMode();

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
    var heart = document.getElementById('cvt-like-heart');

    // Розмітки немає — тихо йдемо, нічого не ламаючи (як у cyber-video-tab.js)
    if (!wrap || !btn || !out) {
      log('розмітки лайка немає — виходжу');
      return;
    }

    // ── Серце: 3 стани (empty / set / full) ─────────────────────────────
    //
    //   is-state-empty  нема лайка       — CSS-фон, статична картинка/луп
    //   is-state-set    лайк СТАВИТЬСЯ   — РУЧНА секвенція 10 окремих PNG,
    //                   кадр за кадром, від першого до останнього, раз
    //   is-state-full   лайк ПОСТАВЛЕНО  — CSS-фон, з'являється по закінченню set
    //
    // Раніше "set" був анімованим APNG-файлом: браузер сам вирішував, коли
    // і які кадри малювати, і на слабких пристроях/вкладках у фоні міг
    // пропускати кадри або уривати анімацію на половині. Тепер кожен кадр —
    // окремий PNG (../images/likeSet seq/likeFull0001.webp … 0010.png),
    // і JS явно виставляє їх по одному через setInterval: гарантовано
    // весь список 1→10 і без пропусків, незалежно від навантаження.
    var reduceMotion = !!(window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    var SET_DIR    = '../images/likeSet seq/';
    var SET_PREFIX = 'likeFull';
    var SET_FRAMES = 10;   // кадрів у секвенції
    var SET_FPS    = 10;   // 10 кадрів за секунду — як у ТЗ
    var SET_FRAME_MS = Math.round(1000 / SET_FPS);

    /** likeFull0001.png … likeFull0010.png — 4-значний номер кадру. */
    function setFrameUrl(n) {
      var num = String(n).padStart(4, '0');
      return SET_DIR + SET_PREFIX + num + '.webp';
    }

    var setFrameUrls = [];
    for (var fi = 1; fi <= SET_FRAMES; fi++) setFrameUrls.push(setFrameUrl(fi));

    // Попереднє завантаження всіх 10 кадрів у кеш браузера. Без цього
    // перший показ секвенції підвантажував би кадри по мірі програвання
    // і на повільній мережі анімація гальмувала б або блимала порожнім
    // місцем на середині. Робимо це одразу при ініціалізації кнопки,
    // а не в момент кліку — коли лайкають, усе вже в кеші.
    var setFramesPreloaded = false;
    function preloadSetFrames() {
      if (setFramesPreloaded) return;
      setFramesPreloaded = true;
      setFrameUrls.forEach(function (url) {
        var img = new Image();
        img.src = url;
      });
    }

    var heartTimer = null;   // setInterval між кадрами set

    function cancelHeartTimer() {
      if (heartTimer) { clearTimeout(heartTimer); heartTimer = null; }
    }

    function showHeart(state) {
      if (!heart) return;
      heart.classList.remove('is-state-empty', 'is-state-set', 'is-state-full');
      heart.classList.add('is-state-' + state);
      // Кадр секвенції прописується inline-стилем (див. setFrame нижче),
      // тож коли ми йдемо в empty/full — прибираємо його, щоб не лишався
      // "заморожений" кадр set під новим фоном з CSS.
      if (state !== 'set') heart.style.backgroundImage = '';
    }

    /** Виставити конкретний кадр секвенції "set" (1..SET_FRAMES). */
    function setFrame(n) {
      if (!heart) return;
      heart.style.backgroundImage = 'url("' + setFrameUrl(n) + '")';
    }

    /** Миттєвий стрибок без перехідного ролика — для завантаження стану й відкату. */
    function syncHeartInstant(isLiked) {
      cancelHeartTimer();
      showHeart(isLiked ? 'full' : 'empty');
    }

    /**
     * Користувач лайкнув: гарантовано проганяємо кадри 1→10 секвенції
     * "set" по черзі (setInterval, а не CSS/APNG-анімація), тоді самі
     * переходимо на "full". Так анімація завжди виконується від першого
     * до останнього кадру й ніде не переривається.
     */
    function playHeartOn() {
      cancelHeartTimer();
      if (reduceMotion) { showHeart('full'); return; }

      showHeart('set');
      var frame = 1;
      setFrame(frame);

      heartTimer = setInterval(function () {
        frame += 1;
        if (frame > SET_FRAMES) {
          clearInterval(heartTimer);
          heartTimer = null;
          showHeart('full');
          return;
        }
        setFrame(frame);
      }, SET_FRAME_MS);
    }

    /** Користувач знімає лайк: одразу empty, без перехідної анімації. */
    function playHeartOff() {
      cancelHeartTimer();
      showHeart('empty');
    }

    var slug    = wrap.getAttribute('data-slug') || 'default';
    var lsKey   = LS_PREFIX + slug;
    var endpoint = API_BASE + '/' + encodeURIComponent(slug);

    // ── Мок-сервер: та сама логіка toggle'а, що й у Worker'і, але
    //    рахунок і "хто вже лайкнув" тримаємо в localStorage поточного
    //    браузера. Кожен, хто відкриє цей файл, — свій "користувач". ──
    var mockCountKey = MOCK_LS_PREFIX + slug + ':count';
    var mockLikedKey = MOCK_LS_PREFIX + slug + ':liked';

    function mockRead() {
      var rawCount = localStorage.getItem(mockCountKey);
      var count = rawCount === null ? MOCK_START_COUNT : parseInt(rawCount, 10);
      if (!Number.isFinite(count) || count < 0) count = MOCK_START_COUNT;
      var liked = localStorage.getItem(mockLikedKey) === '1';
      return { count: count, liked: liked };
    }

    function mockRequest(method) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          var state = mockRead();
          if (method === 'POST') {
            state.liked = !state.liked;
            state.count = Math.max(0, state.count + (state.liked ? 1 : -1));
            localStorage.setItem(mockCountKey, String(state.count));
            localStorage.setItem(mockLikedKey, state.liked ? '1' : '0');
          }
          resolve({ count: state.count, liked: state.liked });
        }, MOCK_DELAY_MS);
      });
    }

    if (IS_MOCK) {
      log('УВІМКНЕНО ТЕСТОВИЙ РЕЖИМ (мок-сервер у localStorage, без Cloudflare) — ?cvtLikes=live щоб вимкнути');
    }

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
      if (IS_MOCK) return mockRequest(method);

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
          syncHeartInstant(liked);   // початковий стан — без перехідного ролика
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
      var optimisticLiked = !liked;

      // Оптимістично: інтерфейс реагує зараз, мережа наздогонить
      liked = optimisticLiked;
      count = Math.max(0, (count || 0) + (liked ? 1 : -1));
      localStorage.setItem(lsKey, liked ? '1' : '0');
      render({ bump: true });
      if (liked) {
        playHeartOn();           // likeEmpty → likeSet (раз) → likeFull
        pop();
        sfx('like.mp3');
      } else {
        playHeartOff();          // одразу назад у likeEmpty, без ролика
      }

      request('POST')
        .then(function (data) {
          // Сервер міг не погодитись (уже лайкав з іншої вкладки,
          // спрацював rate limit і т.д.) — вирівнюємось по ньому
          if (typeof data.count === 'number') count = data.count;
          if (typeof data.liked === 'boolean') liked = data.liked;
          localStorage.setItem(lsKey, liked ? '1' : '0');
          if (liked !== optimisticLiked) {
            // Сервер повернув стан, відмінний від нашого оптимістичного —
            // синхронізуємось миттєво, ролик set НЕ повторюємо
            syncHeartInstant(liked);
          }
          render({ bump: true });
        })
        .catch(function (err) {
          liked = prevLiked;
          count = prevCount;
          localStorage.setItem(lsKey, liked ? '1' : '0');
          syncHeartInstant(liked);   // відкат — миттєво, без ролика
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

    // Кадри "set"-секвенції тягнемо в кеш одразу при ініціалізації,
    // не чекаючи кліку — до моменту лайка вони вже будуть локально.
    preloadSetFrames();

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
      state: function () { return { slug: slug, count: count, liked: liked, loaded: loaded, mock: IS_MOCK }; },
      isMock: function () { return IS_MOCK; },
      // Скинути тестовий лічильник до стартового значення й перемалювати —
      // корисно, щоб знову й знову дивитись анімацію з чистого стану.
      resetMock: function () {
        if (!IS_MOCK) { log('resetMock: не в тестовому режимі, ігноную'); return; }
        localStorage.removeItem(mockCountKey);
        localStorage.removeItem(mockLikedKey);
        fetched = false;
        cancelHeartTimer();
        load();
      }
    };

    if (IS_MOCK) {
      try {
        console.log(
          '%c[cvt-likes] ТЕСТОВИЙ РЕЖИМ увімкнено — лайки не йдуть на Cloudflare.\n' +
          'Клікайте по кнопці, щоб побачити empty → set → full.\n' +
          'CvtLikes.resetMock() — почати з чистого лічильника.\n' +
          'Додайте ?cvtLikes=live в адресний рядок, щоб перевірити справжній сервер.',
          'color:#63ffef;font-weight:bold;'
        );
      } catch (e) {}
    }
  });
})();