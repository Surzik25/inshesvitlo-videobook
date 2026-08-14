/**
 * CYBER VIDEO TAB - неонова табличка з вбудованим YouTube-відео
 * Стилі: cyber-video-tab.css
 *
 * ЩО РОБИТЬ:
 *  1. Автоматичний показ ВИМКНЕНО.
 *     Табличка відкривається тільки вручну через консоль.
 *  2. iframe вантажиться ЛИШЕ після кліку по PLAY - до того
 *     в бік YouTube не йде ані байта.
 *  3. Коли користувач запускає відео:
 *       - програмно тицяємо #musicBtn, тобто йде рідний toggleMusic()
 *         із sound-effects.js: музика на паузу, іконка міняється,
 *         стан лягає в localStorage. Якщо музика вже вимкнена -
 *         НЕ перемикаємо, щоб не увімкнути навпаки;
 *       - ставимо на паузу прев'ю-блоки line3 / line4, запам'ятавши,
 *         хто з них реально грав.
 *  4. Хрестик / Esc / клік по бекдропу / кінець відео - закриває табличку,
 *     прибирає iframe і ВІДНОВЛЮЄ прев'ю-блоки line3 / line4.
 *
 * НІЧОГО НЕ ПЕРЕЗАПИСУЄ: preloader.js, sound-effects.js і наявні стилі
 * лишаються як були - тут тільки читання стану та клік по існуючій кнопці.
 *
 * Ручки для консолі: CyberVideoTab.open() / .close() / .play()
 */
