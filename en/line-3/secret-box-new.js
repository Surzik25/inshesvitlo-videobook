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
               { image: 'fact1.PNG', text: 'Klocha likes mayflies because he feels a certain solidarity with them (as well as with lizards)' },
                    { image: 'fact2.PNG', text: 'Klocha’s diary had been lying untouched in an attic chest for ten years (in a chest like this one)' },
                    { image: 'fact3.PNG', text: 'Klocha wouldn\'t trade his ancient bladed knife for any other - no matter how many times sharper and more attractive it would be.' },
                    { image: 'fact4.PNG', text: 'Klocha likes to metaphorize, pessimize (he himself admits it) and expand into three volumes, and then get confused in his own sentences.' },
                    { image: 'fact5.PNG', text: 'Klocha often didn\'t have time to finish his schoolwork in one short lesson, but his teachers generously allowed him to finish it during breaks. Sometimes... even that wasn\'t enough.' },
                    { image: 'fact6.PNG', text: 'Among Klocha\'s pets there is not only Darky. Meet Greeny, Amanita, Vulcan and Big Toad. Compared to Darky, they are snail lizards.' },
                    { image: 'fact7.PNG', text: 'Klocha is often forced to eat his own burnt pancakes, because if Aunt Yishi cooks something, it\'s... sometimes not entirely edible.' },
                    { image: 'fact8.PNG', text: 'Klocha\'s dark circles under his eyes seem to indicate his tragic past, although in reality... it\'s more of a projection into the future.' },
					{ image: 'fact9.PNG', text: 'Klocha is an owl (according to biorhythm). That is, it is practically impossible to wake him up at 6 AM (although Aunty Yishi is capable of anything)' },
					{ image: 'fact10.PNG', text: 'Klocha considers himself aromantic (i.e., not inclined to love in the trivial sense of the word). This will definitely remain an axiom in the near future.' },
					{ image: 'fact11.PNG', text: 'For a long time, Klocha had a dream. Instead of following Aunt Yishi on a hike, as usual, he would dive into her backpack. And sit there quietly, enjoying the way she carries him and not suspecting anything.' },
					{ image: 'fact12.PNG', text: 'Klocha was always good on his own. If it weren\'t for Aunt Yishi, he would have lived in the basement for months.' },
					{ image: 'fact13.PNG', text: 'Klocha\'s birthday is November 22, year 136 (P.E.). At the time of writing these pages, he is fourteen (or fifteen?). Those difficult teenage years, when everything falls apart...' },
					{ image: 'fact14.PNG', text: 'Klocha has a secret phobia of wires (especially bare ones). Not because of the electric current, but simply because of diode moral principles.' },
					{ image: 'fact15.PNG', text: 'Although Klocha has semi-mechanical arms, he has never associated himself with a robot. On the contrary, he seeks to hide from the whole future in a dark cave.' },
					{ image: 'fact16.PNG', text: 'Klocha has a skeleton of a creature in his room that looks like a human (which raises some questions). Surprisingly, he is not as afraid of bones as he is of wires.' },
					{ image: 'fact17.PNG', text: 'Klocha believes he was born a light-emitted diode due to some strange mistake. Like..he\'s too dark to be bright.' },
					{ image: 'fact18.PNG', text: 'Klocha had never understood those who cared too much about their appearance. Why waste energy on a body that would soon decay?' },
					{ image: 'fact19.PNG', text: 'Klocha is incredibly grateful to Aunt Yishi for not participating in his alchemical experiments. Then... the whole building would be covered in soot, not just his basement.' }
            ],
            // Група 2 
            [
                { image: 'fact20.PNG', text: 'During aunt-Yishi-style campings, Klocha is enveloped in sarcasm and pessimism. *It\'s all because of acute nostalgia for home* - he says.' },
				{ image: 'fact21.PNG', text: 'Darkness Hedgehogs are Klocha’s best companions (after his checkered scarf, of course). They are so dear to him that he doesn’t even want to figure out where they come from.' },
				{ image: 'fact22.PNG', text: 'Klocha often twitches and gets shivers from various silly things (from slugs, unpleasant memories, or some of auntie’s overly enthusiastic naturalist phrases).' },
				{ image: 'fact23.PNG', text: 'Klocha’s parents divorced before he was even born, and all he got from them was a bizarre name.' },
				{ image: 'fact24.PNG', text: 'Klocha never takes off his checkered scarf even in summer, because he became too attached to it.' },
				{ image: 'fact25.PNG', text: 'Sometimes Klocha carries a knife with him even in places where there is seemingly nothing to cut. At first glance..' },
				{ image: 'fact26.PNG', text: 'Klocha tried several times to understand the meaning of his name, but eventually gave up on it and accepted it as it is.' },
				{ image: 'fact27.PNG', text: 'Klocha can only be seen smiling in three cases: \n1) when he is looking at a lizard;\n2) when he is looking at Aunt Yishi sleeping peacefully after a crazy day;\n3) when his alchemical experiments succeed.' },
				{ image: 'fact28.PNG', text: 'Darky has a bow on her head that she wove herself out of dried slug slime (just don’t tell Klocha about it)' },
				{ image: 'fact29.PNG', text: 'Klocha is glad nobody bothers him during school breaks: it gives him time to write down interesting combinations of elements. Sometimes he even does it during lessons, because ideas should be caught by the tail.' },
				{ image: 'fact30.PNG', text: 'What unites Klocha and Aunt Yishi is that they both swim against the current. It is hard, but it is right.' },
				{ image: 'fact31.PNG', text: 'Klocha is slightly nearsighted, despite having elongated pupils like a cat :)' },
				{ image: 'fact32.PNG', text: 'Klocha has long dreamed of owning a mass spectrometer (a device that ionizes liquids), and in his basement there are several special metal mailboxes where he collects coins for it.' },
				{ image: 'fact33.PNG', text: 'The metal mailboxes in Klocha’s basement work like time capsules. You put a silver coin or a tiny note inside — and forget about it the very next moment.' },
				{ image: 'fact34.PNG', text: 'Klocha likes climbing onto the small roof of his basement and staring at the boundary between the sky and the Abyss. Good thing Aunt Yishi distracts him from time to time, otherwise he would drown in that Boundary just like in his own thoughts.' },
				{ image: 'fact35.PNG', text: 'When Klocha drills his gaze into the kitchen window — nine times out of ten he is actually staring at his Townsfolk fir tree.' }
            ],
            // Група 3 
            [
                { image: 'fact36.PNG', text: 'Klocha has never been afraid of heights. If his story is to be believed, he once even fell asleep on the top of his Townsfolk fir tree when he was little.' },
				{ image: 'fact37.PNG', text: 'Klocha believes that the most interesting things happen either at the top of a high-rise building or at its feet. That is why he loves basements and attics so much.' },
				{ image: 'fact38.PNG', text: 'Klocha’s basement was inherited by Aunt Yishi from her brother, who was a whole thirty-five and a half years older than her, worked at a carpet factory, and also (just like Klocha) absolutely loved living in basements. *So that’s where those genes came from!*' },
				{ image: 'fact39.PNG', text: 'There is a potbelly stove in Klocha’s basement. Sometimes he even lights it, but it is more for the soul than for warmth.' },
				{ image: 'fact40.PNG', text: 'Klocha has a weakness not only for basements and attics, but also for hideouts. Once, at six years old, he brought a saw into the apartment (which at the time was three times longer than he was), and nearly started sawing the walls to turn their apartment into a treehouse. Luckily, aunt Yishi saved the situation (she may be crazy, but not that crazy!)' },
				{ image: 'fact41.PNG', text: 'Klocha used to be much more restless and similar to his aunt, and now even he himself finds it a little strange.' },
				{ image: 'fact42.PNG', text: 'Klocha is left-handed.' },
				{ image: 'fact43.PNG', text: 'Even though Klocha’s hands are metallic, they are still sensitive. Semi-sensitive metals of diode exoskeletons' },
				{ image: 'fact44.PNG', text: 'The Boundary (the Abyss) can be seen on the horizon from any corner of the Diode World. It has hallucinatory properties that break ordinary spatial laws.' },
				{ image: 'fact45.PNG', text: 'Klocha is sometimes (rarely, but unpredictably) attacked by sudden negative impulses. Even because of everyday little things.' },
				{ image: 'fact46.PNG', text: 'There are scrolls with endless to-do lists hanging in Aunt Yishi’s kitchen. She writes down new tasks before even finishing half of the old ones :D' },
				{ image: 'fact47.PNG', text: 'Aunt Yishi is a wonderful representative of the TD species (thermal diodes). Slim, tall (90-135 cm is the average height for TDs), yet heavy as a stone. There are stone impurities inside TD bodies, so this is completely normal!' },
				{ image: 'fact48.PNG', text: 'When it comes to wild berries — no higher power can stop Aunt Yishi. Although gathering wild berries near the Abyss is, at the very least, risky...' },
				{ image: 'fact49.PNG', text: 'As Klocha says...the only times you can catch Aunt Yishi staying in one place are when she is enthusiastically ordering something online, or when she is asleep. Too bad they do not have that much money...' },
				{ image: 'fact50.PNG', text: 'Klocha often wondered: why do Madame Olle’s wandering planetariums stop so often right near his basement? To track all of his actions, and then...what? What do they want?' },
				{ image: 'fact51.PNG', text: 'Klocha suffers from a strange unexplained phobia of licking spoons and bottle necks. Although touching them with his teeth apparently does not scare him.' },
				{ image: 'fact52.PNG', text: 'In early childhood, Klocha had a (small) flare-up of impulsiveness and hyperactivity. He even wore a special stabilizer on his head..good thing he does not need it anymore.' },
				{ image: 'fact53.PNG', text: 'Klocha likes to make himself cocoa because it helps him accumulate warmth and mobilize his thoughts at the same time.' },
				{ image: 'fact54.PNG', text: 'Klocha doesn\'t believe in cardboard magic, but he does believe in alchemy - there\'s a thin barrier here.' },
				{ image: 'fact55.PNG', text: 'Aunt Yishi is an incredible fan of recreational fishing. When the bite is good, she is ready to live in her favorite fishing bay for weeks.' },
				{ image: 'fact56.PNG', text: 'Klocha gets to school on the bus numbered "Cheerful Three." To him, this sounds more like a mockery than a normal name.' },
				{ image: 'fact57.PNG', text: 'Aunt Yishi is constantly assuring Klocha how cool and amazing it would be to live in the village. Then, she says, she would be able to communicate with the spider bugs at the campsites even in winter, when they hibernate!' },
				{ image: 'fact58.PNG', text: 'An entire African elephant with a crimson cape could fit into Aunt Yishi\'s backpack and disappear there like in a black hole.' },
				{ image: 'fact59.PNG', text: 'Klocha\'s ancestors were indeed of pure Eastern descent.' },
				{ image: 'fact60.PNG', text: 'Klocha and Aunt Yishi live on the fourth floor of a four-story building. Do you think they don\'t have a neighbor upstairs who has a room next to the attic and whips cream for cakes, coming only on weekends? You\'re sorely mistaken!' },
				{ image: 'fact61.PNG', text: 'Alchemy is the only subject in which Klocha can feel truly interested and enthusiastic. Even his teacher seems pretty good to him... so he calls her his favorite alchemist, and even without sarcasm.' },
				{ image: 'fact62.PNG', text: 'Aunt Yishi is sometimes struck by the inspiration to make her so-called partisan porri(d)ge - a smoked, thoroughly mixed mash of pumpkin, millet, fried crucian carp and two kilograms of butter. How could anything unappetizing come out of such ingredients?' },
				{ image: 'fact63.PNG', text: 'Aunt Yishi is somewhat obsessed with irrigators. Maybe it\'s because she wants to ensure maximum care for her 33rd tooth?' },
				{ image: 'fact64.PNG', text: 'Aunt Yishi has her favorite village repairmen, whom she once accidentally found in Diogram. Sometimes she goes to them with BAGS of stuff to fix, because they do it incredibly well and for absolutely no cost!' },
				{ image: 'fact65.PNG', text: 'In the diode city, a common practice is mobile buildings that can fit into one small, lightweight case.' },
				{ image: 'fact66.PNG', text: 'Catty bears are a unique species of endangered animals whose trust is very difficult to gain. Only Aunt Yishi can do it.' },
				{ image: 'fact67.PNG', text: 'Klocha has a special play terrarium for all his lizards, which he won back from Aunt Yishi. Otherwise it would be just another piranha tank!' }
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
        const savedState = JSON.parse(localStorage.getItem('treasureBoxStateN2N') || '{}');
        
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
        
        localStorage.setItem('treasureBoxStateN2N', JSON.stringify(state));
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
    }
	
	// Відновлення візуального стану після перезавантаження
    restoreVisualState() {
        if (!this.isLocked) {
            this.boxImage.src = "../../images2/chestIdleENG.gif";
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
        this.boxImage.src = "../../images2/chestIdleENG.gif";
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
        'chestHoverENG',
        'chestHoverIdleENG', 
        'chestHoverReverseENG',
        'chestIdleENG'
    ];
    
    // Створюємо масив для зберігання preloaded зображень
    this.preloadedImages = {};
    
    imageNames.forEach(imageName => {
        const img = new Image();
        img.src = `../../images2/${imageName}.gif`;
        
        // Зберігаємо preloaded зображення
        this.preloadedImages[imageName] = img;
        
        // Опціонально: логування успішного завантаження
        img.onload = () => {
            console.log(`Preloaded: ${imageName}.gif`);
        };
        
        // Опціонально: обробка помилок завантаження
        img.onerror = () => {
            console.warn(`Failed to preload: ${imageName}.gif`);
        };
    });
}

