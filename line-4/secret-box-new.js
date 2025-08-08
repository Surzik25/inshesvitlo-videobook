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
               { image: 'fact1.PNG', text: 'Для Пер-пере дуже важко дається писати щоденники, зате дуже легко дається перечитувати написані' },
                    { image: 'fact2.PNG', text: 'Кутики у щоденника Пер-пере завжди загортаються' },
                    { image: 'fact3.PNG', text: 'Пер-пере любить називати себе Пер-перцем, коли він відчуває себе особливо перченим' },
                    { image: 'fact4.PNG', text: 'Коли Пер-пере пише щось чорнилом (а не віртуально), на його обличчі якимось дивним чином з*являються таємні знаки. Він кілька разів намагався докумекати, як це працює, але чим більше він думав, тим незрозуміліше йому ставало.' },
                    { image: 'fact5.PNG', text: 'Пер-пере - це натуральний світловий діод. Грубо кажучи, це ліхтарик, який виріс, став пружним і начепив на себе каптур :D' },
                    { image: 'fact6.PNG', text: 'ШІ-помічник не завжди сидів у Пер-пере на пристрої. Колись він мешкав окремо :О' },
                    { image: 'fact7.PNG', text: 'Вся економіка Світу діодів тримається на AGI (на штучному загальному інтелекті). Поклади цього інтелекту (нейромережеві ферми) знаходяться під землею (там, де й більшість фабрик/заводів)' },
                    { image: 'fact8.PNG', text: 'Прибудова біля хати капітана Во, у якій живуть Окі з Пер-пере, зветься *Казове гніздо*. Це все на честь Каза - товстенького зелененького діодика-привиденятка, якому завше бракує місця у нормальних кімнатах (не таких великих).' },
					{ image: 'fact9.PNG', text: 'Кімната Пер-пере та Окі (Казове гніздо) завше доточується по вертикалі, наче бутерброд. Тому, що Окі завше доточується по вертикалі також.' },
					{ image: 'fact12.PNG', text: 'Одного разу Пер-пере та Окі вирішили відкрити магазин механічних дрібничок та милих витребеньок. Тільки вони, певна річ, не запускають покупців до себе всередину (щоб Окі нікого раптом не налякав :D)' },
					{ image: 'fact13.PNG', text: 'Всі створіння, які мають хоч якесь хутро, іноді линяють. Такі, як Окі - не виняток' },
					{ image: 'fact17.PNG', text: 'Пер-пере називає свій телефон *мобільним пристроєм*, бо йому це здається більш по-серйозному та по-професійному' },
					{ image: 'fact39.PNG', text: 'Скільки у Пер-пере насправді однакових каптурів?' },
					{ image: 'fact43.PNG', text: 'До Пер-пере час від часу заглядає в гості його чорний репетитор - кіт Аристократ. Тітка Веда призначила його, як заміну для звичайної школи (бо Пер-пере не хотів ні на крок відходити від Окі, а самого Окі, певна річ, не так просто було б помістити в якусь школу :D)' },
					{ image: 'fact44.PNG', text: 'Пер-пере святкує свій день народження тринадцятого грудня 138 року постери (п.е.). Може, через ЦЕ він такий одержимий числом *13*?' },
					{ image: 'fact47.PNG', text: 'Пер-пере НАДЗВИЧАЙНО боїться голосних та деренчливих звуків. Особливо - звірячої бензопили Дворовика-боровика. Кожного року 19 липня той привозить на подвір*я вантажівку колод і вмикає її на повну потужність. Нелегко вухам :d' },
					{ image: 'fact48.PNG', text: 'Колись Окі зробив для Пер-пере тіньову лампу, яка сканує його силовий перстень і тільки після цього розблоковується' },
					{ image: 'fact52.PNG', text: 'Найпоширеніші та найпопулярніші роботи в кімнаті Пер-пере та Окі - роботи-шпигуни. Інша їхня назва - *циліндричні жуки-кажанчики, які лякають всіх навколо*. Як не дивно, вони насправді ні лякають, ні шпигують. Зате виконують купу інших корисних функцій :D' }
            ],
            // Група 2 
            [
                { image: 'fact18.PNG', text: 'Колись у Казовому гнізді жив сірий котик під назвою Шад. Одного дня він подався у далекі мандри... На спомин про нього було зшито багато плюшевих іграшок' },
				{ image: 'fact22.PNG', text: 'Капітан Во на кухні часом настільки холосно чхає, що у Казовому гнізді вібрують стіни' },
					{ image: 'fact23.PNG', text: 'Підвищений голос капітана Во встановлений за замовчуванням смертельних страхів Окі й Пер-пере' },
					{ image: 'fact24.PNG', text: 'Гасло капітана Во: ЕКОНОМНІСТЬ - найкраща риса характеру діода' },
					{ image: 'fact25.PNG', text: 'Всі капелюшки тітки Веди дуже давні, але від цього не менш охайні та доглянуті. Виглядають, як новенькі!' },
					{ image: 'fact28.PNG', text: 'Пер-пере вважає корпорацію *999 вантажівок* їхнім з Окі запеклим конкурентом. Він навіть в онлайн-іграх із ними воює!' },
					{ image: 'fact29.PNG', text: 'Пер-пере довго мріє про одну гру-квест, але все ніяк не наважується сказати про це комусь' },
					{ image: 'fact31.PNG', text: 'Повне ім\'я Каза - Каз-він-же-Зак. Виявляється, він має властивість перевертатися догори дриґом, коли наляканий! І запилювати все навколо якимось дивним м\'ятним порошком' },
					{ image: 'fact32.PNG', text: 'У Пер-пере є цілих ДВА діограм-канали (які він активно розвиває)' },
					{ image: 'fact33.PNG', text: 'Казове гніздо має власний мікроклімат, який майже повністю залежить від налаштованості (настрою) Окі - великого бірюзового погодного фактора :3' },
					{ image: 'fact34.PNG', text: 'Зі своїх грушок тітка Веда готує найсмачніші грушеві рогалики у всьому селі!' },
					{ image: 'fact35.PNG', text: 'Найкращий друг тітки Веди - кисневий відбілювач' },
					{ image: 'fact36.PNG', text: 'Капітан Во воює на своїй ділянці зі справжнісінькими піратами. Один проти ТИСЯЧІ! Від кожного треба винаходити особливу зброю. І своїх не потруїти!' },
					{ image: 'fact37.PNG', text: 'У тітки Веди на горищі лежить дивна книжка. Коли Пер-пере хотів її почитати - отримав категоричну капітанську заборону. Для певності та книжка потім була навіть перехована в інше місце. Що б це могло означати?' },
					{ image: 'fact46.PNG', text: 'Каз на дотик точнісінько такий, як надута булька пиріжкового тіста, присипана тонким шаром борошна' },
					{ image: 'fact50.PNG', text: 'Тітка Веда у своєму домі не має з ким поговорити, крім Пер-пере. Тому, що ніхто з мешканців Казового гнізда, крім Пер-пере, не вміє спілкуватися звичайними словами' },
					{ image: 'fact51.PNG', text: 'Тітка Веда - теплова діодка (ТД) коренистої статури та господарчої вдачі. Ататомічна природа ТД подарувала її тілу спеціальну серцеву шухлядку, де вона може зберігати найсокровенніші для себе речі (зокрема спадок від своїх бабусь і прабабусь)' },
            ],
            // Група 3 
            [
                { image: 'fact10.PNG', text: 'Зір Окі працює, як картинка з безкінечним зум-inом. Вона збільшується до тих пір, поки у ній не можна буде втонути, як у Всесвіті всередині Всесвіту.' },
					{ image: 'fact11.PNG', text: 'Окі дуже часто уявляє себе набагато крихітнішим, ніж він є насправді' },
					{ image: 'fact14.PNG', text: 'Очі Окі часом (коли він захоче) виділяють в середовище спеціальні частинки, що розщеплюють поживні речовини. Тобто, він харчується не тільки інформацією, а й звичайною їжею :D' },
					{ image: 'fact15.PNG', text: 'Окі повсякчас вміє переміщатися непомітно й блискавично. Якби він виріс хоч трішки меншим - тітка Веда дозволила б йому ходити на нічні полювання' },
					{ image: 'fact16.PNG', text: 'Історія антенок.' },
					{ image: 'fact19.PNG', text: 'Напівпрозорий павутинний трьох-четвертний рукав Окі з\'явився на світ разом з самим Окі. Павучки завше турботливо доточують його і залатують' },
					{ image: 'fact20.PNG', text: 'Окі має напівпрозові подвійні повіки, які додатково захищають його велетенські очиці від зовнішніх подразників. І від зовнішніх будильників :D' },
					{ image: 'fact21.PNG', text: 'Окі має тільки ДВА стани.' },
					{ image: 'fact26.PNG', text: 'Пер-пере переконаний у тім, що Окі має в собі частину компʼютерного інтелекту. Бо часом він може навіть трішки зависати :0' },
					{ image: 'fact27.PNG', text: 'Пер-пере та Окі обмінюються думками. Буквально. А думки Окі не чує ніхто, крім Пер-пере' },
					{ image: 'fact30.PNG', text: 'Довгий час Окі з Пер-пере вважали, що Каз - це маленьке привиденятко. Бо вони знайшли його під час таємної прогулянки на кладовищі' },
					{ image: 'fact38.PNG', text: 'Окі з Пер-пере полюбляють збирати шматочки старих скелець. Вони вірять у те, що крізь світло, яке в них переломлюється, можна буде колись побачити шматочок іншого виміру. Під особливим кутом, звісно!' },
					{ image: 'fact40.PNG', text: 'Окі - це живе джерело струму! Він уміє виробляти електрику, достатню для заряджання всього чого завгодно. Правда, напруга там може бути зовсім не така стабільна, як у звичайних розетках :D' },
					{ image: 'fact41.PNG', text: 'Візерунки на руках Окі з часом все більше і більше починають нагадувати візерунки на кремнієвих пластинах. Ще трішки - і до його рук самі почнуть припаюватись мікросхемки' },
					{ image: 'fact42.PNG', text: 'Зазвичай до Окі підключений спеціальний механізм, який робить його очиці менш чутливими до зовнішніх подразників і захищає їх. Без цієї штуки навколишнє середовище стає для Окі дуже вразливим :(' },
					{ image: 'fact45.PNG', text: 'У Пер-пере з Окі є навіть постійні клієнти! Одна з них - крута руденька жіночка із вибуховою зачіскою. Їй постійно треба ремонтувати іригатор!' },
					{ image: 'fact49.PNG', text: 'Окі володіє неймовірною гнучкістю! Йому зручно перебувати годинами в таких закручених положеннях, від думки про які звичайні світлові діоди ВЖЕ переломали б собі всі мікросхемки (в уяві).' },
					
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
        const savedState = JSON.parse(localStorage.getItem('PerpereBoxState') || '{}');
        
        // Основний таймер
        this.timeLeft = savedState.timeLeft !== undefined ? savedState.timeLeft : 120;
        this.isLocked = savedState.isLocked !== undefined ? savedState.isLocked : true;
        
        // Групова система
        this.currentGroupIndex = savedState.currentGroupIndex || 0;
        this.groupTimeLeft = savedState.groupTimeLeft !== undefined ? savedState.groupTimeLeft : 100;
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
        
        localStorage.setItem('PerpereBoxState', JSON.stringify(state));
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
            this.boxImage.src = "../images2/teapotIdle.gif";
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
                this.groupTimeLeft = 100; // Скинути час для нової групи
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
        this.boxImage.src = "../images2/teapotIdle.gif";
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
        this.groupTimeLeft = 100; // Встановити час для першої групи
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

        // Обробники для збільшувального скла
        this.factImage.addEventListener('mouseenter', () => {
            this.magnifyingGlass.classList.add('active');
        });

        this.factImage.addEventListener('mouseleave', () => {
            this.magnifyingGlass.classList.remove('active');
        });

        this.factImage.addEventListener('mousemove', (e) => {
            this.updateMagnifyingGlass(e);
        });
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
        'teapotHover',
        'teapotHoverIdle', 
        'teapotHoverReverse',
        'teapotIdle'
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
    
    // Змінити зображення на teapotHover
    this.setBoxImage('teapotHover', 'Hover Box');
    this.currentHoverState = 'hover';
    
    // Встановити таймер на 1140ms для переходу в hover-idle
    this.hoverTimeout = setTimeout(() => {
        if (this.isHovering) {
            this.setBoxImage('teapotHoverIdle', 'Hover Idle Box');
            this.currentHoverState = 'hover-idle';
        }
    }, 950);
}

