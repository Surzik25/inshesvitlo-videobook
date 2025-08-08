//це для футера
		// Create floating particles
    function createParticles() {
      const particlesContainer = document.getElementById('particles');
      const particleCount = 25;

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
        alert('-.-. . .--- / .-- -.-- ... --- -.- -.-- .--- / -.. .. --- -.. / -. .- ... .--. .-. .- .-- -.. .. / --.-- . / .-- -.-- --.-- -.-- .--- // .-- .. -. / .--. .-. --- ... - --- / ... -.-- -.. -.-- - -..-');
      }, 500);
    });

    // Interactive footer links with sound effect simulation
    document.querySelectorAll('.footer-link').forEach(link => {
      link.addEventListener('mouseenter', function() {
        // Create a small ripple effect
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.background = 'rgba(117, 255, 202, 0.3)';
        ripple.style.borderRadius = '50%';
        ripple.style.width = '5px';
        ripple.style.height = '5px';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.style.position = 'relative';
        this.appendChild(ripple);
        
        setTimeout(() => {
          if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
          }
        }, 600);
      });
    });

    // Add ripple animation and bubble link styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple {
        0% {
          width: 5px;
          height: 5px;
          opacity: 1;
        }
        100% {
          width: 30px;
          height: 30px;
          opacity: 0;
        }
      }
      
      .speech-bubble a {
        cursor: url(images2/cursorPointer/pointer.png) 2 2, pointer; !important;
        transition: all 0.3s ease;
        pointer-events: auto !important;
      }
      
      .speech-bubble a:hover {
        opacity: 0.8;
        text-shadow: 0 0 5px currentColor;
      }
    `;
    document.head.appendChild(style);

    // Initialize particles when page loads
    document.addEventListener('DOMContentLoaded', createParticles);

    // Logo click effect
    document.querySelector('.footer-logo').addEventListener('click', function() {
      this.style.animation = 'none';
      setTimeout(() => {
        this.style.animation = 'logoSpin 2s linear infinite';
      }, 10);
    });
	
	// Функція для перемикання udark режиму вручну
function toggleUdarkMode() {
    document.body.classList.add('mode-switching');

    const elementsToToggle = getElementsToToggle();

    elementsToToggle.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.toggle('udark');
        });
    });

    setTimeout(() => {
        document.body.classList.remove('mode-switching');
    }, 500);

    const isUdarkActive = document.body.classList.contains('udark');
    localStorage.setItem('udarkMode', isUdarkActive);
    localStorage.setItem('udarkUserOverride', 'true');
    localStorage.setItem('udarkLastInteraction', Date.now());

    const dmButton = document.querySelector('.side-button[data-bubble="3"]');
    if (dmButton) {
        dmButton.style.transform = 'scale(0.9)';
        setTimeout(() => {
            dmButton.style.transform = '';
        }, 150);
    }
}

// Масив елементів для перемикання
function getElementsToToggle() {
    return [
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
}

// Завантаження udark режиму з урахуванням часу та автоповернення з плавним ефектом
function loadUdarkMode() {
    const savedMode = localStorage.getItem('udarkMode');
    let userOverride = localStorage.getItem('udarkUserOverride') === 'true';
    const lastInteraction = parseInt(localStorage.getItem('udarkLastInteraction'), 10) || 0;

    // Якщо пройшла година з останнього натискання — забуваємо про override
    if (userOverride && Date.now() - lastInteraction > 3600 * 1000) {
        userOverride = false;
        localStorage.removeItem('udarkUserOverride');

        // Плавне автоповернення
        smoothAutoSwitch();
        return;
    }

    let shouldBeDark = false;

    if (!userOverride) {
        const hour = new Date().getHours();
        if (hour >= 20 || hour < 7) {
            shouldBeDark = true;
        }
    } else {
        shouldBeDark = (savedMode === 'true');
    }

    if (shouldBeDark) {
        applyDarkModeInstant();
    }
}

// Миттєве вмикання udark без анімації
function applyDarkModeInstant() {
    document.body.style.transition = 'none';
    getElementsToToggle().forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('udark');
        });
    });
    setTimeout(() => {
        document.body.style.transition = '';
    }, 50);
}

// Плавне вмикання udark (для автоповернення)
function smoothAutoSwitch() {
    document.body.classList.add('mode-switching');
    getElementsToToggle().forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.toggle('udark');
        });
    });
    setTimeout(() => {
        document.body.classList.remove('mode-switching');
    }, 800); // трохи довше, щоб виглядало ніжно
}

// Ініціалізація
document.addEventListener('DOMContentLoaded', () => {
    loadUdarkMode();

    const dmButton = document.querySelector('.side-button[data-bubble="3"]');
    if (dmButton) {
        dmButton.addEventListener('click', toggleUdarkMode);

        dmButton.addEventListener('mouseenter', () => {
            dmButton.style.filter = 'brightness(1.2)';
        });

        dmButton.addEventListener('mouseleave', () => {
            dmButton.style.filter = '';
        });
    }
});


 