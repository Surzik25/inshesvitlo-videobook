// Підключати цим <script> ПЕРШИМ, до sound-effects.js, скрипта скриньки
// та скрипта з playFlowSound — вони всі мають читати цей спільний стан.
window.SoundPrefs = (function () {
  const STORAGE_KEY = 'soundMuted';
  let muted = localStorage.getItem(STORAGE_KEY) === '1';
  const listeners = new Set();

  function isMuted() {
    return muted;
  }

  function setMuted(value) {
    muted = !!value;
    localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
    listeners.forEach((fn) => fn(muted));
  }

  function toggle() {
    setMuted(!muted);
    return muted;
  }

  // Дозволяє скриптам (наприклад AudioContext-звуку) миттєво реагувати
  // на перемикання, а не лише перевіряти стан перед стартом звуку
  function onChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  return { isMuted, setMuted, toggle, onChange };
})();