handleUnlockedLeave() {
    this.isHovering = false;
    
    // Очистити таймер
    if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = null;
    }
    
    // Змінити зображення на teapotHoverReverse
    this.setBoxImage('teapotHoverReverse', 'Hover Reverse Box');
    this.currentHoverState = 'reverse';
    
    // Після короткої затримки повернути до idle стану
    setTimeout(() => {
        if (!this.isHovering) {
            this.setBoxImage('teapotIdle', 'Idle Box');
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
            this.unlockMessage.textContent = 'Чайник розблоковано!';
        } else if (this.unlockCount === 2) {
            this.unlockMessage.textContent = 'Чайник оновлено!';
        } else if (this.unlockCount === 3) {
            this.unlockMessage.textContent = 'Чайник фінально оновлено!';
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
        this.factImage.src = `https://cdn.jsdelivr.net/npm/@surzik25/perpere-teapot-facts@1.0.0/facts/${selectedFact.image}`;
        this.factImage.alt = `Fact ${randomIndex + 1}`;
        this.factText.textContent = selectedFact.text;
        
        // Встановити збільшене зображення (використовуємо те саме зображення)
        this.magnifiedImage.src = `https://cdn.jsdelivr.net/npm/@surzik25/perpere-teapot-facts@1.0.0/facts/${selectedFact.image}`;
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
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Позиціонування збільшувального скла
        this.magnifyingGlass.style.left = `${x - 50}px`;
        this.magnifyingGlass.style.top = `${y - 50}px`;

        // Обмеження руху скла в межах зображення
        const glassSize = 100;
        const maxX = this.factImage.offsetWidth - glassSize;
        const maxY = this.factImage.offsetHeight - glassSize;

        if (x < 50) this.magnifyingGlass.style.left = '0px';
        if (x > maxX + 50) this.magnifyingGlass.style.left = `${maxX}px`;
        if (y < 50) this.magnifyingGlass.style.top = '0px';
        if (y > maxY + 50) this.magnifyingGlass.style.top = `${maxY}px`;

        // Позиціонування збільшеного зображення (покращена логіка)
        const scaleX = (x / this.factImage.offsetWidth);
        const scaleY = (y / this.factImage.offsetHeight);
        
        // Зміщення зображення всередині скла для створення ефекту збільшення
        const offsetX = scaleX * 300; // 300px - розмір збільшеного зображення
        const offsetY = scaleY * 250; // 250px - висота збільшеного зображення
        
        this.magnifiedImage.style.left = `-${offsetX - 50}px`; // 50px - половина розміру скла
        this.magnifiedImage.style.top = `-${offsetY - 50}px`;
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
            const imageUrl = `https://cdn.jsdelivr.net/npm/@surzik25/perpere-teapot-facts@1.0.0/facts/${fact.image}`;
            
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