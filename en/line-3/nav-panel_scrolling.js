function scrollToActiveButton() {
            const navPanel = document.getElementById('navPanel');
            const activeButton = document.querySelector('.nav-button.active');
            
            if (activeButton && navPanel) {
                // Отримуємо позицію кнопки відносно верху контейнера
                const buttonTop = activeButton.offsetTop;
                
                // Висота панелі
                const panelHeight = navPanel.clientHeight;
                
                // Висота кнопки
                const buttonHeight = activeButton.offsetHeight;
                
                // Розраховуємо позицію скролу для центрування кнопки
                // Центр панелі мінус половина висоти кнопки
                const scrollPosition = buttonTop - (panelHeight / 2) + (buttonHeight / 2);
                
                // Плавний скрол до позиції
                navPanel.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
            }
        }

        function setActiveButton(buttonIndex) {
            // Прибираємо active клас з усіх кнопок
            document.querySelectorAll('.nav-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Додаємо active клас до обраної кнопки
            const targetButton = document.querySelector(`.button${buttonIndex}`);
            if (targetButton) {
                targetButton.classList.add('active');
                
                // Центруємо активну кнопку
                setTimeout(scrollToActiveButton, 50); // Невелика затримка для оновлення DOM
            }
        }

        // Додаємо обробники подій для кліків по кнопках
        document.querySelectorAll('.nav-button').forEach((button, index) => {
            button.addEventListener('click', function() {
                const videoIndex = this.getAttribute('data-video');
                setActiveButton(videoIndex);
            });
        });

        // Навігаційні кнопки
        document.getElementById('firstBtn').addEventListener('click', function() {
            setActiveButton(0);
        });

        document.getElementById('lastBtn').addEventListener('click', function() {
            setActiveButton(40);
        });

        document.getElementById('nextBtn').addEventListener('click', function() {
            const currentActive = document.querySelector('.nav-button.active');
            if (currentActive) {
                const currentIndex = parseInt(currentActive.getAttribute('data-video'));
                if (currentIndex < 40) {
                    setActiveButton(currentIndex + 1);
                }
            }
        });

        document.getElementById('prevBtn').addEventListener('click', function() {
            const currentActive = document.querySelector('.nav-button.active');
            if (currentActive) {
                const currentIndex = parseInt(currentActive.getAttribute('data-video'));
                if (currentIndex > 0) {
                    setActiveButton(currentIndex - 1);
                }
            }
        });

        // Центруємо активну кнопку при завантаженні сторінки
        window.addEventListener('load', function() {
            setTimeout(scrollToActiveButton, 100);
        });

        // Додаємо підтримку клавіатурної навігації
        document.addEventListener('keydown', function(e) {
            const currentActive = document.querySelector('.nav-button.active');
            if (currentActive) {
                const currentIndex = parseInt(currentActive.getAttribute('data-video'));
                
                switch(e.key) {
                    case 'ArrowUp':
                    case 'ArrowLeft':
                        e.preventDefault();
                        if (currentIndex > 0) {
                            setActiveButton(currentIndex - 1);
                        }
                        break;
                    case 'ArrowDown':
                    case 'ArrowRight':
                        e.preventDefault();
                        if (currentIndex < 40) {
                            setActiveButton(currentIndex + 1);
                        }
                        break;
                    case 'Home':
                        e.preventDefault();
                        setActiveButton(0);
                        break;
                    case 'End':
                        e.preventDefault();
                        setActiveButton(40);
                        break;
                }
            }
        });

        // Функція для програмного встановлення активної кнопки (для використання в вашому коді)
        function activateButton(buttonIndex) {
            setActiveButton(buttonIndex);
        }

        // Експортуємо функції для глобального використання
        window.activateButton = activateButton;
        window.scrollToActiveButton = scrollToActiveButton;
        window.getCurrentActiveIndex = function() {
            const currentActive = document.querySelector('.nav-button.active');
            return currentActive ? parseInt(currentActive.getAttribute('data-video')) : -1;
        };
		