handleUnlockedHover() {
    this.isHovering = true;
    
    // Очистити попередній таймер якщо він існує
    if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
    }
    
    // Змінити зображення на chestHoverENG
    this.setBoxImage('chestHoverENG', 'Hover Box');
    this.currentHoverState = 'hover';
    
    // Встановити таймер на 1140ms для переходу в hover-idle
    this.hoverTimeout = setTimeout(() => {
        if (this.isHovering) {
            this.setBoxImage('chestHoverIdleENG', 'Hover Idle Box');
            this.currentHoverState = 'hover-idle';
        }
    }, 1140);
}

handleUnlockedLeave() {
    this.isHovering = false;
    
    // Очистити таймер
    if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = null;
    }
    
    // Змінити зображення на chestHoverReverseENG
    this.setBoxImage('chestHoverReverseENG', 'Hover Reverse Box');
    this.currentHoverState = 'reverse';
    
    // Після короткої затримки повернути до idle стану
    setTimeout(() => {
        if (!this.isHovering) {
            this.setBoxImage('chestIdleENG', 'Idle Box');
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
        this.boxImage.src = `../../images2/${imageName}.gif`;
    }
    this.boxImage.alt = fallbackText;
}

    showUnlockBubble() {
        // Оновити повідомлення залежно від кількості розблокувань
        this.unlockCount++;
        
        if (this.unlockCount === 1) {
            this.unlockMessage.textContent = 'The chect is unlocked!';
        } else if (this.unlockCount === 2) {
            this.unlockMessage.textContent = 'The chect is updated!';
        } else if (this.unlockCount === 3) {
            this.unlockMessage.textContent = 'The chest is updated (finally)!';
        }
        
        this.unlockBubble.classList.add('show');
        
        // Приховати через 6 секунд
        setTimeout(() => {
            this.unlockBubble.classList.remove('show');
        }, 6000);
    }

    showFactBubbleWithAnimation() {
        if (this.isFactBubbleVisible) {
            // Якщо бульбашка вже видима, спочатку втягуємо її
            this.suckInBubble().then(() => {
                this.showNewFact();
            });
        } else {
            // Якщо бульбашка не видима, просто показуємо новий факт
            this.showNewFact();
        }
    }

    suckInBubble() {
        return new Promise((resolve) => {
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
        // Випадковий вибір факту з доступних фактів
        const randomIndex = Math.floor(Math.random() * this.availableFacts.length);
        const selectedFact = this.availableFacts[randomIndex];
        
        // Встановити зображення та текст
        this.factImage.src = `https://cdn.jsdelivr.net/npm/@surzik25/klocha-box-facts-eng@latest/facts/${selectedFact.image}`;
        this.factImage.alt = `Fact ${randomIndex + 1}`;
        this.factText.textContent = selectedFact.text;
		this.adjustBubblePosition();
        
        // Встановити збільшене зображення (використовуємо те саме зображення)
        this.magnifiedImage.src = `https://cdn.jsdelivr.net/npm/@surzik25/klocha-box-facts-eng@latest/facts/${selectedFact.image}`;
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
        bottomValue = -320;   // короткий текст — бульбашка вища
    } else if (charCount <= 150) {
        bottomValue = -370;
    } else if (charCount <= 250) {
        bottomValue = -420;   // середній (базовий)
    } else if (charCount <= 350) {
        bottomValue = -480;
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

    // Зсув скла трохи вище точки дотику (наприклад, на 50px)
    const fingerOffsetY = e.touches ? 50 : 0;

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
            const imageUrl = `https://cdn.jsdelivr.net/npm/@surzik25/klocha-box-facts-eng@latest/facts/${fact.image}`;
            
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
