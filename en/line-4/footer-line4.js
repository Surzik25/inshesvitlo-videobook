//це для футера
		// Create floating particles
    function createParticles() {
      const particlesContainer = document.getElementById('particles');
      const particleCount = 23;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random starting position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (4 + Math.random() * 4) + 's';
        
        // Random colors from your palette
        const colors = ['#00ecfc', '#75ffca', '#f5b464', '#ff5e13'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        particlesContainer.appendChild(particle);
      }
    }

    // Morse code easter egg
    document.querySelector('.morse-easter-egg').addEventListener('click', function() {
      this.style.animation = 'titleGlow 0.5s ease-in-out 3';
      setTimeout(() => {
        alert('-. --- - / .- .-.. .-.. / -- . - .- .--. .... --- .-. --- ... -. .. -.-. ... / -.. .. . -.. / --- ..- - .-.-.- / ... --- -- . / . ...- --- .-.. ...- . -.. / .- -. -.. / -... . -.-. .- -- . / --- -.- ..');
      }, 500);
    });


    // Initialize particles when page loads
    document.addEventListener('DOMContentLoaded', createParticles);

    // Logo click effect
    document.querySelector('.footer-logo').addEventListener('click', function() {
      this.style.animation = 'none';
      setTimeout(() => {
        this.style.animation = 'logoSpin 2s linear infinite';
      }, 10);
    });
	
	
let isUltraDark = false;
let isAnimating = false;

const MANUAL_OVERRIDE_DURATION = 60 * 60 * 1000; // 1 година в мілісекундах

const modeToggle = document.getElementById('modeToggle');
const lightOverlay = document.getElementById('lightOverlay');
const body = document.body;

// Елементи для додавання класу udark
const elements = [
    document.getElementById('topPanel'),
    document.getElementById('logo'),
    document.getElementById('objects'),
    document.getElementById('navPanel'),
    document.getElementById('mapContainer'),
    document.getElementById('footerLine4'),
    document.getElementById('footerContent'),
    document.getElementById('videoMain'),
    document.getElementById('patternLeft'),
    document.getElementById('patternRight'),
    document.getElementById('pageDate'),
    document.getElementById('svgImg'),
    document.getElementById('treasureBox'),
    document.getElementById('factImage'),
];

// Селектори для activateUdarkMode / deactivateUdarkMode
const udarkSelectors = [
    'body',
    '.top-panel',
    '.top-panel .logo',
    '.top-panel .objects',
    '.top-panel .creator',
    '.side-panel.right',
    '.qa-item',
    '.side-panel.left .side-button',
    '.side-panel.left .side-button:nth-of-type(1)',
    '.eye',
    '.speech-bubble'
];

// ─── Хелпери для ручного перевизначення ───────────────────────────────────────

/**
 * Зберігає мітку часу, коли користувач вручну переключив режим.
 */
function saveManualOverrideTime() {
    localStorage.setItem('udarkManualOverrideTime', Date.now().toString());
}

/**
 * Повертає true, якщо ручне перевизначення ще діє (< 1 години тому).
 */
function isManualOverrideActive() {
    const savedTime = localStorage.getItem('udarkManualOverrideTime');
    if (!savedTime) return false;
    return (Date.now() - parseInt(savedTime, 10)) < MANUAL_OVERRIDE_DURATION;
}

/**
 * Скидає мітку ручного перевизначення.
 */
function clearManualOverride() {
    localStorage.removeItem('udarkManualOverrideTime');
}

// ─── Завантаження збереженого стану ───────────────────────────────────────────

function loadUdarkModeToggle() {
    const savedMode = localStorage.getItem('udarkMode');
    if (savedMode === 'true') {
        // Відключаємо transitions на початку для миттєвого завантаження
        body.style.transition = 'none';

        body.classList.add('udark');
        elements.forEach(el => { if (el) el.classList.add('udark'); });

        isUltraDark = true;

        if (modeToggle) {
            modeToggle.src = '../../images2/UDMCircleIdle.gif';
        }

        setTimeout(() => { body.style.transition = ''; }, 50);
    }
}

// ─── Головна функція перемикання (ручна) ──────────────────────────────────────

