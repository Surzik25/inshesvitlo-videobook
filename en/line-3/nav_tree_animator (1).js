class NavigationTreeAnimator {
    constructor() {
        this.currentButton = 0;
        this.buttons = document.querySelectorAll('.nav-button');
        this.veins = document.querySelectorAll('.vein-path');
        this.animationDuration = 1000; // 1 секунда
        this.hiddenImages = document.querySelectorAll('.nav-branches-hidden, .nav-branches2-hidden');
        this.gradientTimeout = null;

        // Звук "пробігання світла"
        this.audioCtx = null;
        // 🔇 Синхронізуємо зі спільним перемикачем звуку (sound-mute-state.js)
        this.soundEnabled = !window.SoundPrefs || !window.SoundPrefs.isMuted();
        if (window.SoundPrefs) {
            window.SoundPrefs.onChange((muted) => {
                this.soundEnabled = !muted;
            });
        }
        this.soundStyle = 'shimmer'; // 'retro' — 8-bit тіки, 'shimmer' — м'яке мерехтіння
        this.flowStepDelay = 0.2; // сек, синхронізовано з 200мс затримкою анімації

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

        // Генеруємо звук пробігання світла, синхронізований з довжиною шляху
        this.playFlowSound(veins.length, isForward);

        // Анімуємо кожну галузку з затримкою
        // Якщо йдемо назад, реверсуємо порядок анімації
        const orderedVeins = isForward ? veins : [...veins].reverse();

        orderedVeins.forEach((vein, index) => {
            setTimeout(() => {
                this.animateVein(vein, isForward);
            }, index * 200); // Затримка 200мс між анімаціями
        });
    }

    ensureAudioContext() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        // Важливо: resume() викликається тут, всередині того ж кліку,
        // що й уся навігація — це той самий "trusted user gesture"
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
        return this.audioCtx;
    }

    playFlowSound(pathLength, isForward) {
        if (!this.soundEnabled || pathLength === 0) return;

        if (this.soundStyle === 'shimmer') {
            this.playFlowSoundShimmer(pathLength, isForward);
        } else {
            this.playFlowSoundRetro(pathLength, isForward);
        }
    }

    // Дозволяє перемикати стиль звуку "на льоту"
    setSoundStyle(style) {
        this.soundStyle = style === 'shimmer' ? 'shimmer' : 'retro';
    }

    // --- Допоміжний реверб для повітряного, "чарівного" звучання ---
    createReverbImpulse(ctx, duration = 2.2, decay = 3) {
        const rate = ctx.sampleRate;
        const length = Math.floor(rate * duration);
        const impulse = ctx.createBuffer(2, length, rate);

        for (let channel = 0; channel < 2; channel++) {
            const data = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
            }
        }
        return impulse;
    }

    ensureReverb() {
        const ctx = this.ensureAudioContext();
        if (!this.reverbNode) {
            this.reverbNode = ctx.createConvolver();
            this.reverbNode.buffer = this.createReverbImpulse(ctx);

            this.dryGain = ctx.createGain();
            this.dryGain.gain.value = 1;

            this.wetGain = ctx.createGain();
            this.wetGain.gain.value = 0.4; // скільки "повітря" реверба підмішуємо

            this.dryGain.connect(ctx.destination);
            this.wetGain.connect(this.reverbNode);
            this.reverbNode.connect(ctx.destination);
        }
        return { dry: this.dryGain, wet: this.wetGain };
    }

    // --- М'який, мерехтливий "помах чарівної палички" ---
    playFlowSoundShimmer(pathLength, isForward) {
        const ctx = this.ensureAudioContext();
        const { dry, wet } = this.ensureReverb();
        const now = ctx.currentTime;
        const stepDelay = this.flowStepDelay;
        const totalDuration = (pathLength - 1) * stepDelay + this.animationDuration / 1000;

        // Легке вібрато для всього тону
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 5.5;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 6; // глибина вібрато в Гц
        lfo.connect(lfoGain);
        lfo.start(now);
        lfo.stop(now + totalDuration + 0.5);

        // Хор із трьох злегка розстроєних синусоїд — "флейтовий" тон помаху
        const startFreq = isForward ? 500 : 1200;
        const endFreq = isForward ? 1200 : 500;

        [-6, 0, 6].forEach(detune => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.detune.value = detune;
            osc.frequency.setValueAtTime(startFreq, now);
            osc.frequency.exponentialRampToValueAtTime(endFreq, now + totalDuration);
            lfoGain.connect(osc.frequency);

            const g = ctx.createGain();
            g.gain.setValueAtTime(0.0001, now);
            g.gain.exponentialRampToValueAtTime(0.05, now + totalDuration * 0.3);
            g.gain.setValueAtTime(0.05, now + totalDuration * 0.7);
            g.gain.exponentialRampToValueAtTime(0.0001, now + totalDuration);

            osc.connect(g);
            g.connect(dry);
            g.connect(wet);

            osc.start(now);
            osc.stop(now + totalDuration + 0.1);
        });

        // Іскорки-переливи, розкидані вздовж шляху (пентатоніка)
        const sparkleScale = isForward
            ? [523.25, 659.25, 783.99, 987.77, 1174.66] // C5 E5 G5 B5 D6
            : [1174.66, 987.77, 783.99, 659.25, 523.25];

        const sparkleCount = Math.max(4, pathLength * 3);
        for (let i = 0; i < sparkleCount; i++) {
            const t = now + Math.random() * totalDuration;
            const baseFreq = sparkleScale[Math.floor(Math.random() * sparkleScale.length)];
            const freq = baseFreq * (1 + Math.random() * 0.02);

            const sOsc = ctx.createOscillator();
            sOsc.type = 'sine';
            sOsc.frequency.setValueAtTime(freq, t);

            const sGain = ctx.createGain();
            sGain.gain.setValueAtTime(0.0001, t);
            sGain.gain.exponentialRampToValueAtTime(0.08, t + 0.008);
            sGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6 + Math.random() * 0.4);

            sOsc.connect(sGain);
            sGain.connect(dry);
            sGain.connect(wet);

            sOsc.start(t);
            sOsc.stop(t + 1.2);
        }
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