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
               { image: 'fact1.PNG', text: 'Клоча любить метеликів-одноденок, бо відчуває з ними деяку солідарність (як і з ящірками)' },
                    { image: 'fact2.PNG', text: 'Щоденник Клочі десять років валявся порожняком на горищі у скриньці (такій десь, як ця)' },
                    { image: 'fact3.PNG', text: 'Клоча не проміняє свій древній пластинчастий ніж ні на який інший - не важливо, у скільки разів він буде гостріший і привабливіший' },
                    { image: 'fact4.PNG', text: ' Клоча любить метафоризувати, пезимізувати (він сам це признає) і розгортатися на три томи, а потім плутатися у своїх же реченнях' },
                    { image: 'fact5.PNG', text: 'Клоча часто не встигав завершувати твори у школі за один куций урок, але вчителі великодушно дозволяли йому добивати їх на перервах. Часом..навіть цього не було достатньо' },
                    { image: 'fact6.PNG', text: 'У Клочі з ящірок є не тільки Темненька. Знайомтеся: Зелененька, Мухомор, Вулкан і Жабуха. Порівняно з Темненькою, вони - ящірки-слимачки' },
                    { image: 'fact7.PNG', text: 'Клоча часто змушений харчуватися власними перепаленими млинцями, бо тітка Їші якщо й готує щось, то воно..не зовсім їстівне' },
                    { image: 'fact8.PNG', text: 'Темні круги у Клочі під очима, здавалося б, свідчать про його трагічне минуле. Хоча насправді..це більше на майбутнє проєкція.' },
					{ image: 'fact9.PNG', text: 'Клоча - це сова (за біоритмом). Тобто, розбудити його о шостій ранку практично неможливо (щоправда, тітка Їші на все спроможна)' },
					{ image: 'fact10.PNG', text: 'Клоча вважає себе аромантичним (тобто, не схильним до кохання в тривіальному сенсі цього слова). В найближчий час це точно буде аксіомою.' },
					{ image: 'fact11.PNG', text: 'Довгий час у Клочі була мрія. Замість того, щоби плентатись за тіткою Їші в поході, як зазвичай - залізти у її рюкзак. І вмоститися там тишком-нишком, насолоджуючись тим, як та несе його й нічого не запідозрює' },
					{ image: 'fact12.PNG', text: 'Клочі завше було добре самому. Якби не тітка Їші, він узагалі жив би в підвалі місяцями' },
					{ image: 'fact13.PNG', text: 'День народження Клочі - 22 листопада 136 року п. е. На момент написання цих сторінок йому чотирнадцять (чи п\'ятнадцять?). Важкі підліткові часи, коли все валиться з ніг на голову..' },
					{ image: 'fact14.PNG', text: 'У Клочі таємна фобія проводків (особливо оголених). Не через електричний струм, а просто через діодні моральні принципи' },
					{ image: 'fact15.PNG', text: 'Хоч Клоча й має напівмеханічні руки, він ніколи не асоціював себе з роботом. Навпаки - він прагне сховатися від усього майбутнього в темній печері' },
					{ image: 'fact16.PNG', text: 'У Клочі в кімнаті є скелет створіння, схожого на людське (що викликає деякі питання). Дивно, але кісточок він боїться далеко не так, як проводків' },
					{ image: 'fact17.PNG', text: 'Клоча вважає, що народився світловим діодом через якусь дивну помилку. Він ніби занадто темний для того, щоб бути світлим' },
					{ image: 'fact18.PNG', text: 'Клоча ніколи не розумів тих, хто надто піклується про свою зовнішність. Навіщо витрачати сили на тіло, яке і так скоро зітліє?' },
					{ image: 'fact19.PNG', text: 'Клоча неймовірно вдячний тітці Їші за те, що вона не бере участі в його алхімічних експериментах. Тоді..у кіптяві був би цілий під\'їзд, а не тільки його підвал' }
            ],
            // Група 2 
            [
                { image: 'fact20.PNG', text: 'У тітко-Їшівських походах Клочу огортають самі сарказм і песимізм. *Це все через гостру ностальгію за домом* - він каже' },
					{ image: 'fact21.PNG', text: 'Їжачки пітьми - це найкращі компаньйони Клочі (після його картатого шарфика, звісно). Вони для нього настільки рідні, що він навіть не хоче розбиратися, звідки вони беруться' },
					{ image: 'fact22.PNG', text: 'Клочу часто пересмикує через різні дурнички (через слимачків, неприємні спогади чи деякі ентузіастичні природознавчі тітчині фрази)' },
					{ image: 'fact23.PNG', text: 'Батьки Клочі розвелися ще до його народження, і зосталося йому від них тільки чудернацьке ім\'я.' },
					{ image: 'fact24.PNG', text: 'Клоча не відв\'язується від свого картатого шарфика навіть улітку, бо занадто сильно до нього прив\'язався.' },
					{ image: 'fact25.PNG', text: 'Часом Клоча носить з собою ніж навіть там, де не нема особливо чого різати. На перший погляд..' },
					{ image: 'fact26.PNG', text: 'Клоча кілька разів намагався зрозуміти значення свого імені, але зрештою кинув цю справу і змирився з ним' },
					{ image: 'fact27.PNG', text: 'Клочу можна побачити з усмішкою тільки у трьох випадках: \n1) коли він дивиться на ящірку;\n2) коли він дивиться на тітку Їші, яка спить і втихомирилась після шаленого дня;\n3) коли йому вдаються його алхімічні експерименти' },
					{ image: 'fact28.PNG', text: 'У Темненької є бантик на голові, який вона сама собі сплела із засушеного слимакового слизу (тільки для Клочі про це не кажіть)' },
					{ image: 'fact29.PNG', text: 'Клоча радий, що на перерві у школі його ніхто не зачіпає: якраз є час, щоби позаписувати цікаві комбінації елементів. Часом він робить це навіть на уроках, бо ж ідею варто хапати за хвіст' },
					{ image: 'fact30.PNG', text: 'Те, що об\'єднує Клочу з тіткою Їші - це те, що вони обоє пливуть проти течії. Це важко, але це правильно.' },
					{ image: 'fact31.PNG', text: 'Клоча трохи короткозорий, попри те, що у нього продовгуваті зіниці, як в кота :)' },
					{ image: 'fact32.PNG', text: 'Клоча давно мріє про мас-спектометр (прилад, який здійснює іонізацію рідин), і в його підвалі є кілька спеціальних металевих поштових скриньок, де він збирає на нього монетки' },
					{ image: 'fact33.PNG', text: 'Металеві поштові скриньки у Клочі в підвалі працюють, як капсули часу. Кладеш у них срібну монетку чи дрібну записку - і забуваєш про це в наступну ж мить' },
					{ image: 'fact34.PNG', text: 'Клоча любить вилазити на невеличкий дашок свого підвалу і вдивлятися у межу між небом і Прірвою. Добре, що хоч тітка Їші його відволікає час від часу, інакше він потонув би у тій Межі, як у своїх міркуваннях' },
					{ image: 'fact35.PNG', text: 'Коли Клоча свердлить поглядом кухонне вікно - він у дев\'яти із десяти випадків свердлить поглядом свою міщанську ялицю' }
            ],
            // Група 3 
            [
                { image: 'fact36.PNG', text: 'Клоча ніколи не боявся висоти. Якщо вірити його історії, він навіть колись на верхівці своєї міщанської ялиці задрімав, коли маленький був' },
					{ image: 'fact37.PNG', text: 'Клоча вірить у те, що найцікавіші речі відбуваються або у верхівці багатоповерхівки, або у її ногах. Ось, чому він так любить підвали й горища' },
					{ image: 'fact38.PNG', text: 'Підвал Клочі дістався тітці Їші у спадок від брата, який був старший за неї на цілих тридцять п\'ять з половиною років, працював на килимковій фабриці, а ще (як і Клоча) неймовірно любив мешкати в підвалах. *Так ось, від кого ці гени взялися!*' },
					{ image: 'fact39.PNG', text: 'У Клочі в підвалі є буржуйка. Часом він її навіть запалює, але це так..скоріше не для тепла, а для душі' },
					{ image: 'fact40.PNG', text: 'У Клочі є слабкість не тільки до підвалів та горищ, а й до халабуд. Колись у шість років він приніс до квартири пилку (яка на той момент була довшою за нього в три рази), і вже мало не хотів пиляти нею стіни, щоби перетворити їхню квартиру в будиночок на дереві. На щастя, тітка Їші врятувала ситуацію (вона шалена, але ж не настільки!)' },
					{ image: 'fact41.PNG', text: 'Колись Клоча був набагато більш невгамовний і схожий на свою тітку, і зараз йому самому трішки від цього дивно' },
					{ image: 'fact42.PNG', text: 'Клоча шульга.' },
					{ image: 'fact43.PNG', text: 'Хоч в Клочі руки й металічні, але вони все одно чутливі. Напівчутливі метали діодних екзоскелетів' },
					{ image: 'fact44.PNG', text: 'Межу (Прірву) видно на горизонті із будь-якого куточка Світу діодів. Вона має галюцинаційні властивості, які ламають звичайні просторові закони' },
					{ image: 'fact45.PNG', text: 'На Клочу іноді (рідко, але непередбачувано) нападають різкі негативні імпульси. Навіть через повсякденні дрібнички.' },
					{ image: 'fact46.PNG', text: 'У тітки Їші на кухні висять сувої з нескінченними списками справ. Вона записує нові, не встигнувши виконати й половини старих :D' },
					{ image: 'fact47.PNG', text: 'Тітка Їші - чудова представниця роду ТД (теплових діодів). Струнка, висока (90-135см - середня висота ТД), але важка як камінець. У тілах ТД присутні кам*яні домішки, тому це абсолютно здорово!' },
					{ image: 'fact48.PNG', text: 'Якщо справа стосується диких ягід - тітку Їші не вгомонить жодна вища сила. Хоча збирати дикі ягоди біля Прірви - це, як мінімум, ризиково...' },
					{ image: 'fact49.PNG', text: 'Як каже Клоча...тітку Їші можна застати на місці тільки тоді, коли вона натхненно замовляє щось по інтернету, або сплячою. Шкода, що грошей у них не так уже й багато...' },
					{ image: 'fact50.PNG', text: 'Клоча часто задавався питанням: чому ті бродячі планетарії мадам Оллє так часто зупиняються саме біля його підвалу? Щоб відстежувати всі його дії, а потім..що? Чого їм треба?' },
					{ image: 'fact51.PNG', text: 'Клоча потерпає від дивної незрозумілої фобії облизувати ложки та горлечка пляшок. Хоча зубами торкатися до них він, начебто, не боїться.' },
					{ image: 'fact52.PNG', text: 'У ранньому дитинстві Клоча мав (невеличке) загострення імпульсивності та гіперактивності. Він навіть носив на голові спеціальний стабілізатор..добре, що тепер він йому не потрібний' },
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
        const savedState = JSON.parse(localStorage.getItem('treasureBoxState1') || '{}');
        
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
        
        localStorage.setItem('treasureBoxState1', JSON.stringify(state));
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
            this.boxImage.src = "../images2/skrunkaIdle.gif";
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
        this.boxImage.src = "../images2/skrunkaIdle.gif";
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
        'skrunkaHover',
        'skrunkaHover-Idle', 
        'skrunkaHoverReverse',
        'skrunkaIdle'
    ];
    
    // Створюємо масив для зберігання preloaded зображень
    this.preloadedImages = {};
    
    imageNames.forEach(imageName => {
        const img = new Image();
        img.src = `../images2/${imageName}.gif`;
        
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
    
    // Змінити зображення на skrunkaHover
    this.setBoxImage('skrunkaHover', 'Hover Box');
    this.currentHoverState = 'hover';
    
    // Встановити таймер на 1140ms для переходу в hover-idle
    this.hoverTimeout = setTimeout(() => {
        if (this.isHovering) {
            this.setBoxImage('skrunkaHover-Idle', 'Hover Idle Box');
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
    
    // Змінити зображення на skrunkaHoverReverse
    this.setBoxImage('skrunkaHoverReverse', 'Hover Reverse Box');
    this.currentHoverState = 'reverse';
    
    // Після короткої затримки повернути до idle стану
    setTimeout(() => {
        if (!this.isHovering) {
            this.setBoxImage('skrunkaIdle', 'Idle Box');
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
        this.boxImage.src = `../images2/${imageName}.gif`;
    }
    this.boxImage.alt = fallbackText;
}

    showUnlockBubble() {
        // Оновити повідомлення залежно від кількості розблокувань
        this.unlockCount++;
        
        if (this.unlockCount === 1) {
            this.unlockMessage.textContent = 'Скриньку розблоковано!';
        } else if (this.unlockCount === 2) {
            this.unlockMessage.textContent = 'Скриньку оновлено!';
        } else if (this.unlockCount === 3) {
            this.unlockMessage.textContent = 'Скриньку фінально оновлено!';
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
        this.factImage.src = `https://cdn.jsdelivr.net/npm/@surzik25/klocha-box-facts@latest/facts/${selectedFact.image}`;
        this.factImage.alt = `Fact ${randomIndex + 1}`;
        this.factText.textContent = selectedFact.text;
        
        // Встановити збільшене зображення (використовуємо те саме зображення)
        this.magnifiedImage.src = `https://cdn.jsdelivr.net/npm/@surzik25/klocha-box-facts@latest/facts/${selectedFact.image}`;
        this.magnifiedImage.alt = `Magnified Fact ${randomIndex + 1}`;
        
        // Невелика затримка перед показом нового факту
        setTimeout(() => {
            this.factBubble.classList.add('show');
            this.isFactBubbleVisible = true;
        }, 100);
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

    const offsetX = scaleX * 300;
    const offsetY = scaleY * 250;

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
            const imageUrl = `https://cdn.jsdelivr.net/npm/@surzik25/klocha-box-facts@latest/facts/${fact.image}`;
            
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