function toggleMode() {
    if (isAnimating) return;
    isAnimating = true;

    // Фіксуємо ручне перевизначення
    saveManualOverrideTime();

    // Показуємо overlay
    lightOverlay.style.display = 'block';
    setTimeout(() => { lightOverlay.classList.add('show'); }, 10);

    if (!isUltraDark) {
        // Темний → Ультратемний
        modeToggle.src = '../../images2/DMCircleHover.gif';

        setTimeout(() => {
            body.classList.add('udark');
            elements.forEach(el => { if (el) el.classList.add('udark'); });

            isUltraDark = true;
            localStorage.setItem('udarkMode', 'true');

            lightOverlay.classList.remove('show');
            setTimeout(() => { lightOverlay.style.display = 'none'; }, 500);
        }, 300);

        setTimeout(() => {
            modeToggle.src = '../../images2/UDMCircleIdle.gif';
            isAnimating = false;
        }, 900);

    } else {
        // Ультратемний → Темний
        modeToggle.src = '../../images2/UDMCircleHover.gif';

        setTimeout(() => {
            body.classList.remove('udark');
            elements.forEach(el => { if (el) el.classList.remove('udark'); });

            isUltraDark = false;
            localStorage.setItem('udarkMode', 'false');

            lightOverlay.classList.remove('show');
            setTimeout(() => { lightOverlay.style.display = 'none'; }, 500);
        }, 300);

        setTimeout(() => {
            modeToggle.src = '../../images2/DMCircleIdle.gif';
            isAnimating = false;
        }, 900);
    }
}

modeToggle.addEventListener('click', toggleMode);

// Запобігаємо контекстному меню та перетягуванню
modeToggle.addEventListener('contextmenu', e => e.preventDefault());
modeToggle.addEventListener('dragstart',    e => e.preventDefault());

// ─── Авто-перемикання за часом ────────────────────────────────────────────────

/**
 * Перевіряє поточний час та перемикає режим, якщо:
 *  - ручне перевизначення вже не активне (минула 1 година або ніколи не було),
 *  - поточний стан не відповідає розкладу.
 */
function checkTimeAndToggle() {
    // Якщо користувач переключав вручну менш ніж годину тому — нічого не робимо
    if (isManualOverrideActive()) return;

    // Після закінчення блокування очищаємо мітку
    clearManualOverride();

    const currentHour = new Date().getHours();
    // udark активний з 20:00 до 7:00
    const shouldBeUdark = currentHour >= 20 || currentHour < 7;

    const isCurrentlyUdark = body.classList.contains('udark');

    if (shouldBeUdark && !isCurrentlyUdark) {
        activateUdarkMode();
    } else if (!shouldBeUdark && isCurrentlyUdark) {
        deactivateUdarkMode();
    }
}

// ─── Активація / Деактивація (без анімації) ───────────────────────────────────

function activateUdarkMode() {
    body.classList.add('udark');
    elements.forEach(el => { if (el) el.classList.add('udark'); });

    isUltraDark = true;
    localStorage.setItem('udarkMode', 'true');

    if (modeToggle) {
        modeToggle.src = '../../images2/UDMCircleIdle.gif';
    }

    udarkSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.classList.add('udark'));
    });
}

function deactivateUdarkMode() {
    body.classList.remove('udark');
    elements.forEach(el => { if (el) el.classList.remove('udark'); });

    isUltraDark = false;
    localStorage.setItem('udarkMode', 'false');

    if (modeToggle) {
        modeToggle.src = '../../images2/DMCircleIdle.gif';
    }

    udarkSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.classList.remove('udark'));
    });
}

// ─── Ініціалізація ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    // 1. Якщо є збережений ручний стан і блокування ще діє — відновлюємо його
    if (isManualOverrideActive()) {
        loadUdarkModeToggle();
    } else {
        // 2. Блокування минуло або його не було — застосовуємо розклад
        clearManualOverride();
        checkTimeAndToggle();
    }

    // Перевіряємо кожну хвилину
    setInterval(checkTimeAndToggle, 60_000);

    // Кнопка-альтернатива (side button)
    const dmButton = document.querySelector('.side-button[data-bubble="3"]');
    if (dmButton) {
        dmButton.addEventListener('click', toggleMode); // теж ручне → зберігає override
    }
});