(function () {
  'use strict';

  var VIDEO_ID   = 'qRQbisLviwA';
  var SHOW_DELAY = 6000;
  var IFRAME_ID  = 'cvt-iframe';
  var SOUND_DIR  = '../sound/';

  // Постав true, якщо треба бачити хроніку в консолі
  var DEBUG = false;

  function log() {
    if (!DEBUG) return;
    try {
      console.log.apply(console, ['[cyber-video-tab]'].concat([].slice.call(arguments)));
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
    var tab      = document.getElementById('cyber-video-tab');
    var backdrop = document.getElementById('cyber-video-backdrop');
    var facade   = document.getElementById('cvt-facade');
    var slot     = document.getElementById('cvt-slot');
    var poster   = document.getElementById('cvt-poster');
    var closeBtn = document.getElementById('cvt-close');

    // Немає розмітки - тихо виходимо, нічого не ламаючи
    if (!tab || !backdrop || !facade || !slot || !closeBtn) {
      log('розмітки таблички немає - виходжу');
      return;
    }

    var opened = false;
    var lastFocus = null;
    var player = null;
    var previewState = [];

    // ===================================================================
    // МУЗИКА: перемикаємо саму кнопку #musicBtn, а не її внутрішній стан
    // ===================================================================

    function isMusicMuted() {
      return localStorage.getItem('musicMuted') === '1';
    }

    function hushMusic(reason) {
      if (isMusicMuted()) {
        log('музика вже вимкнена - не перемикаю:', reason);
        return;
      }

      var btn = document.getElementById('musicBtn');

      if (btn) {
        btn.click();
        log('musicBtn перемкнено -', reason);
        return;
      }

      // Фолбек, якщо кнопки раптом немає на сторінці
      if (window.__music && window.__music.el) {
        try { window.__music.el.pause(); } catch (e) {}
      }

      localStorage.setItem('musicMuted', '1');
      log('кнопки немає - заглушив музику напряму:', reason);
    }

    // ===================================================================
    // ПРЕВ'Ю-БЛОКИ line3 / line4 - пауза на час перегляду YouTube
    // ===================================================================

    function getPreviewVideos() {
      return [
        document.getElementById('video-box'),
        document.getElementById('video-box2')
      ].filter(Boolean);
    }

    function pausePreviewVideos() {
      // Якщо стан уже знято - не перезаписуємо його
      if (previewState.length) return;

      previewState = getPreviewVideos().map(function (video) {
        return {
          el: video,
          wasPlaying: !video.paused && !video.ended
        };
      });

      previewState.forEach(function (item) {
        try { item.el.pause(); } catch (e) {}
      });

      if (previewState.length) {
        log('прев-ю line3/line4 на паузі');
      }
    }

    function resumePreviewVideos() {
      previewState.forEach(function (item) {
        if (!item.wasPlaying) return;

        try {
          var p = item.el.play();

          if (p && typeof p.catch === 'function') {
            p.catch(function () {
              /* автоплей міг зникнути - не критично */
            });
          }
        } catch (e) {}
      });

      if (previewState.length) {
        log('прев-ю line3/line4 відновлено');
      }

      previewState = [];
    }

    // ===================================================================
    // Дрібні звуки інтерфейсу
    // ===================================================================

    var sfxCache = {};

    function sfx(file) {
      if (window.SoundPrefs && window.SoundPrefs.isMuted()) return;

      var base = sfxCache[file] ||
        (sfxCache[file] = new Audio(SOUND_DIR + file));

      var inst = base.cloneNode();

      inst.play().catch(function () {
        /* автоплей до першого жесту */
      });
    }

    facade.addEventListener('mouseenter', function () {
      sfx('blockHover.mp3');
    });

    closeBtn.addEventListener('mouseenter', function () {
      sfx('QAHover.mp3');
    });

    closeBtn.addEventListener('mousedown', function () {
      sfx('QAClick.mp3');
    });

    // ===================================================================
    // Постер
    // ===================================================================

    var posterStarted = false;

    function loadPoster() {
      if (posterStarted || !poster) return;

      posterStarted = true;

      poster.addEventListener('error', function onErr() {
        // maxres є не в кожного відео - тихо падаємо на hqdefault
        poster.removeEventListener('error', onErr);

        poster.src =
          'https://i.ytimg.com/vi/' +
          VIDEO_ID +
          '/hqdefault.jpg';
      });

      poster.src =
        poster.getAttribute('data-src') ||
        ('https://i.ytimg.com/vi/' +
         VIDEO_ID +
         '/maxresdefault.jpg');
    }

    // ===================================================================
    // ЗАПУСК ВІДЕО
    // ===================================================================

    function buildEmbedSrc() {
      var src =
        'https://www.youtube.com/embed/' +
        VIDEO_ID +
        '?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1';

      // origin потрібен для JS API, але лише на http(s)
      if (
        location.protocol === 'http:' ||
        location.protocol === 'https:'
      ) {
        src += '&origin=' + encodeURIComponent(location.origin);
      }

      return src;
    }

    function play() {
      if (document.getElementById(IFRAME_ID)) return;

      // Користувач сам запустив відео
      hushMusic('користувач натиснув PLAY');
      pausePreviewVideos();

      var iframe = document.createElement('iframe');

      iframe.id = IFRAME_ID;
      iframe.className = 'cvt-iframe';
      iframe.title = 'Different Light - video';
      iframe.src = buildEmbedSrc();

      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; ' +
        'gyroscope; picture-in-picture; web-share';

      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.setAttribute('allowfullscreen', '');

      slot.appendChild(iframe);

      facade.classList.add('is-gone');

      // YouTube API
      ensureYouTubeApi(function () {
        try {
          player = new YT.Player(IFRAME_ID, {
            events: {
              onStateChange: function (e) {

                if (e.data === YT.PlayerState.PLAYING) {
                  hushMusic('YouTube: PLAYING');
                  pausePreviewVideos();
                }

                if (e.data === YT.PlayerState.ENDED) {
                  close();
                }
              }
            }
          });
        } catch (err) {
          log(
            'не вдалось прицепити YT.Player (не критично)',
            err
          );
        }
      });
    }

    function killPlayer() {
      if (
        player &&
        typeof player.destroy === 'function'
      ) {
        try {
          player.destroy();
        } catch (e) {}
      }

      player = null;

      var frame = document.getElementById(IFRAME_ID);

      if (frame && frame.parentNode) {
        frame.parentNode.removeChild(frame);
      }

      facade.classList.remove('is-gone');

      resumePreviewVideos();
    }

    // ===================================================================
    // YouTube IFrame API
    // ===================================================================

    var apiRequested = false;
    var apiWaiting = [];

    function ensureYouTubeApi(cb) {
      if (window.YT && window.YT.Player) {
        cb();
        return;
      }

      apiWaiting.push(cb);

      if (apiRequested) return;

      apiRequested = true;

      var prev = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = function () {

        if (typeof prev === 'function') {
          try {
            prev();
          } catch (e) {}
        }

        var queue = apiWaiting.splice(0);

        for (var i = 0; i < queue.length; i++) {
          try {
            queue[i]();
          } catch (e) {}
        }
      };

      var s = document.createElement('script');

      s.src = 'https://www.youtube.com/iframe_api';
      s.async = true;

      document.head.appendChild(s);
    }

    // ===================================================================
    // ВІДКРИТТЯ / ЗАКРИТТЯ
    // ===================================================================

    function open() {
      if (opened) return;

      opened = true;

      loadPoster();

      backdrop.classList.add('is-open');
      tab.classList.add('is-open');

      tab.setAttribute('aria-hidden', 'false');

      lastFocus = document.activeElement;

      try {
        facade.focus({ preventScroll: true });
      } catch (e) {}

      document.addEventListener(
        'keydown',
        onKeyDown,
        true
      );

      log('табличка відкрита');
    }

    function close() {
      if (!opened) return;

      opened = false;

      tab.classList.remove('is-open');
      backdrop.classList.remove('is-open');

      tab.setAttribute('aria-hidden', 'true');

      document.removeEventListener(
        'keydown',
        onKeyDown,
        true
      );

      killPlayer();

      if (
        lastFocus &&
        typeof lastFocus.focus === 'function'
      ) {
        try {
          lastFocus.focus({
            preventScroll: true
          });
        } catch (e) {}
      }

      lastFocus = null;

      log('табличка закрита');
    }

    function onKeyDown(e) {
      if (
        e.key === 'Escape' ||
        e.key === 'Esc'
      ) {
        e.stopPropagation();
        close();
      }
    }

    facade.addEventListener('click', play);

    closeBtn.addEventListener(
      'click',
      close
    );

    backdrop.addEventListener(
      'click',
      close
    );

    tab.addEventListener(
      'click',
      function (e) {
        e.stopPropagation();
      }
    );

    // Перемикач мови закриває табличку
    var adaptBtn =
      document.getElementById('adaptBtn');

    if (adaptBtn) {
      adaptBtn.addEventListener(
        'click',
        close
      );
    }

    // ===================================================================
    // АВТОМАТИЧНИЙ ПОКАЗ ВИМКНЕНО
    //
    // Табличка більше НЕ відкривається:
    // - через 6 секунд;
    // - після preloader:hidden;
    // - після window load;
    // - через MutationObserver.
    //
    // Вона відкривається тільки вручну:
    //
    //   CyberVideoTab.open()
    //   CyberVideoTab.play()
    //   CyberVideoTab.close()
    // ===================================================================

    // ===================================================================
    // ПУБЛІЧНІ РУЧКИ
    // ===================================================================

    window.CyberVideoTab = {
      open: open,
      close: close,
      play: play,
      isOpen: function () {
        return opened;
      }
    };
  });
})();