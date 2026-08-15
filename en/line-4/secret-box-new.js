class TreasureBoxTimer {
    constructor() {
        // Базові змінні
        this.treasureBox = document.getElementById('treasureBox');
        this.timer = document.getElementById('timer');
        this.boxImage = document.getElementById('boxImage');
        this.speechBubble = document.getElementById('speechBubble');
        this.unlockBubble = document.getElementById('unlockBubble');
        this.factBubble = document.getElementById('factBubble');
        this.factImage = document.getElementById('factImage');
        this.factText = document.getElementById('factText');
        this.factClose = document.getElementById('factClose');
        this.magnifyingGlass = document.getElementById('magnifyingGlass');
        this.magnifiedImage = document.getElementById('magnifiedImage');
        this.factGroupNumber = document.getElementById('factGroupNumber');
        this.unlockMessage = document.getElementById('unlockMessage');
		this.soundCache = new Map();
		this.SOUND_DIR = '../../sound/read/';
        
        // Змінні для анімацій розблокованої скриньки
        this.hoverTimeout = null;
        this.isHovering = false;
        this.currentHoverState = 'idle';
        this.unlockBubbleShown = false;
        this.currentFactIndex = 0;
        this.isFactBubbleVisible = false;
        
        // Інтервали таймерів
        this.mainTimerInterval = null;
        this.groupTimerInterval = null;
        
        // Всі факти розділені на групи
        this.factGroups = [
            // Група 1 
            [
               { image: 'fact1.PNG', text: 'Keeping a diary is really hard for Per-pere. Re-reading what he already wrote, though? That\'s easy.' },
                    { image: 'fact2.PNG', text: 'The corners of Per-pere\'s diary always end up folded.' },
                    { image: 'fact3.PNG', text: 'Per-pere likes calling himself Per-pepper whenever he\'s feeling especially spicy.' },
                    { image: 'fact4.PNG', text: 'Whenever Per-pere writes with real ink (instead of digitally), mysterious symbols somehow appear on his face. He\'s tried figuring out how it works several times, but the more he thinks about it, the less sense it makes.' },
                    { image: 'fact5.PNG', text: 'Per-pere is literally a light-emitting diode. Basically, he\'s a flashlight that grew up, became bouncy, and put on a hood :D' },
                    { image: 'fact6.PNG', text: 'The AI Helper didn\'t always live on Per-pere\'s device. Long ago, he lived somewhere else :O' },
                    { image: 'fact7.PNG', text: 'The entire economy of the Diode World runs on AGI (Artificial General Intelligence). Massive AGI deposits — also known as neural-network farms — are located underground, alongside most factories and industrial facilities.' },
                    { image: 'fact8.PNG', text: 'The extension attached to Captain Vo\'s house, where Oki and Per-pere live, is called Kaz\'s Nest. It\'s named after Kaz, a chubby little green ghost-diode who never seems to fit comfortably into normal-sized rooms (not so huge).' },
					{ image: 'fact9.PNG', text: 'Oki and Per-pere\'s room (Kaz\'s Nest) is constantly expanding upward, layer by layer, like a giant sandwich. That\'s because Oki keeps expanding upward too.' },
					{ image: 'fact12.PNG', text: 'One day, Per-pere and Oki decided to open a shop selling mechanical gadgets and cute little trinkets. Of course, they never let customers inside—just in case Oki accidentally scares somebody :D' },
					{ image: 'fact13.PNG', text: 'Every creature with fur sheds sometimes. Oki is no exception.' },
					{ image: 'fact17.PNG', text: 'Per-pere calls his phone a mobile device because it sounds more serious and professional.' },
					{ image: 'fact39.PNG', text: 'How many identical hoods does Per-pere actually own?' },
					{ image: 'fact43.PNG', text: 'Per-pere is occasionally visited by his black cat tutor, Aristocrat. Aunt Veda assigned him as a replacement for regular school, since Per-pere never wanted to leave Oki\'s side—and fitting Oki into a normal school would\'ve been... difficult :D' },
					{ image: 'fact44.PNG', text: 'Per-pere was born on December 13th, Year 138 (P.E.) Maybe THAT\'S why he\'s so obsessed with the number 13?' },
					{ image: 'fact47.PNG', text: 'Per-pere is TERRIFIED of loud, rattling noises. Especially the Yardman-Boletus\' monstrous chainsaw. Every year on July 19th, he unloads a truck full of logs and revs that thing at maximum power. Not a pleasant day for anyone\'s ears :D' },
					{ image: 'fact48.PNG', text: 'Oki once made Per-pere a shadow lamp that scans his power ring and only unlocks after recognizing it.' },
					{ image: 'fact52.PNG', text: 'The most common and popular robots in Oki and Per-pere\'s room are spy robots. Their other name is cylindrical bat-bugs that scare everyone around them. Strangely enough, they don\'t actually spy on anyone, and they aren\'t very scary either. They just happen to be useful for a whole bunch of other things :D' },
					{ image: 'fact56.PNG', text: 'Per-pere has a truly gigantic tea collection in Captain Vo\'s storeroom! With a wide variety of herbal, fruit and berry, floral and fermented teas.' },
					{ image: 'fact61.PNG', text: 'Per-pere has a special flying machine in the shape of a saucer, which was made from spy robots\' spare wings.' },
					{ image: 'fact62.PNG', text: 'Per-pere recently drew a special red rectangle on one of the cat shelves so that he can always put his mobile device there and not lose it. He categorically forbids occupying this space!' },
					{ image: 'fact65.PNG', text: 'Every summer, Oki and Per-pere set up a Royal Terrace on the heated metal roof of their attic. There you can charge your batteries, lie in a hammock, and even roast nuts!' },
					{ image: 'fact67.PNG', text: 'Per-pere’s teacher - black cat Aristocrat - has a habit of appearing in Kaz’s Nest out of nowhere. The culprit is his personal *black door* - a hole under the floor through which he can slip even when all entrances and exits are blocked.' }
            ],
            // Група 2 
            [
                { image: 'fact18.PNG', text: 'A long time ago, a gray cat named Shad lived in Kaz\'s Nest. One day, he set off on a journey far away... To remember him, lots of plush toys were made in his likeness.' },
				{ image: 'fact22.PNG', text: 'Sometimes Captain Vo sneezes so loudly in the kitchen that the walls of Kaz\'s Nest start shaking.' },
					{ image: 'fact23.PNG', text: 'Captain Vo\'s raised voice is one of Oki\'s and Per-pere\'s default worst fears.' },
					{ image: 'fact24.PNG', text: 'Captain Vo\'s motto: THRIFTINESS is a diode\'s finest character trait.' },
					{ image: 'fact25.PNG', text: 'All of Aunt Veda\'s hats are very old, yet they\'re still perfectly neat and well cared for. They look brand new!' },
					{ image: 'fact28.PNG', text: 'Per-pere considers the 999 Trucks Corporation to be his and Oki\'s greatest rival. He even battles them in online games!' },
					{ image: 'fact29.PNG', text: 'Per-pere has dreamed of playing a certain quest game for a very long time, but he still hasn\'t worked up the courage to tell anyone about it.' },
					{ image: 'fact31.PNG', text: 'Kaz\'s full name is Kaz-who-is-Zak. Apparently, whenever he gets scared, he flips completely upside down! He also covers everything nearby in a strange minty powder.' },
					{ image: 'fact32.PNG', text: 'Per-pere actually runs TWO Diogram channels — and he\'s actively growing both of them.' },
					{ image: 'fact33.PNG', text: 'Kaz\'s Nest has its own unique microclimate, which depends almost entirely on Oki\'s mood. Being a giant teal weather phenomenon comes with certain responsibilities :3' },
					{ image: 'fact34.PNG', text: 'Aunt Veda makes the most delicious pear rolls in the entire village using pears from her own trees!' },
					{ image: 'fact35.PNG', text: 'Aunt Veda\'s best friend is oxygen bleach.' },
					{ image: 'fact36.PNG', text: 'Captain Vo fights actual pirates on his Deck Area. One against THOUSANDS! Each type requires its own special weapon — and preferably one that doesn\'t poison the good guys too!' },
					{ image: 'fact37.PNG', text: 'There\'s a strange book hidden away in Aunt Veda\'s attic. When Per-pere tried to read it, Captain Vo immediately forbade it. Just to be safe, the book was later hidden somewhere else entirely. What could that possibly mean?' },
					{ image: 'fact46.PNG', text: 'Kaz feels exactly like a puffed-up bubble of pastry dough dusted with a thin layer of flour.' },
					{ image: 'fact50.PNG', text: 'Aunt Veda has nobody in her house to talk to except Per-pere. That\'s because none of the other residents of Kaz\'s Nest can communicate using ordinary words.' },
					{ image: 'fact51.PNG', text: 'Aunt Veda is a thermal diode (TD) with a sturdy build and a practical, hardworking nature. The anatomy of TDs sometimes includes a special heart-drawer inside their chest, where they can keep their most precious belongings — including family heirlooms passed down from grandmothers and great-grandmothers.' },
					{ image: 'fact54.PNG', text: 'Cylindrical Robocat behaves exactly like a cat because of a database - a book about cats - soldered into his back.' },
					{ image: 'fact57.PNG', text: 'Diodes also have their own currency.' },
					{ image: 'fact58.PNG', text: 'Every evening, when the drafts come from the Boundary, the villagers cover their windows with heavy curtains and do not look outside all night, as this is considered protection against evil spirits. It is on such evenings that Oki and Per-pere are allowed to go outside.' },
					{ image: 'fact64.PNG', text: 'Aunt Veda is always very hospitable to Yardman-Boletus. When he comes, the conveyor belt of pear rolls in the kitchen does not stop.' }
					
            ],
            // Група 3 
            [
                { image: 'fact10.PNG', text: 'Oki\'s vision works like an image with infinite zoom-in. It keeps magnifying until you could practically fall into it — like a universe inside another universe.' },
					{ image: 'fact11.PNG', text: 'Oki often imagines himself being much smaller than he actually is.' },
					{ image: 'fact14.PNG', text: 'Oki\'s eyes can sometimes (whenever he wants) release special particles that break down nutrients in the environment. So he doesn\'t live on information alone — he eats regular food too :D' },
					{ image: 'fact15.PNG', text: 'Oki can move around quietly and incredibly fast at almost any time. If he were just a little smaller, Aunt Veda would probably let him go on nighttime hunts.' },
					{ image: 'fact16.PNG', text: 'The story of Oki\'s antennae.' },
					{ image: 'fact19.PNG', text: 'Oki\'s semi-transparent three-quarter spiderweb sleeve has been with him since the day he was born. The spiders carefully maintain it, extending and patching it whenever needed.' },
					{ image: 'fact20.PNG', text: 'Oki has translucent double eyelids that help protect his enormous eyes from outside irritants. And from alarm clocks, too :D' },
					{ image: 'fact21.PNG', text: 'Oki only has TWO modes.' },
					{ image: 'fact26.PNG', text: 'Per-pere is convinced that Oki contains a piece of computer intelligence. After all, he occasionally freezes for a moment :O' },
					{ image: 'fact27.PNG', text: 'Per-pere and Oki exchange thoughts. Literally. And nobody except Per-Pere can hear Oki\'s thoughts.' },
					{ image: 'fact30.PNG', text: 'For a long time, Oki and Per-pere believed Kaz was someone\'s real tiny ghost. That\'s because they found him during a secret walk through a cemetery.' },
					{ image: 'fact38.PNG', text: 'Oki and Per-Pere love collecting fragments of old glass. They believe that one day, if light passes through them at just the right angle, they\'ll catch a glimpse of another dimension.' },
					{ image: 'fact40.PNG', text: 'Oki is a living power source! He can generate enough electricity to charge just about anything. The voltage, however, may be a bit less stable than what you\'d get from a regular wall outlet :D' },
					{ image: 'fact41.PNG', text: 'The patterns on Oki\'s arms gradually start looking more and more like the circuitry on silicon wafers. Give it a little more time, and microchips might start soldering themselves onto his hands.' },
					{ image: 'fact42.PNG', text: 'Oki is usually connected to a special device that makes his eyes less sensitive and protects them from the outside world. Without it, the environment becomes very overwhelming for him :(' },
					{ image: 'fact45.PNG', text: 'Per-pere and Oki even have regular customers! One of them is a cool red woman with an explosive hairstyle. She constantly needs her irrigator repaired!' },
					{ image: 'fact49.PNG', text: 'Oki is unbelievably flexible! He can comfortably spend hours twisted into positions that would make ordinary light diodes imagine all their circuits snapping in half.' },
					{ image: 'fact53.PNG', text: 'Oki has two ribbons - the ends of his beige harness! They always flutter like cat\'s tails or flags on the top of a tower, and that\'s why Per-pere calls them noble.' },
					{ image: 'fact55.PNG', text: 'Once upon a time, Aunt Veda wanted to clean Oki of all his neon spots. As a result, everyone got tired, and the spots grew even more than before.' },
					{ image: 'fact59.PNG', text: 'Oki\'s legs and arms can bend anywhere! And adapt to any position :)' },
					{ image: 'fact60.PNG', text: 'Oki\'s fork antenna is under constant voltage. Don\'t you dare touch it!' },
					{ image: 'fact63.PNG', text: 'How has Oki managed to walk without hurting a single mechanical teal cat, no bigger than a flea? It\'s all thanks to an army of special, very strong mechanical spiders that support his feet so they don\'t touch the ground.' },
					{ image: 'fact66.PNG', text: 'In fact, none other than Yardman-Boletus began to build Kaz\'s Nest.' }
					
            ]
        ];
        
		// Масиви для preload зображень
        this.preloadedImages = [];
		
		// Ініціалізація стану з локального сховища або значень за замовчуванням
        this.loadState();
        
        this.init();
    }
	
	// Завантаження збереженого стану
    loadState() {
        const savedState = JSON.parse(localStorage.getItem('PerpereBoxStateNew') || '{}');
        
        // Основний таймер
        this.timeLeft = savedState.timeLeft !== undefined ? savedState.timeLeft : 1500;
        this.isLocked = savedState.isLocked !== undefined ? savedState.isLocked : true;
        
        // Групова система
        this.currentGroupIndex = savedState.currentGroupIndex || 0;
        this.groupTimeLeft = savedState.groupTimeLeft !== undefined ? savedState.groupTimeLeft : 900;
        this.isGroupTimerActive = savedState.isGroupTimerActive || false;
        this.unlockCount = savedState.unlockCount || 0;
        
        // Встановлення доступних фактів на основі поточної групи
        // Важливо: додаємо тільки групи, які реально розблоковані
        this.availableFacts = [];
        
        if (this.isLocked) {
            // Якщо скринька ще заблокована, доступних фактів немає
            this.availableFacts = [];
        } else {
            // Якщо скринька розблокована, додаємо групи по порядку
            for (let i = 0; i <= this.currentGroupIndex; i++) {
                if (this.factGroups[i]) {
                    this.availableFacts = [...this.availableFacts, ...this.factGroups[i]];
                }
            }
            
            // Якщо немає доступних фактів (помилка), додаємо першу групу
            if (this.availableFacts.length === 0) {
                this.availableFacts = [...this.factGroups[0]];
                this.currentGroupIndex = 0;
            }
        }
    }

    // Збереження поточного стану
    saveState() {
        const state = {
            timeLeft: this.timeLeft,
            isLocked: this.isLocked,
            currentGroupIndex: this.currentGroupIndex,
            groupTimeLeft: this.groupTimeLeft,
            isGroupTimerActive: this.isGroupTimerActive,
            unlockCount: this.unlockCount
        };
        
        localStorage.setItem('PerpereBoxStateNew', JSON.stringify(state));
    }

    init() {
        // Відновлення візуального стану
        this.restoreVisualState();
        
        // Запуск відповідного таймера
        if (this.isLocked && this.timeLeft > 0) {
            this.startTimer();
        } else if (!this.isLocked) {
            this.initUnlockedAnimations();
            
            // Якщо груповий таймер був активний, відновити його
            if (this.isGroupTimerActive && this.groupTimeLeft > 0) {
                this.startGroupTimer();
            } else if (this.currentGroupIndex >= this.factGroups.length - 1) {
                // Всі групи вже розблоковані
                this.timer.textContent = "%!&!";
            }
        }
        
        this.setupEventListeners();
// Preload першої групи зображень одразу
this.preloadGroup(0);

// Preload другої і третьої групи одразу після першої
this.preloadGroup(1);
this.preloadGroup(2);

// Збереження стану при закритті сторінки
window.addEventListener('beforeunload', () => {
    this.saveState();
});

// Періодичне збереження стану
setInterval(() => {
    this.saveState();
}, 1000);
this.bubbleObserver = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
        if (m.attributeName === 'class') {
            const classes = this.factBubble.classList;
            if (classes.contains('show') || classes.contains('suck-in')) {
                this.muteChestSound();
            }
        }
    });
});
this.bubbleObserver.observe(this.factBubble, { attributes: true });
    }
	
	// Відновлення візуального стану після перезавантаження
    restoreVisualState() {
        if (!this.isLocked) {
            this.boxImage.src = "../../images2/teapotIdleENG.webp";
            this.boxImage.alt = "Unlocked Treasure Box";
            this.treasureBox.classList.add('unlocked');
            this.speechBubble.classList.remove('show');
        }
        
        // Оновити номер групи в інтерфейсі
        this.factGroupNumber.textContent = this.currentGroupIndex + 1;
        
        // Оновити відображення таймера
        if (this.isLocked) {
            this.updateTimerDisplay();
        } else if (this.isGroupTimerActive && this.groupTimeLeft > 0) {
            this.updateGroupTimerDisplay();
        } else if (this.currentGroupIndex >= this.factGroups.length - 1) {
            this.timer.textContent = "%!&!";
        } else {
            // Якщо груповий таймер не активний але є ще групи для розблокування
            this.updateGroupTimerDisplay();
        }
    }

    startTimer() {
        if (this.mainTimerInterval) {
            clearInterval(this.mainTimerInterval);
        }
        
        this.mainTimerInterval = setInterval(() => {
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                clearInterval(this.mainTimerInterval);
                this.unlockBox();
            } else {
                this.timeLeft--;
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateGroupTimerDisplay() {
        const minutes = Math.floor(this.groupTimeLeft / 60);
        const seconds = this.groupTimeLeft % 60;
        this.timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    startGroupTimer() {
        if (this.groupTimerInterval) {
            clearInterval(this.groupTimerInterval);
        }
        
        // Перевірити, чи потрібно запускати груповий таймер
        if (this.currentGroupIndex >= this.factGroups.length - 1) {
            // Всі групи вже розблоковані
            this.isGroupTimerActive = false;
            this.timer.textContent = "%!&!";
            return;
        }
        
        this.isGroupTimerActive = true;
        
        this.groupTimerInterval = setInterval(() => {
            this.updateGroupTimerDisplay();
            
            if (this.groupTimeLeft <= 0) {
                clearInterval(this.groupTimerInterval);
                this.unlockNextGroup();
            } else {
                this.groupTimeLeft--;
            }
        }, 1000);
    }

    unlockNextGroup() {
        this.currentGroupIndex++;
        
        // Перевірити, чи є ще групи для розблокування
        if (this.currentGroupIndex < this.factGroups.length) {
            // Додати нову групу до доступних фактів
            this.availableFacts = [...this.availableFacts, ...this.factGroups[this.currentGroupIndex]];
            
            // Оновити номер групи в інтерфейсі
            this.factGroupNumber.textContent = this.currentGroupIndex + 1;
            
            // Показати повідомлення про розблокування
            this.showUnlockBubble();
            
            // Запустити таймер для наступної групи, якщо вона існує
            if (this.currentGroupIndex + 1 < this.factGroups.length) {
                this.isGroupTimerActive = false;
                this.groupTimeLeft = 900; // Скинути час для нової групи
                this.startGroupTimer();
            } else {
                // Всі групи розблоковані, таймер зупиняється
                this.isGroupTimerActive = false;
                this.timer.textContent = "%!&!";
            }
        }
    }

    unlockBox() {
        this.isLocked = false;
        this.boxImage.src = "../../images2/teapotIdleENG.webp";
        this.boxImage.alt = "Unlocked Treasure Box";
        this.treasureBox.classList.add('unlocked');
        
        // Встановити доступні факти тільки з першої групи
        this.availableFacts = [...this.factGroups[0]];
        this.currentGroupIndex = 0;
        
        // Сховати бульбашку заблокованої скриньки
        this.speechBubble.classList.remove('show');
        
        // Показати жовту бульбашку розблокування
        this.showUnlockBubble();
        
        // Ініціалізувати анімації для розблокованої скриньки
        this.initUnlockedAnimations();
        
        // Запустити таймер групи
        this.groupTimeLeft = 900; // Встановити час для першої групи
        this.startGroupTimer();
    }

    setupEventListeners() {
        this.treasureBox.addEventListener('mouseenter', () => {
            if (this.isLocked) {
                this.speechBubble.classList.add('show');
            } else {
                this.handleUnlockedHover();
            }
        });

        this.treasureBox.addEventListener('mouseleave', () => {
            if (this.isLocked) {
                this.speechBubble.classList.remove('show');
            } else {
                this.handleUnlockedLeave();
                // Сховати факт при відведенні курсора від скриньки
                this.hideFactBubble();
            }
        });

        this.treasureBox.addEventListener('click', () => {
            if (!this.isLocked) {
                this.showFactBubbleWithAnimation();
            }
        });

        this.factClose.addEventListener('click', (e) => {
            e.stopPropagation();
            this.hideFactBubble();
        });

        // МИША
this.factImage.addEventListener('mouseenter', () => {
    this.magnifyingGlass.classList.add('active');
});
this.factImage.addEventListener('mouseleave', () => {
    this.magnifyingGlass.classList.remove('active');
});
this.factImage.addEventListener('mousemove', (e) => {
    this.updateMagnifyingGlass(e);
});

// МОБІЛЬНИЙ
this.factImage.addEventListener('touchstart', (e) => {
    e.preventDefault(); // блокує свайп
    this.magnifyingGlass.classList.add('active');
    this.updateMagnifyingGlass(e);
}, { passive: false });

this.factImage.addEventListener('touchmove', (e) => {
    e.preventDefault(); // блокує прокрутку
    this.updateMagnifyingGlass(e);
}, { passive: false });

this.factImage.addEventListener('touchend', () => {
    this.magnifyingGlass.classList.remove('active');
});

// Вимикаємо контекстне меню при довгому тапі
this.factImage.addEventListener('contextmenu', (e) => e.preventDefault());
    }


    initUnlockedAnimations() {
    // Preload всіх зображень для анімацій
    this.preloadAnimationImages();
    
    // Ініціалізація анімацій для розблокованої скриньки
    this.currentHoverState = 'idle';
}

preloadAnimationImages() {
    // Масив всіх зображень які використовуються в анімаціях
    const imageNames = [
        'teapotHoverENG',
        'teapotHoverIdleENG', 
        'teapotHoverReverseENG',
        'teapotIdleENG'
    ];
    
    // Створюємо масив для зберігання preloaded зображень
    this.preloadedImages = {};
    
    imageNames.forEach(imageName => {
        const img = new Image();
        img.src = `../../images2/${imageName}.webp`;
        
        // Зберігаємо preloaded зображення
        this.preloadedImages[imageName] = img;
        
        // Опціонально: логування успішного завантаження
        img.onload = () => {
            console.log(`Preloaded: ${imageName}.webp`);
        };
        
        // Опціонально: обробка помилок завантаження
        img.onerror = () => {
            console.warn(`Failed to preload: ${imageName}.webp`);
        };
    });
}

playSound(fileName, trackAsChestSound = false) {
	// 🔇 Спільний перемикач звуку (sound-mute-state.js)
    if (window.SoundPrefs && window.SoundPrefs.isMuted()) return null;
	
    if (!this.soundCache.has(fileName)) {
        const audio = new Audio(this.SOUND_DIR + fileName);
        audio.preload = 'auto';
        this.soundCache.set(fileName, audio);
    }
    const instance = this.soundCache.get(fileName).cloneNode();

    if (trackAsChestSound) {
        this.activeChestAudio = instance;
    }

    instance.play().catch(() => {});
    return instance;
}

muteChestSound() {
    if (this.activeChestAudio) {
        this.activeChestAudio.pause();
        this.activeChestAudio.currentTime = 0;
        this.activeChestAudio = null;
    }
}

handleUnlockedHover() {
    this.isHovering = true;
    // Не програвати звук, якщо ми зараз в процесі перемикання факту —
    // browser може викликати цей hover штучно (hit-testing після зміни DOM)
    if (!this.suppressChestSound) {
        this.playSound('teapotOpening.mp3', true); // true — трекаємо як chest sound
    }
    // Очистити попередній таймер якщо він існує
    if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
    }
    
    // Змінити зображення на teapotHoverENG
    this.setBoxImage('teapotHoverENG', 'Hover Box');
    this.currentHoverState = 'hover';
    
    // Встановити таймер на 1140ms для переходу в hover-idle
    this.hoverTimeout = setTimeout(() => {
        if (this.isHovering) {
            this.setBoxImage('teapotHoverIdleENG', 'Hover Idle Box');
            this.currentHoverState = 'hover-idle';
        }
    }, 950);
}

handleUnlockedLeave() {
    this.isHovering = false;
    // Те саме — не програвати звук закривання, якщо це "фантомний" leave
    // під час перемикання факту
    if (!this.suppressChestSound) {
        this.playSound('teapotClosing.mp3', true); // true — трекаємо як chest sound
    }
    // Очистити таймер
    if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = null;
    }
    
    // Змінити зображення на teapotHoverReverseENG
    this.setBoxImage('teapotHoverReverseENG', 'Hover Reverse Box');
    this.currentHoverState = 'reverse';
    
    // Після короткої затримки повернути до idle стану
    setTimeout(() => {
        if (!this.isHovering) {
            this.setBoxImage('teapotIdleENG', 'Idle Box');
            this.currentHoverState = 'idle';
        }
    }, 500); // Можна налаштувати тривалість reverse анімації
}

setBoxImage(imageName, fallbackText) {
    // Використовувати preloaded зображення якщо доступно
    if (this.preloadedImages && this.preloadedImages[imageName]) {
        this.boxImage.src = this.preloadedImages[imageName].src;
    } else {
        // Fallback до прямого шляху якщо preload не спрацював
        this.boxImage.src = `../../images2/${imageName}.webp`;
    }
    this.boxImage.alt = fallbackText;
}

    showUnlockBubble() {
        // Оновити повідомлення залежно від кількості розблокувань
        this.unlockCount++;
        this.playSound('boxUnlocked2.mp3');
        if (this.unlockCount === 1) {
            this.unlockMessage.textContent = 'The teapot is unlocked!';
        } else if (this.unlockCount === 2) {
            this.unlockMessage.textContent = 'The teapot is updated!';
        } else if (this.unlockCount === 3) {
            this.unlockMessage.textContent = 'The teapot is updated (finally)!!';
        }
        
        this.unlockBubble.classList.add('show');
        
        // Приховати через 6 секунд
        setTimeout(() => {
            this.unlockBubble.classList.remove('show');
        }, 6000);
    }

    showFactBubbleWithAnimation() {
    // Блокуємо звуки ChestOpening/ChestClosing на весь час анімації переключення факту.
    // Це важливіше за muteChestSound(), бо той глушить лише те, що ВЖЕ грає —
    // а тут ми запобігаємо запуску звуку, який ще навіть не почав відтворюватись
    // (browser може викликати mouseleave/mouseenter вже ПІСЛЯ зміни DOM,
    // коли muteChestSound() вже відпрацював).
    this.suppressChestSound = true;
    clearTimeout(this.suppressChestSoundTimeout);

    this.muteChestSound(); // заглушити ChestOpening/ChestClosing, якщо вже грає

    if (this.isFactBubbleVisible) {
        this.suckInBubble().then(() => {
            this.showNewFact();
        });
    } else {
        this.showNewFact();
    }

    // Зняти блокування вже після завершення suck-in (400ms) + показу нового факту (100ms)
    // + невеликий запас на те, щоб браузер встиг перерахувати hover-стан
    this.suppressChestSoundTimeout = setTimeout(() => {
        this.suppressChestSound = false;
    }, 800);
}

    suckInBubble() {
        return new Promise((resolve) => {
			this.muteChestSound(); // глушимо перед suck-in
            this.factBubble.classList.add('suck-in');
            
            setTimeout(() => {
                this.factBubble.classList.remove('show');
                this.factBubble.classList.remove('suck-in');
                this.isFactBubbleVisible = false;
                resolve();
            }, 400); // Час анімації втягування
        });
    }

    showNewFact() {
		this.muteChestSound(); // глушимо перед show
		this.playSound('factPull.mp3');
        // Випадковий вибір факту з доступних фактів
        const randomIndex = Math.floor(Math.random() * this.availableFacts.length);
        const selectedFact = this.availableFacts[randomIndex];
        
        // Встановити зображення та текст
        this.factImage.src = `https://cdn.jsdelivr.net/npm/@surzik25/perpere-teapot-facts-eng@1.0.0/facts/${selectedFact.image}`;
        this.factImage.alt = `Fact ${randomIndex + 1}`;
        this.factText.textContent = selectedFact.text;
		this.adjustBubblePosition();
        
        // Встановити збільшене зображення (використовуємо те саме зображення)
        this.magnifiedImage.src = `https://cdn.jsdelivr.net/npm/@surzik25/perpere-teapot-facts-eng@1.0.0/facts/${selectedFact.image}`;
        this.magnifiedImage.alt = `Magnified Fact ${randomIndex + 1}`;
        
        // Невелика затримка перед показом нового факту
        setTimeout(() => {
            this.factBubble.classList.add('show');
            this.isFactBubbleVisible = true;
        }, 100);
    }
	
	adjustBubblePosition() {
    const text = this.factText.textContent || '';
    const charCount = text.length;
    
    // Базова позиція і зміщення залежно від кількості символів
    let bottomValue;
    
    if (charCount <= 80) {
        bottomValue = -390;   // короткий текст — бульбашка вища
    } else if (charCount <= 150) {
        bottomValue = -420;
    } else if (charCount <= 250) {
        bottomValue = -470;   // середній (базовий)
    } else if (charCount <= 350) {
        bottomValue = -500;
    } else {
        bottomValue = -540;   // довгий текст — бульбашка нижче
    }
    
    this.factBubble.style.bottom = `${bottomValue}px`;
}

    updateMagnifyingGlass(e) {
    if (!this.magnifyingGlass.classList.contains('active')) return;

    const rect = this.factImage.getBoundingClientRect();

    let clientX, clientY;
    if (e.touches) { 
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Зсув скла трохи вище точки дотику (наприклад, на 40px)
    const fingerOffsetY = e.touches ? 40 : 0;

    this.magnifyingGlass.style.left = `${x - 50}px`;
    this.magnifyingGlass.style.top = `${y - 50 - fingerOffsetY}px`;

    const glassSize = 100;
    const maxX = this.factImage.offsetWidth - glassSize;
    const maxY = this.factImage.offsetHeight - glassSize;

    if (x < 50) this.magnifyingGlass.style.left = '0px';
    if (x > maxX + 50) this.magnifyingGlass.style.left = `${maxX}px`;
    if (y < 50) this.magnifyingGlass.style.top = '0px';
    if (y > maxY + 50) this.magnifyingGlass.style.top = `${maxY}px`;

    const scaleX = x / this.factImage.offsetWidth;
    const scaleY = y / this.factImage.offsetHeight;

    const offsetX = scaleX * 450;
    const offsetY = scaleY * 350;

    this.magnifiedImage.style.left = `-${offsetX - 50}px`;
    this.magnifiedImage.style.top = `-${offsetY - 50 - fingerOffsetY}px`;
}

    hideFactBubble() {
        if (this.isFactBubbleVisible) {
            this.factBubble.classList.remove('show');
            this.isFactBubbleVisible = false;
        }
    }
	
	preloadGroup(groupIndex) {
        if (groupIndex >= this.factGroups.length) return;
        
        console.log(`Preloading group ${groupIndex + 1}...`);
        
        const group = this.factGroups[groupIndex];
        const groupPreloadPromises = [];
        
        group.forEach((fact, index) => {
            const img = new Image();
            const imageUrl = `https://cdn.jsdelivr.net/npm/@surzik25/perpere-teapot-facts-eng@1.0.0/facts/${fact.image}`;
            
            const loadPromise = new Promise((resolve, reject) => {
                img.onload = () => {
                    console.log(`Preloaded: ${fact.image}`);
                    resolve(img);
                };
                img.onerror = () => {
                    console.warn(`Failed to preload: ${fact.image}`);
                    reject(new Error(`Failed to load ${fact.image}`));
                };
            });
            
            img.src = imageUrl;
            this.preloadedImages.push(img);
            groupPreloadPromises.push(loadPromise);
        });
        
        Promise.allSettled(groupPreloadPromises).then((results) => {
            const successful = results.filter(result => result.status === 'fulfilled').length;
            const failed = results.filter(result => result.status === 'rejected').length;
            console.log(`Group ${groupIndex + 1} preload complete: ${successful} successful, ${failed} failed`);
        });
    }
}

// Ініціалізація після завантаження сторінки
document.addEventListener('DOMContentLoaded', () => {
    new TreasureBoxTimer();
});
