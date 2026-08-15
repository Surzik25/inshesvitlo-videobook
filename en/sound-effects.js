/**
 * Sound effects on hover / click
 * Звуки лежать у ../sound/
 */

(function () {
  const SOUND_DIR = '../sound/';
  const MUSIC_DIR = '../music/';
  const MUSIC_TRACK = 'DLsample2.MP3';
  const IMAGES_DIR = '../images/';
  const MUSIC_START_DELAY = 800; // ⏱ затримка перед стартом музики (мс)
  const MUSIC_VOLUME = 1;        // 0..1

  // 🐞 Діагностика музики в консолі. Постав false, коли все працює.
  const DEBUG_MUSIC = true;
  const mlog = (...args) => { if (DEBUG_MUSIC) console.log('[music]', ...args); };

  // Виконати колбек, коли DOM готовий (працює і якщо скрипт у <head>, і якщо в кінці <body>)
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  // =========================================================================
  // 🔊 ЗВУКОВІ ЕФЕКТИ (hover / click)
  // =========================================================================

  // Порядок важливий: більш специфічні селектори (.side-button.bkm)
  // мають йти ПЕРЕД загальними (.side-button), інакше загальний
  // селектор перехопить події і на bkm-кнопках теж.
  const config = [
    { selector: '.video-wrapper', hover: 'blockHover.mp3' },
    { selector: '.side-button.bkm', hover: 'bookmarkHover.mp3', active: 'sideBtnClick2.mp3' },
    { selector: '.side-button:not(.bkm)', hover: 'sideBtnHover.mp3', active: 'sideBtnClick2.mp3' },
    { selector: '.qa-item', hover: 'QAHover.mp3', active: 'QAClick.mp3' },
    { selector: '.video-button-space', hover: 'readHover.mp3' },
	{ selector: '.welcome-btn1', hover: 'QAHover.mp3', active: 'QAClick.mp3' },
	{ selector: '.welcome-btn2', hover: 'QAHover.mp3' },
  ];

  // Кеш аудіо-об'єктів, щоб не створювати новий Audio() щоразу
  const audioCache = new Map();

  function getAudio(fileName) {
    if (!audioCache.has(fileName)) {
      const audio = new Audio(SOUND_DIR + fileName);
      audio.preload = 'auto';
      audioCache.set(fileName, audio);
    }
    return audioCache.get(fileName);
  }

  function playSound(fileName) {
    if (!fileName) return;
    if (window.SoundPrefs && window.SoundPrefs.isMuted()) return;
    if (soundMuted) return;
    const base = getAudio(fileName);
    // Клонуємо, щоб швидкі повторні ховери/кліки не обривали попередній звук
    const instance = base.cloneNode();
    instance.play().catch(() => {
      // ігноруємо помилки автоплею (наприклад, до першої взаємодії користувача)
    });
  }

  // --- 🔇 Кнопка soundBtn — заглушення звукових ефектів на цій сторінці ---
  let soundMuted = window.SoundPrefs ? window.SoundPrefs.isMuted() : localStorage.getItem('soundMuted') === '1';
  let soundBtn = null;

  function updateSoundBtnUI() {
    if (!soundBtn) return;
    soundBtn.style.backgroundImage = soundMuted
      ? `url('${IMAGES_DIR}no-sound-btn.webp')`
      : ''; // повертаємо дефолтне фонове зображення, задане в CSS
  }

  function toggleSound() {
    if (window.SoundPrefs) {
      soundMuted = window.SoundPrefs.toggle();
    } else {
      soundMuted = !soundMuted;
      localStorage.setItem('soundMuted', soundMuted ? '1' : '0');
    }
    updateSoundBtnUI();
  }

  function attachHandlers(root = document) {
    config.forEach(({ selector, hover, active }) => {
      root.querySelectorAll(selector).forEach((el) => {
        if (el.dataset.soundBound) return; // не навішуємо двічі
        el.dataset.soundBound = '1';

        if (hover) {
          el.addEventListener('mouseenter', () => playSound(hover));
        }
        if (active) {
          // 'mousedown' точніше відповідає моменту :active, ніж 'click'
          el.addEventListener('mousedown', () => playSound(active));
        }
      });
    });
  }

  // =========================================================================
  // 🎵 ФОНОВА МУЗИКА
  // =========================================================================
  //
  // ЧОМУ РАНІШЕ НЕ ПРАЦЮВАЛО:
  // play() викликався з setTimeout(..., 800) вже ПІСЛЯ того, як клік по
  // прелоадеру завершився. Для браузера це "автоплей без жесту користувача",
  // тому обіцянка відхилялась. Кнопка musicBtn працювала, бо там play()
  // виконується прямо всередині обробника кліку.
  //
  // ЯК ПРАЦЮЄ ТЕПЕР:
  // 1) На першому ж жесті (це і є клік по прелоадеру) запускаємо трек
  //    ПРИГЛУШЕНИМ — muted-плей браузери дозволяють завжди, а елемент при
  //    цьому стає "розблокованим".
  // 2) Коли прелоадер зник — просто знімаємо mute і скидаємо currentTime на 0.
  //    Зняття mute не вимагає жесту, тож нічого блокуватися не може.
  // 3) Якщо крок 1 з якоїсь причини не вдався — є фолбек на звичайний play()
  //    і повторна спроба на наступному жесті (пере-озброюється щоразу).

  const musicEl = new Audio(MUSIC_DIR + MUSIC_TRACK);
  musicEl.loop = true;
  musicEl.preload = 'auto';
  musicEl.volume = MUSIC_VOLUME;

  let musicMuted = localStorage.getItem('musicMuted') === '1';
  let musicBtn = null;

  let primed = false;         // чи вже пробували "розблокувати" елемент
  let primedPlaying = false;  // чи трек реально грає (беззвучно) після прайму
  let wantPlaying = false;    // синхронний намір: музика має бути чутною
  let scheduled = false;      // чи вже запланований старт
  let retryArmed = false;

  function updateMusicBtnUI() {
    if (!musicBtn) return;
    musicBtn.style.backgroundImage = musicMuted
      ? `url('${IMAGES_DIR}no-music-btn.webp')`
      : ''; // повертаємо дефолтне фонове зображення, задане в CSS
  }

  // Крок 1: беззвучний старт всередині жесту користувача
  function primeMusic() {
    if (primed) return;
    primed = true;
    musicEl.muted = true;
    Promise.resolve(musicEl.play())
      .then(() => {
        primedPlaying = true;
        mlog('трек розблоковано і грає беззвучно ✅');
        if (wantPlaying) {
          reveal('prime-flush'); // прелоадер зник раніше, ніж прайм встиг
        } else if (musicMuted) {
          // користувач тримає музику вимкненою — не крутимо трек даремно
          musicEl.pause();
          musicEl.currentTime = 0;
        }
      })
      .catch((err) => {
        primedPlaying = false;
        musicEl.muted = false;
        mlog('прайм не вдався ❌', err && err.name, err && err.message);
      });
  }

  // Крок 2: робимо музику чутною
  function reveal(reason) {
    try { musicEl.currentTime = 0; } catch (e) { /* ignore */ }
    musicEl.muted = false;
    musicEl.volume = MUSIC_VOLUME;
    mlog('музика зазвучала ✅ —', reason);
  }

  function startMusic(reason) {
    if (musicMuted) {
      mlog(
        'пропускаю старт — musicMuted=true (localStorage "musicMuted"="1").',
        'Натисни musicBtn або виконай localStorage.removeItem("musicMuted") і перезавантаж сторінку.'
      );
      return;
    }
    wantPlaying = true;

    // Найкращий випадок: трек уже грає беззвучно — просто знімаємо mute
    if (primedPlaying && !musicEl.paused) {
      reveal(reason);
      return;
    }

    // Фолбек: звичайний play()
    musicEl.muted = false;
    Promise.resolve(musicEl.play())
      .then(() => mlog('музика зазвучала ✅ (fallback play) —', reason))
      .catch((err) => {
        mlog('play заблоковано ❌ —', reason, err && err.name);
        armInteractionRetry();
      });
  }

  // Повторна спроба на наступному жесті — пере-озброюється щоразу,
  // тож одна невдача не вбиває музику на всю сесію
  function armInteractionRetry() {
    if (retryArmed) return;
    retryArmed = true;
    const retry = () => {
      retryArmed = false;
      document.removeEventListener('pointerdown', retry, true);
      document.removeEventListener('keydown', retry, true);
      startMusic('retry-after-interaction');
    };
    document.addEventListener('pointerdown', retry, { once: true, capture: true });
    document.addEventListener('keydown', retry, { once: true, capture: true });
  }

  function schedulePlayMusic(reason) {
    if (scheduled) return;
    scheduled = true;
    mlog('старт запланований через', MUSIC_START_DELAY, 'мс —', reason);
    setTimeout(() => startMusic(reason), MUSIC_START_DELAY);
  }

  function toggleMusic() {
    musicMuted = !musicMuted;
    localStorage.setItem('musicMuted', musicMuted ? '1' : '0');
    updateMusicBtnUI();

    if (musicMuted) {
      wantPlaying = false;
      musicEl.pause();
      mlog('вимкнено кнопкою');
    } else {
      startMusic('musicBtn');
    }
  }

  // Страховка: якщо подія 'preloader:hidden' з якоїсь причини не долетіла
  // (порядок підключення скриптів, помилка в preloader.js тощо) —
  // ловимо сам факт зникнення #preloader із DOM
  function watchPreloaderRemoval() {
    const mo = new MutationObserver(() => {
      const el = document.getElementById('preloader');
      if (!el || !el.isConnected) {
        mo.disconnect();
        schedulePlayMusic('preloader зник із DOM (страховка)');
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  // =========================================================================
  // 🚀 ІНІЦІАЛІЗАЦІЯ (все — після готовності DOM, щоб getElementById працював
  //    незалежно від того, де підключений цей скрипт)
  // =========================================================================

  onReady(() => {
    // --- кнопки ---
    soundBtn = document.getElementById('soundBtn');
    if (soundBtn) soundBtn.addEventListener('click', toggleSound);
    if (window.SoundPrefs) {
      window.SoundPrefs.onChange((muted) => {
        soundMuted = muted;
        updateSoundBtnUI();
      });
    }
    updateSoundBtnUI();

    musicBtn = document.getElementById('musicBtn');
    if (musicBtn) {
      musicBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // щоб клік по кнопці не вважався кліком по прелоадеру
        toggleMusic();
      });
    }
    updateMusicBtnUI();

    // --- звукові ефекти ---
    attachHandlers();
    if (document.body) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === 1) attachHandlers(node.parentElement || document);
          });
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    // --- 🔑 перший жест користувача: розблоковуємо аудіо ---
    // capture:true, щоб зловити подію РАНІШЕ за обробник кліку прелоадера
    const gestureEvents = ['pointerdown', 'mousedown', 'touchstart', 'keydown', 'click'];
    const onFirstGesture = () => {
      gestureEvents.forEach((t) => document.removeEventListener(t, onFirstGesture, true));
      mlog('перший жест користувача — праймлю аудіо');
      primeMusic();
    };
    gestureEvents.forEach((t) => document.addEventListener(t, onFirstGesture, true));

    // --- коли стартувати музику ---
    const preloaderEl = document.getElementById('preloader');
    if (preloaderEl) {
      mlog('прелоадер знайдено — чекаю на "preloader:hidden"');
      if (window.__preloaderHidden) {
        schedulePlayMusic('прапорець __preloaderHidden уже стоїть');
      } else {
        document.addEventListener('preloader:hidden', () => schedulePlayMusic('preloader:hidden'), { once: true });
        watchPreloaderRemoval();
      }
    } else if (document.readyState === 'complete') {
      mlog('прелоадера на сторінці немає — стартую одразу');
      schedulePlayMusic('без прелоадера, readyState=complete');
    } else {
      mlog('прелоадера на сторінці немає — чекаю window load');
      window.addEventListener('load', () => schedulePlayMusic('без прелоадера, window load'), { once: true });
    }
  });

  // 🧪 Ручка для дебагу з консолі: __music.state(), __music.start(), __music.reset()
  window.__music = {
    el: musicEl,
    state: () => ({
      musicMuted,
      primed,
      primedPlaying,
      wantPlaying,
      scheduled,
      paused: musicEl.paused,
      muted: musicEl.muted,
      currentTime: musicEl.currentTime,
      readyState: musicEl.readyState,
      src: musicEl.currentSrc || musicEl.src,
    }),
    start: () => startMusic('manual'),
    reset: () => { localStorage.removeItem('musicMuted'); location.reload(); },
  };
})();


