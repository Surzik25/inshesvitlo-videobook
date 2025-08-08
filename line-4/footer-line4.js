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
        alert('-. . / .-- ... .. / -- . - .- ..-. --- .-. --- --.. -. -.-- -.- -.-- / .-- -.-- -- . .-. .-.. -.-- // -.. . .-.- -.- .. / . .-- --- .-.. ..-- -.-. .. --- -. ..- .-- .- .-.. -.--');
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

function loadUdarkModeToggle() {
    const savedMode = localStorage.getItem('udarkMode');
    if (savedMode === 'true') {
        // Відключаємо transitions на початку для миттєвого завантаження
        body.style.transition = 'none';
        
        // Встановлюємо udark стан без анімації
        body.classList.add('udark');
        elements.forEach(element => {
            if (element) element.classList.add('udark');
        });
        
        isUltraDark = true;
        
        // Встановлюємо правильну іконку
        if (modeToggle) {
            modeToggle.src = '../images2/UDMCircleIdle.gif';
        }
        
        // Повертаємо transitions через короткий час
        setTimeout(() => {
            body.style.transition = '';
        }, 50);
    }
}

function toggleMode() {
    if (isAnimating) return;
    
    isAnimating = true;
    
    // Показуємо overlay
    lightOverlay.style.display = 'block';
    setTimeout(() => {
        lightOverlay.classList.add('show');
    }, 10);
    
    if (!isUltraDark) {
        // Переключення з темного на ультратемний
        modeToggle.src = '../images2/DMCircleHover.gif';
        
        // Затримка для красивого ефекту
        setTimeout(() => {
            // Додаємо клас udark до всіх елементів
            body.classList.add('udark');
            elements.forEach(element => {
                if (element) element.classList.add('udark');
            });
            
            isUltraDark = true;
            
            // Зберігаємо стан в localStorage
            localStorage.setItem('udarkMode', 'true');
            
            // Приховуємо overlay
            lightOverlay.classList.remove('show');
            setTimeout(() => {
                lightOverlay.style.display = 'none';
            }, 500);
        }, 300);
        
        setTimeout(() => {
            modeToggle.src = '../images2/UDMCircleIdle.gif';
            isAnimating = false;
        }, 900);
        
    } else {
        // Переключення з ультратемного на темний
        modeToggle.src = '../images2/UDMCircleHover.gif';
        
        // Затримка для красивого ефекту
        setTimeout(() => {
            // Забираємо клас udark з всіх елементів
            body.classList.remove('udark');
            elements.forEach(element => {
                if (element) element.classList.remove('udark');
            });
            
            isUltraDark = false;
            
            // Зберігаємо стан в localStorage
            localStorage.setItem('udarkMode', 'false');
            
            // Приховуємо overlay
            lightOverlay.classList.remove('show');
            setTimeout(() => {
                lightOverlay.style.display = 'none';
            }, 500);
        }, 300);
        
        setTimeout(() => {
            modeToggle.src = '../images2/DMCircleIdle.gif';
            isAnimating = false;
        }, 900);
    }
}

modeToggle.addEventListener('click', toggleMode);

// Запобігаємо контекстному меню
modeToggle.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

// Запобігаємо перетягуванню
modeToggle.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
});

// Функція для автоматичного перемикання за часом
function checkTimeAndToggle() {
    const now = new Date();
    const currentHour = now.getHours();
    
    // udark режим має бути активний з 20:00 до 7:00
    const shouldBeUdark = currentHour >= 20 || currentHour < 7;
    
    // Перевіряємо поточний стан
    const isCurrentlyUdark = body.classList.contains('udark');
    
    // Якщо потрібно змінити режим
    if (shouldBeUdark && !isCurrentlyUdark) {
        // Активуємо udark режим
        activateUdarkMode();
    } else if (!shouldBeUdark && isCurrentlyUdark) {
        // Деактивуємо udark режим
        deactivateUdarkMode();
    }
}

// Функція для активації udark режиму (без анімації)
function activateUdarkMode() {
    body.classList.add('udark');
    elements.forEach(element => {
        if (element) element.classList.add('udark');
    });
    
    isUltraDark = true;
    localStorage.setItem('udarkMode', 'true');
    
    if (modeToggle) {
        modeToggle.src = '../images2/UDMCircleIdle.gif';
    }
    
    // Також активуємо для другої функції
    const elementsToToggle = [
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

    elementsToToggle.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.classList.add('udark');
        });
    });
}

// Функція для деактивації udark режиму (без анімації)
function deactivateUdarkMode() {
    body.classList.remove('udark');
    elements.forEach(element => {
        if (element) element.classList.remove('udark');
    });
    
    isUltraDark = false;
    localStorage.setItem('udarkMode', 'false');
    
    if (modeToggle) {
        modeToggle.src = '../images2/DMCircleIdle.gif';
    }
    
    // Також деактивуємо для другої функції
    const elementsToToggle = [
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

    elementsToToggle.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.classList.remove('udark');
        });
    });
}

// Ініціалізація
document.addEventListener('DOMContentLoaded', () => {
    // Спочатку перевіряємо час і встановлюємо відповідний режим
    checkTimeAndToggle();
    
    // Встановлюємо інтервал для перевірки кожну хвилину
    setInterval(checkTimeAndToggle, 60000); // 60000 мс = 1 хвилина
    
    const dmButton = document.querySelector('.side-button[data-bubble="3"]');
    if (dmButton) {
        dmButton.addEventListener('click', toggleUdarkMode);
    }
});

// Додатковий ефект: плавна зміна фону при наведенні на кнопку DM
document.addEventListener('DOMContentLoaded', () => {
    const dmButton = document.querySelector('.side-button[data-bubble="3"]');
    if (dmButton) {
        dmButton.addEventListener('mouseenter', () => {
            dmButton.style.filter = 'brightness(1.2)';
        });
        
        dmButton.addEventListener('mouseleave', () => {
            dmButton.style.filter = '';
        });
    }
});