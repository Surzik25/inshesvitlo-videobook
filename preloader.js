document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const lottie = document.getElementById("preloader-lottie");
  const preloaderText = document.getElementById("preloader-text");
  const progressFill = document.getElementById("progress-fill");

  // Кастомний елемент dotlottie-wc реєструється асинхронно (модульний скрипт),
  // тож чекаємо, поки браузер його "апгрейдить", перш ніж викликати .play()
  const lottieReady = new Promise((resolve) => {
  if (lottie.dotLottie) {
    resolve();
  } else {
    lottie.addEventListener("ready", () => resolve(), { once: true });
  }
});

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playBeep(frequency, duration = 0.07, type = "square", volume = 0.05) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type; // "square" дає характерний 8-бітний звук
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  }

  function playPercentTone(percent) {
    // Частота росте від ~220Hz до ~880Hz залежно від відсотка
    const minFreq = 220;
    const maxFreq = 880;
    const freq = minFreq + (maxFreq - minFreq) * (percent / 100);
    playBeep(freq, 0.06, "square", 0.04);
  }

  function playReadyChime() {
    // Коротка висхідна мелодія з 3 нот
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      setTimeout(() => playBeep(freq, 0.15, "square", 0.06), i * 100);
    });
  }

  function preloadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = src;
    });
  }

  async function startLoading() {
    const response = await fetch("images-list.json");
    const data = await response.json();
    const allImages = [...data.images, ...data.images2];

    let loadedCount = 0;
    let lastPlayedPercent = -1;

    for (let i = 0; i < allImages.length; i++) {
      await preloadImage(allImages[i]);
      loadedCount++;
      const percent = Math.round((loadedCount / allImages.length) * 100);

      if (percent !== lastPlayedPercent) {
        playPercentTone(percent);
        lastPlayedPercent = percent;
      }

      progressFill.style.width = percent + "%";
      preloaderText.textContent = `Завантаження: ${percent}%`;
    }

    preloaderText.textContent = "Готово!";
    playReadyChime();

    setTimeout(() => {
      preloader.style.opacity = "0";
      preloader.style.transition = "opacity 0.5s ease";
      setTimeout(() => preloader.remove(), 500);
    }, 500);
  }

preloader.addEventListener(
  "click",
  async () => {
    // знімаємо чорно-білий фільтр (клас тепер на #preloader, тож фон теж стає кольоровим)
    preloader.classList.add("active");

    // запускаємо аудіоконтекст (потрібен саме user gesture)
    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }

    // чекаємо, поки dotlottie-wc точно готовий (WASM завантажено, .dotLottie існує),
    // і лише тоді запускаємо анімацію
    await lottieReady;

    const dotLottieInstance = lottie.dotLottie;
    if (dotLottieInstance && typeof dotLottieInstance.play === "function") {
      dotLottieInstance.play();
    } else {
      // фолбек, якщо з якоїсь причини інстанс ще не готовий
      lottie.setAttribute("autoplay", "");
    }

    preloaderText.textContent = "Завантаження: 0%";

    startLoading();
  },
  { once: true }
);
});
