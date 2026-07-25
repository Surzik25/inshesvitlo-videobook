/**
 * Sound effects on hover / click — читацька сторінка
 * Звуки лежать у ../../sound/read/
 */

(function () {
  const SOUND_DIR = '../../sound/read/';
  const IMAGES_DIR = '../../images/';

  const config = [
    { selector: '.pattern-button-lit', hover: 'hoverDef.mp3', active: 'pageArrowClick.mp3' },
    { selector: '.pattern-button', hover: 'hoverDef.mp3', active: 'pageArrowClick.mp3' },
    { selector: '.dark-mode', hover: 'hoverDef.mp3', active: 'udark.mp3' },
    { selector: '.breadcrumb-button', hover: 'hoverDef.mp3' },
    { selector: '.welcome-btn1', hover: 'hoverDef.mp3' },
  { selector: '.nav-button', hover: 'navBtnHover.mp3', active: 'hoverDef.mp3' },
    { selector: '.control-button', hover: 'hoverDef.mp3', active: 'vidControlsClick.mp3' },
    { selector: '.welcome-btn2', hover: 'hoverDef.mp3', active: 'chop-chop.mp3' },
    { selector: '.map-content', active: 'mapGrab.mp3' },
    { selector: '.markers-small', hover: 'mapMarker.mp3' },
    { selector: '.marker-klocha', hover: 'mapMarker.mp3' },
    { selector: '.marker-perpere', hover: 'mapMarker.mp3' },
  ];

  // Кеш аудіо-об'єктів, щоб не створювати новий Audio() щоразу
  const audioCache = new Map();

  // 🔇 Заглушення звукових ефектів — спільний стан з sound-mute-state.js
  const soundBtn = document.getElementById('soundBtn');

  function updateSoundBtnUI() {
    if (!soundBtn) return;
    soundBtn.style.backgroundImage = window.SoundPrefs.isMuted()
      ? `url('${IMAGES_DIR}no-sound-btn.png')`
      : ''; // повертаємо дефолтне фонове зображення, задане в CSS
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      window.SoundPrefs.toggle();
      updateSoundBtnUI();
    });
  }
  updateSoundBtnUI();

  function getAudio(fileName) {
    if (!audioCache.has(fileName)) {
      const audio = new Audio(SOUND_DIR + fileName);
      audio.preload = 'auto';
      audioCache.set(fileName, audio);
    }
    return audioCache.get(fileName);
  }

  function playSound(fileName) {
    if (!fileName || window.SoundPrefs.isMuted()) return;
    const base = getAudio(fileName);
    // Клонуємо, щоб швидкі повторні ховери/кліки не обривали попередній звук
    const instance = base.cloneNode();
    instance.play().catch(() => {
      // ігноруємо помилки автоплею (наприклад, до першої взаємодії користувача)
    });
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

  // Початкова прив'язка
  document.addEventListener('DOMContentLoaded', () => attachHandlers());

  // Якщо елементи (наприклад маркери карти) додаються динамічно —
  // стежимо за DOM і навішуємо звук на нові вузли
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      m.addedNodes.forEach((node) => {
        if (node.nodeType === 1) attachHandlers(node.parentElement || document);
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();