document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const lottie = document.getElementById("preloader-lottie");
  const preloaderText = document.getElementById("preloader-text");
  const progressFill = document.getElementById("progress-fill");

  const lottieReady = new Promise((resolve) => {
    if (lottie.dotLottie) resolve();
    else lottie.addEventListener("ready", () => resolve(), { once: true });
  });

  /* ---------- профіль мережі/пристрою ---------- */
  const conn = navigator.connection || {};
  const slowNet = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || "");
  const isMobile = matchMedia("(hover: none), (max-width: 900px)").matches;
  const cores = navigator.hardwareConcurrency || 4;

  const FG_CONCURRENCY = slowNet ? 3 : isMobile ? 6 : Math.min(12, cores * 2);
  const BG_CONCURRENCY = slowNet ? 1 : isMobile ? 2 : 4;

  /* ---------- аудіо (без змін по суті) ---------- */
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  function playBeep(frequency, duration = 0.07, type = "square", volume = 0.05) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + duration);
  }
  function playPercentTone(p) { playBeep(220 + 660 * (p / 100), 0.06, "square", 0.04); }
  function playReadyChime() {
    [523.25, 659.25, 783.99].forEach((f, i) =>
      setTimeout(() => playBeep(f, 0.15, "square", 0.06), i * 100));
  }

  /* ---------- завантаження ---------- */
  const seen = new Set();

  function preloadImage(src, priority = "auto") {
    if (seen.has(src)) return Promise.resolve();
    seen.add(src);
    return new Promise((resolve) => {
      const img = new Image();
      if ("fetchPriority" in img) img.fetchPriority = priority;
      img.decoding = "async";
      // важливо: НЕ тримаємо посилання на img — покладаємось на HTTP-кеш,
      // інакше на мобілці 150 декодованих бітмапів з'їдять сотні МБ RAM
      img.onload = img.onerror = () => resolve();
      img.src = src;
    });
  }

  // пул воркерів: N паралельних завантажень, черга рухається сама
  async function loadPool(list, concurrency, priority, onProgress) {
    let i = 0, done = 0;
    const worker = async () => {
      while (i < list.length) {
        await preloadImage(list[i++], priority);
        onProgress && onProgress(++done, list.length);
      }
    };
    await Promise.all(
      Array.from({ length: Math.min(concurrency, list.length) }, worker)
    );
  }

  /* ---------- прогрес без layout-трешу ---------- */
  let pendingPercent = -1, rafId = null, lastTone = -1;
  function setProgress(done, total) {
    const percent = Math.round((done / total) * 100);
    if (percent === pendingPercent) return;
    pendingPercent = percent;
    if (percent !== lastTone && percent % 2 === 0) { // біпи рідше = менше навантаження
      playPercentTone(percent);
      lastTone = percent;
    }
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      progressFill.style.width = pendingPercent + "%";
      preloaderText.textContent = `Loading: ${pendingPercent}%`;
    });
  }

  /* ---------- фонове довантаження ---------- */
  function scheduleBackground(list) {
    if (conn.saveData) return; // поважаємо Data Saver — не вантажимо взагалі
    const start = () => loadPool(list, BG_CONCURRENCY, "low");
    // чекаємо, поки головна відмалюється й браузер справді простоює
    const kick = () =>
      "requestIdleCallback" in window
        ? requestIdleCallback(start, { timeout: 5000 })
        : setTimeout(start, 2000);
    setTimeout(kick, isMobile ? 2500 : 1000);
  }

  async function startLoading() {
    const data = await (await fetch("images-list.json")).json();
	
	// ФАЗА 1 — тільки те, що видно на головній
    await loadPool(data.images, FG_CONCURRENCY, "high", setProgress);

    preloaderText.textContent = "Readyy!";
    playReadyChime();

    setTimeout(() => {
      preloader.style.transition = "opacity 0.5s ease";
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.remove();
        window.__preloaderHidden = true;
        document.dispatchEvent(new CustomEvent("preloader:hidden"));
        // ФАЗА 2 — решта, тихо, у фоні
        scheduleBackground(data.images2);
      }, 500);
    }, 500);
  }

  preloader.addEventListener("click", async () => {
    preloader.classList.add("active");
    if (audioCtx.state === "suspended") await audioCtx.resume();
    await lottieReady;
    const inst = lottie.dotLottie;
    if (inst && typeof inst.play === "function") inst.play();
    else lottie.setAttribute("autoplay", "");
    preloaderText.textContent = "Loading: 0%";
    startLoading();
  }, { once: true });

  // бонус: якщо юзер пішов на іншу вкладку — не палимо його трафік/батарею
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && audioCtx.state === "running") audioCtx.suspend();
  });
});
