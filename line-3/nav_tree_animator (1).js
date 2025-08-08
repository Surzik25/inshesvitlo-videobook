class NavigationTreeAnimator {
    constructor() {
        this.currentButton = 0;
        this.buttons = document.querySelectorAll('.nav-button');
        this.veins = document.querySelectorAll('.vein-path');
        this.animationDuration = 1000; // 1 секунда
        this.hiddenImages = document.querySelectorAll('.nav-branches-hidden, .nav-branches2-hidden');
        this.gradientTimeout = null;

        // Групуємо кнопки по деревам
        this.tree1Buttons = Array.from(this.buttons).filter(btn => btn.dataset.tree === '1');
        this.tree2Buttons = Array.from(this.buttons).filter(btn => btn.dataset.tree === '2');

        this.init();
    }

    init() {
        // Відновлюємо збережений стан або встановлюємо початковий
        const savedState = this.getSavedState();
        this.setActiveButton(savedState);

        // Додаємо обробники подій для кнопок дерева
        this.buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
                this.navigateToButton(index);
            });
        });

        // Додаємо обробники для навігаційних кнопок
        this.setupNavigationButtons();
    }

    getSavedState() {
        try {
            // Спочатку перевіряємо localStorage основного навігатора
            const activeNavButtons = localStorage.getItem('activeNavButtons');
            if (activeNavButtons) {
                const parsed = JSON.parse(activeNavButtons);
                if (parsed.length > 0) {
                    // Знаходимо індекс кнопки з відповідним data-video
                    const targetVideoIndex = parsed[0]; // Беремо першу активну кнопку
                    const buttonIndex = Array.from(this.buttons).findIndex(btn => 
                        parseInt(btn.getAttribute('data-video')) === targetVideoIndex
                    );
                    if (buttonIndex !== -1) {
                        return buttonIndex;
                    }
                }
            }

            // Якщо немає збережених даних з основного навігатора, перевіряємо власне сховище
            const savedCurrentButton = localStorage.getItem('treeAnimatorCurrentButton');
            if (savedCurrentButton !== null) {
                const buttonIndex = parseInt(savedCurrentButton);
                if (buttonIndex >= 0 && buttonIndex < this.buttons.length) {
                    return buttonIndex;
                }
            }

            // Альтернативно, шукаємо кнопку з класом 'active'
            const activeButton = Array.from(this.buttons).findIndex(btn => 
                btn.classList.contains('active')
            );
            if (activeButton !== -1) {
                return activeButton;
            }

        } catch (error) {
            console.warn('Помилка при відновленні стану навігаційного дерева:', error);
        }

        // Якщо нічого не знайдено, повертаємо 0
        return 0;
    }

    saveState() {
        // Зберігаємо поточний стан
        localStorage.setItem('treeAnimatorCurrentButton2', this.currentButton.toString());
    }

    setupNavigationButtons() {
        const firstBtn = document.getElementById('firstBtn');
        const lastBtn = document.getElementById('lastBtn');
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');

        if (firstBtn) {
            firstBtn.addEventListener('click', () => {
                this.navigateToButton(0);
            });
        }

        if (lastBtn) {
            lastBtn.addEventListener('click', () => {
                this.navigateToButton(this.buttons.length - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const nextIndex = Math.min(this.currentButton + 1, this.buttons.length - 1);
                if (nextIndex !== this.currentButton) {
                    this.navigateToButton(nextIndex);
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const prevIndex = Math.max(this.currentButton - 1, 0);
                if (prevIndex !== this.currentButton) {
                    this.navigateToButton(prevIndex);
                }
            });
        }
    }

    setActiveButton(buttonIndex) {
        // Знімаємо активний клас з усіх кнопок
        this.buttons.forEach(btn => btn.classList.remove('active'));

        // Додаємо активний клас до поточної кнопки
        if (this.buttons[buttonIndex]) {
            this.buttons[buttonIndex].classList.add('active');
        }

        this.currentButton = buttonIndex;
        this.saveState(); // Зберігаємо стан при кожній зміні
    }

    navigateToButton(targetIndex) {
        if (targetIndex === this.currentButton) return;

        const fromIndex = this.currentButton;
        const toIndex = targetIndex;

        const fromButton = this.buttons[fromIndex];
        const toButton = this.buttons[toIndex];

        // Показуємо радіальні градієнти навколо попередньої та наступної кнопки
        this.showRadialGradients(fromButton, toButton);

        // Перевіряємо, чи обидві кнопки належать одному дереву
        const fromTree = fromButton?.dataset.tree;
        const toTree = toButton?.dataset.tree;

        if (fromTree === toTree) {
            // Кнопки в одному дереві - анімуємо шлях між ними
            const path = this.getPathBetweenButtons(fromIndex, toIndex, fromTree);
            const isForward = toIndex > fromIndex;
            this.animatePath(path, isForward);
        } else {
            // Кнопки в різних деревах - анімуємо тільки цільове дерево
            this.animateTreeTransition(toIndex, toTree);
        }

        // Встановлюємо нову активну кнопку
        this.setActiveButton(targetIndex);
    }

    showRadialGradients(fromButton, toButton) {
        // Очищаємо попередній таймаут
        if (this.gradientTimeout) {
            clearTimeout(this.gradientTimeout);
        }

        this.hiddenImages.forEach(hiddenImage => {
            const imageRect = hiddenImage.getBoundingClientRect();
            const maskGradients = [];

            // Створюємо градієнт для попередньої кнопки
            if (fromButton) {
                const fromButtonRect = fromButton.getBoundingClientRect();
                const fromCenterX = fromButtonRect.left - imageRect.left + fromButtonRect.width / 2;
                const fromCenterY = fromButtonRect.top - imageRect.top + fromButtonRect.height / 2;
                
                maskGradients.push(`radial-gradient(circle at ${fromCenterX}px ${fromCenterY}px, 
                    black 0px, 
                    black 30px, 
                    rgba(0,0,0,0.7) 60px,
                    rgba(0,0,0,0.3) 70px,
                    transparent 95px)`);
            }

            // Створюємо градієнт для наступної кнопки
            if (toButton) {
                const toButtonRect = toButton.getBoundingClientRect();
                const toCenterX = toButtonRect.left - imageRect.left + toButtonRect.width / 2;
                const toCenterY = toButtonRect.top - imageRect.top + toButtonRect.height / 2;
                
                maskGradients.push(`radial-gradient(circle at ${toCenterX}px ${toCenterY}px, 
                    black 0px, 
                    black 30px, 
                    rgba(0,0,0,0.7) 60px,
                    rgba(0,0,0,0.3) 70px,
                    transparent 95px)`);
            }

            // Об'єднуємо градієнти через кому (як у CSS mask з multiple значеннями)
            if (maskGradients.length > 0) {
                const maskValue = maskGradients.join(', ');
                
                // Застосовуємо маску і показуємо зображення
                hiddenImage.style.mask = maskValue;
                hiddenImage.style.webkitMask = maskValue;
                hiddenImage.classList.add('show');
            }
        });

        // Ховаємо градієнти через 2 секунди
        this.gradientTimeout = setTimeout(() => {
            this.hideRadialGradients();
        }, 2000);
    }

    hideRadialGradients() {
        this.hiddenImages.forEach(hiddenImage => {
            hiddenImage.classList.remove('show');
            // Очищаємо маски
            hiddenImage.style.mask = '';
            hiddenImage.style.webkitMask = '';
        });
    }

    getPathBetweenButtons(from, to, treeId) {
        const start = Math.min(from, to);
        const end = Math.max(from, to);
        const path = [];

        // Створюємо шлях від start до end тільки в межах одного дерева
        for (let i = start; i < end; i++) {
            const veinId = `vein${i}-${i + 1}`;
            const vein = document.getElementById(veinId);
            if (vein && vein.dataset.tree === treeId) {
                path.push(vein);
            }
        }

        return path;
    }

    animateTreeTransition(targetIndex, targetTree) {
        // При переході між деревами анімуємо тільки перші кілька галузок цільового дерева
        const targetButton = this.buttons[targetIndex];
        const targetButtonNumber = parseInt(targetButton.dataset.video);

        // Знаходимо початок цільового дерева
        const treeStartNumber = targetTree === '1' ? 0 : 21;

        // Анімуємо галузки від початку дерева до цільової кнопки
        const veinsToAnimate = [];
        for (let i = treeStartNumber; i < targetButtonNumber; i++) {
            const veinId = `vein${i}-${i + 1}`;
            const vein = document.getElementById(veinId);
            if (vein && vein.dataset.tree === targetTree) {
                veinsToAnimate.push(vein);
            }
        }

        this.animatePath(veinsToAnimate, true);
    }

    animatePath(veins, isForward) {
        // Очищаємо попередні анімації
        this.clearAnimations();

        // Анімуємо кожну галузку з затримкою
        // Якщо йдемо назад, реверсуємо порядок анімації
        const orderedVeins = isForward ? veins : [...veins].reverse();

        orderedVeins.forEach((vein, index) => {
            setTimeout(() => {
                this.animateVein(vein, isForward);
            }, index * 200); // Затримка 200мс між анімаціями
        });
    }

    animateVein(vein, isForward) {
        // Додаємо класи для анімації
        vein.classList.add('animated');
        vein.classList.add(isForward ? 'flow-forward' : 'flow-backward');

        // Видаляємо класи анімації (але залишаємо світіння) після завершення
        setTimeout(() => {
            vein.classList.remove('flow-forward', 'flow-backward');
        }, this.animationDuration);

        // Повертаємо до нормального кольору через додатковий час
        setTimeout(() => {
            vein.classList.remove('animated');
        }, this.animationDuration + 500); // +500мс для плавного переходу
    }

    clearAnimations() {
        this.veins.forEach(vein => {
            vein.classList.remove('flow-forward', 'flow-backward', 'animated');
        });
    }

    // Метод для синхронізації з основним навігатором
    syncWithMainNavigator(videoIndex) {
        const buttonIndex = Array.from(this.buttons).findIndex(btn => 
            parseInt(btn.getAttribute('data-video')) === videoIndex
        );

        if (buttonIndex !== -1 && buttonIndex !== this.currentButton) {
            this.navigateToButton(buttonIndex);
        }
    }
}

// Ініціалізуємо навігатор після завантаження сторінки
document.addEventListener('DOMContentLoaded', () => {
    window.navigationTreeAnimator = new NavigationTreeAnimator();
});

// Експортуємо для можливості синхронізації з основним навігатором
window.NavigationTreeAnimator = NavigationTreeAnimator;