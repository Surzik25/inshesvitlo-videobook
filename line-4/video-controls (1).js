// Конфігурація кнопок з парами та їхніми зображеннями
const buttonConfig = {
    infinite: {
        pair: 'freeze',
        activeImg: '../images2/infinite.gif',
        inactiveImg: '../images2/infiniteDeact.png',
        isActive: true
    },
    freeze: {
        pair: 'infinite',
        activeImg: '../images2/freeze.gif',
        inactiveImg: '../images2/freezeDeact.png',
        isActive: false
    },
    fast: {
        pair: 'slow',
        activeImg: '../images2/fast.gif',
        inactiveImg: '../images2/fastDeact.png',
        isActive: true
    },
    slow: {
        pair: 'fast',
        activeImg: '../images2/slow.gif',
        inactiveImg: '../images2/slowDeact.png',
        isActive: false
    },
    dark: {
        pair: 'udark',
        activeImg: '../images2/dark.gif',
        inactiveImg: '../images2/darkDeact.png',
        isActive: true
    },
    udark: {
        pair: 'dark',
        activeImg: '../images2/udark.gif',
        inactiveImg: '../images2/udarkDeact.png',
        isActive: false
    },
    window: {
        pair: 'fullscreen',
        activeImg: '../images2/window.gif',
        inactiveImg: '../images2/windowDeact.png',
        isActive: true
    },
    fullscreen: {
        pair: 'window',
        activeImg: '../images2/fullscreen2.gif',
        inactiveImg: '../images2/fullscrDeact.png',
        isActive: false
    }
};

// Функція для оновлення зображення кнопки
function updateButtonImage(buttonName) {
    const button = document.querySelector(`[data-button="${buttonName}"]`);
    const img = button.querySelector('img:first-child'); // Вибираємо перше зображення (іконку кнопки)
    const config = buttonConfig[buttonName];
    
    img.src = config.isActive ? config.activeImg : config.inactiveImg;
    
    // Оновлюємо CSS класи для контролю клікабельності
    if (config.isActive) {
        button.classList.add('active');
        button.classList.remove('inactive');
    } else {
        button.classList.add('inactive');
        button.classList.remove('active');
    }
}

// Функція для перемикання кнопки
function toggleButton(buttonName) {
    const config = buttonConfig[buttonName];
    const pairConfig = buttonConfig[config.pair];
    
    // Перемикаємо стан натиснутої кнопки
    config.isActive = !config.isActive;
    
    // Перемикаємо стан парної кнопки
    pairConfig.isActive = !pairConfig.isActive;
    
    // Оновлюємо зображення обох кнопок
    updateButtonImage(buttonName);
    updateButtonImage(config.pair);
    
    // Застосовуємо функціональність для відео
    applyVideoControl(buttonName, config.isActive);
    
    // Виводимо інформацію в консоль для демонстрації
    console.log(`${buttonName}: ${config.isActive ? 'активована' : 'деактивована'}`);
    console.log(`${config.pair}: ${pairConfig.isActive ? 'активована' : 'деактивована'}`);
}

// Функція для скидання кнопок infinite/freeze до початкового стану
function resetInfiniteFreeze() {
    // Встановлюємо infinite як активну
    buttonConfig.infinite.isActive = true;
    // Встановлюємо freeze як деактивовану
    buttonConfig.freeze.isActive = false;
    
    buttonConfig.fast.isActive = true;
    
    buttonConfig.slow.isActive = false;
    
    buttonConfig.dark.isActive = true;
    
    buttonConfig.udark.isActive = false;
    
    // Оновлюємо зображення обох кнопок
    updateButtonImage('infinite');
    updateButtonImage('freeze');
    updateButtonImage('fast');
    updateButtonImage('slow');
    updateButtonImage('dark');
    updateButtonImage('udark');
    
    // Застосовуємо функціональність (відтворення відео)
    applyVideoControl('infinite', true);
    
    console.log('Кнопки infinite/freeze скинуті до початкового стану');
}

// Додаємо глобальну функцію для використання в VideoNavigator
window.resetVideoControls = resetInfiniteFreeze;

// Функція для застосування контролю відео
function applyVideoControl(buttonName, isActive) {
    const video = document.getElementById('mainVideo');
    const freezeframe = document.getElementById('freezeOverlay');
    
    if (!video) return;
    
    switch(buttonName) {
        case 'slow':
            if (isActive) {
                video.playbackRate = 0.4; // 40% швидкості
                console.log('Швидкість відео: 40%');
                video.style.filter = 'grayscale(0.7) contrast(0.5)';
            }
            break;
            
        case 'fast':
            if (isActive) {
                video.playbackRate = 1.0; // Нормальна швидкість
                console.log('Швидкість відео: 100%');
                video.style.filter = 'grayscale(0) contrast(1)';
            }
            break;
            
        case 'freeze':
            if (isActive) {
                video.pause();
                freezeframe.style.opacity = 1;
                console.log('Відео призупинено');
            }
            break;
            
        case 'infinite':
            if (isActive) {
                video.play();
                freezeframe.style.opacity = 0;
                console.log('Відео відтворюється');
            }
            break;
            
        case 'udark':
            if (isActive) {
                // Додаємо темний фільтр
                video.style.filter = 'brightness(0.8) saturate(120%) contrast(1.3) hue-rotate(-40deg) sepia(30%)';
                console.log('Темний режим увімкнено');
            }
            break;
            
        case 'dark':
            if (isActive) {
                // Знімаємо фільтр
                video.style.filter = 'none';
                console.log('Темний режим вимкнено');
            }
            break;
            
        case 'fullscreen':
            if (isActive) {
                // Додаємо невелику затримку для відображення анімації кнопок
                setTimeout(() => {
                    if (video.requestFullscreen) {
                        video.requestFullscreen();
                    } else if (video.webkitRequestFullscreen) {
                        video.webkitRequestFullscreen();
                    } else if (video.mozRequestFullScreen) {
                        video.mozRequestFullScreen();
                    }
                }, 500); // Затримка 500мс
                console.log('Повноекранний режим (з затримкою)');
            }
            break;
            
        case 'window':
            if (isActive) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                }
                console.log('Віконний режим');
            }
            break;
    }
}

// Функція для обробки виходу з повноекранного режиму
function handleFullscreenChange() {
    const isFullscreen = !!(document.fullscreenElement || 
                          document.webkitFullscreenElement || 
                          document.mozFullScreenElement);
    
    if (!isFullscreen) {
        // Якщо вийшли з повноекранного режиму
        buttonConfig.fullscreen.isActive = false;
        buttonConfig.window.isActive = true;
        
        updateButtonImage('fullscreen');
        updateButtonImage('window');
        
        console.log('Вихід з повноекранного режиму - кнопки оновлені');
    }
}

// Ініціалізація кнопок
function initializeButtons() {
    // Оновлюємо зображення всіх кнопок відповідно до початкового стану
    Object.keys(buttonConfig).forEach(buttonName => {
        updateButtonImage(buttonName);
    });

    // Додаємо обробники подій для всіх кнопок
    document.querySelectorAll('.control-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonName = this.getAttribute('data-button');
            const config = buttonConfig[buttonName];
            
            // Перевіряємо чи кнопка активна (якщо активна - блокуємо клік)
            if (config.isActive) {
                e.preventDefault();
                console.log(`Кнопка ${buttonName} активна і не може бути натиснута`);
                return false;
            }
            
            // Дозволяємо клік тільки для деактивованих кнопок
            toggleButton(buttonName);
        });
    });
    
    // Додаємо обробники для зміни повноекранного режиму
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
}

// Запускаємо ініціалізацію після завантаження сторінки
document.addEventListener('DOMContentLoaded', initializeButtons);