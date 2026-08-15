class InteractiveMap {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.svg = document.getElementById('mapSvg');
        this.placeholder = document.getElementById('placeholder');
        this.zoomInfo = document.getElementById('zoomInfo');
        
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.minScale = 0.3;
        this.maxScale = 5;
        
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        
        // Налаштування видимості елементів залежно від масштабу
         this.visibilityConfig = {
            // Будівлі
            'PSK-buildings-big': { minScale: 1.0, transition: 'opacity 0.3s ease' },
			'hata-vedu': { minScale: 1.0, transition: 'opacity 0.3s ease' },
			'school': { minScale: 0.9, transition: 'opacity 0.3s ease' },
            'PSK-buildings-small': { minScale: 1.7, transition: 'opacity 0.3s ease' },
            'LSK-buildings-big': { minScale: 2.0, transition: 'opacity 0.3s ease' },
            'LSK-buildings-small': { minScale: 2.3, transition: 'opacity 0.3s ease' },
            
            // Дерева
            'trees-big': { minScale: 1.1, transition: 'opacity 0.3s ease' },
            'trees-small': { minScale: 1.7, transition: 'opacity 0.3s ease' },
            'trees-extra-small': { minScale: 2.5, transition: 'opacity 0.3s ease' },
			'fields': { minScale: 0.9, transition: 'opacity 0.3s ease' },
			'paluba': { minScale: 1.1, transition: 'opacity 0.3s ease' },
            
            // Дороги
            'PSK-roads': { minScale: 0.7, transition: 'opacity 0.3s ease' },
            'LSK-roads': { minScale: 0.8, transition: 'opacity 0.3s ease' },
            'PSK-roads-small': { minScale: 1.0, transition: 'opacity 0.3s ease' },
            
            // Додаткові позначення
            'golku-big': { minScale: 0.8, transition: 'opacity 0.3s ease' },
            'golku-small': { minScale: 1.2, transition: 'opacity 0.3s ease' },
            'stones-big': { minScale: 0.9, transition: 'opacity 0.3s ease' },
            'stones-small': { minScale: 2.0, transition: 'opacity 0.3s ease' },
            'lore-chair': { minScale: 1.5, transition: 'opacity 0.3s ease' },
            'willow': { minScale: 0.9, transition: 'opacity 0.3s ease' },
            'gravestones': { minScale: 2.5, transition: 'opacity 0.3s ease' },
            'radioactive': { minScale: 0.8, transition: 'opacity 0.3s ease' },
            'skulls': { minScale: 1.2, transition: 'opacity 0.3s ease' },
			'markers-small': { minScale: 0.6, transition: 'opacity 0.3s ease' },
            'bones': { minScale: 1.0, transition: 'opacity 0.3s ease' },
			'metaphorosnics': { minScale: 0.7, transition: 'opacity 0.3s ease' },
			'reiku': { minScale: 0.4, transition: 'opacity 0.3s ease' },
			
			// Написи (з'являються при зменшенні, зникають після maxScale 0.6)
            'PSK-label': { maxScale: 0.6, transition: 'opacity 0.3s ease' },
            'LSK-label': { maxScale: 0.6, transition: 'opacity 0.3s ease' },
            'forest-label': { maxScale: 0.6, transition: 'opacity 0.3s ease' },
            'lake-label': { maxScale: 0.6, transition: 'opacity 0.3s ease' },
            'desert-label': { maxScale: 0.6, transition: 'opacity 0.3s ease' },
            'graveyard-label': { maxScale: 0.6, transition: 'opacity 0.3s ease' }
        };
        
        // Елементи, які повинні залишатися сталого розміру
        this.fixedSizeElements = [
            'paluba-mark',
			'halabuda-mark',
			'bus-stop-mark',
			'factory-mark',
			'bus-stop-end-mark',
			'school-mark',
			'pencil-shop-mark',
			'zatoka-mark',
			'bridge-mark',
			'klocha-tree-mark',
			'tech-shop-mark',
			'graveyard-mark',
			'orden-mark',
			'stones-mark',
			'radioactive-mark',
			'fate-mark',
			'veda-shop',
			'mail-mark',
			'library-mark',
			'mesnuk-mark',
			'river-mark',
			'timetrain-mark',
            'marker-klocha',
            'marker-perpere'
        ];
        
                // Інформація про маркери
        this.markerInfo = {
            'paluba-mark': 'Ділянка-палуба капітана Во. Все росте в симетрії, гармонії та економії 🌱🍇👒',
            'halabuda-mark': 'Ідеальне місце для халабуди. Його виявили Окі з Пер-пере під час своєї таємної вечірньої прогулянки 🤍🍃✨️',
            'bus-stop-mark': 'Клоча завжди чекає шкільного автобуса на цій зупинці ⏳',
            'factory-mark': 'Глобальне економічне підприємство *999 вантажівок* ⛽. Під землею пролягають поклади AGI (штучного загального інтелекту) 🤖',
            'bus-stop-end-mark': 'Кінцева зупинка містечка. В народі її називають зупинкою кінця світу ☠︎︎',
            'school-mark': 'Школа №1. Якби не добра тітка Веда, Пер-пере ходив би аж сюди..гризти граніти 👀',
            'pencil-shop-mark': 'Магазин *Олівець*. Виглядаає, як гігантський олівець, тому особливий ✐ᝰ',
            'zatoka-mark': 'Улюблена рибна затока тітки Їші. І рибна, і риболовна 🦈🛶 ',
            'bridge-mark': 'Міст. Переправа від села до містечка (і навпаки)╰┈➤ˎˊ˗',
            'klocha-tree-mark': 'Міщанська ялиця, на яку Клоча завше зиркає 👀🌲',
            'tech-shop-mark': 'Технічна крамничка. Пер-пере частенько бігає туди за запчастинками (бо їх багато не буває!) ⛯🔧',
            'graveyard-mark': 'Голки соул-зв*язки. Заіржавілі уламки спогадів про діодів, які перетнули точку неповернення.',
            'orden-mark': '"Вічної пам*яті ордену Путевід (*тим, що ведуть путь*), або Хранителям ладу". Цьому надгробкові вже більше ніж півтори століття 💀',
            'stones-mark': 'Хто зробив цих бовванів більшими за діодські будинки? 🗿',
            'radioactive-mark': 'Тут колись було королівство метафорозників (помилково виведених діодів з надзвичайно небезпечним випроміненням). Їхнє вимирання спричинило початок постери (п. е.) 𖥸',
            'fate-mark': 'Кам*яна лава. Резиденція Кардиналі (Долі). Тут розгортаються сувої та заплітаються життєві лінії діодів 𖡎',
            'veda-shop': 'Крамничка, у якій тітка Веда завше купує паперові серветки (та інші корисні штуки) 🧺🧼🥣',
			'mail-mark': 'Пошта, основне відділення. Існує тільки дві відправні точки: ПСК і ЛСК 📦',
			'library-mark': 'Бібліотека. Інтернет далеко не так пахне книжковим пилом, і не ховає ловця снів над своїми дверми. Алхімічні словнички Клочі всі звідтіля 🕮',
			'mesnuk-mark': 'Підземелля Месника. З пір настання постери ніхто про нього жодного разу не згадував. І не міг би згадати, навіть, якби хотів  💥',
			'river-mark': 'Води річки не роблять цю пустелю менш пустельною ☢️',
			'timetrain-mark': 'Тут не їздить ніхто, окрім Часопотяга. Здається, що його рейки пронизують всю планету діодів наскрізь 𖣘',
            'marker-klocha': '🏢Будинок 35 (квартири №№215-219). Тут мешкають Клоча та його тітка Їші 🪲☯',
            'marker-perpere': '🏡Хата, капітаном якої є тітка Веда. Казове гніздо. Місце, де притаковилися Пер-пере та Окі 🔎⚙️⁂'
        };
		
		// Додано інформацію про об'єкти для objects-info
        this.objectsInfo = {
            'planet': 'Пустельна частина планети діодів',
            'forest': 'Грибочки кличуть! (тітку Веду)',
            'lake': 'Чудова водойма, яка нарешті підійшла б Окі за розміром!',
            'islands': 'Острівці Кварт-варталі (або просто Кварти)',
            'orden': 'Цікаво було б спуститися по цьому надгробку додолу..або ні',
            'PSK': 'Містечко (вас вітає реклама та робототехніка!)',
            'LSK': 'Сільце (триста тринадцять природин на 1см²!)',
            'fields': 'Поля (тітко-Ведина втіха)',
            'hashchi': 'Хащі (зайдеш всередину - одразу заблукаєш)',
            'PSK-roads': 'Вжух, вжух..Скільки можна їздити!',
            'PSK-buildings-big': 'Тут ЖИВУТЬ, чи тільки щось купують?',
            'PSK-buildings-small': 'Й вікна, й двері, й стіни, й стелі',
            'school': 'Сила-силенна діодів-школярів стоптала цю місцину',
            'LSK-roads': 'Тракторні доріжки (тут можна добряче загрузнути)',
            'LSK-buildings-small': 'Сусідоньки добрі! (добре, що їх у тітки Веди небагато)',
            'LSK-buildings-big': 'Де цікавіше - в міських хатках чи тут?',
            'LSK-river': 'Пер-пере! Напишеш твір про цей струмочок, га?',
            'river': 'Річка (Окі туди чесно-чесно хоче!)',
            'trees-extra-small': 'Майже всіх їх недавно посадила тітка Веда',
            'trees-small': 'Зелені друзі (не металеві)',
            'trees-big': 'Вже доросли до того, щоб будувати на них будиночки',
            'PSK-roads-small': 'Хто хоче на велопрогулянку?',
            'reiku': 'Це рейки чи чиїсь бірюзові уявлення?',
            'stones-big': 'Ці штуки охороняють велику ущелину',
            'golku-big': 'Голки, які колись зв*язували чиюсь душу з тілом',
            'golku-small': 'Скільки чиїхось діодів-предків перетнули Межу?',
            'lore-chair': 'Таку масивну лаву до хати не занесеш...',
            'willow': 'Всохла Верба (сама Кардиналь дрімає на її гілках)',
            'skulls': 'Чиї це черепи? :О',
            'metaphorosnics': 'Символ метафорозників (закручений такий)',
            'gravestones': 'Обережно...ці надгробки часом співають (рок??)',
            'bones': 'У діодів є кістки? Чи тільки мікросхемки? :О',
			'PSK-wall': 'Міщани побудували це для захисту від протягів Прірви',
            'paluba': 'Не затоптуй розпушений капітанський ґрунт!',
			'hata-vedu': 'Якщо ви думали, що сільські хатки завжди малі...',
			'radioactive': 'Затримай дихання або забирайся!'
        }; 
        
        this.markerInfoDiv = document.getElementById('markerInfo');
        
        this.initEventListeners();
        this.initElementVisibility();
        this.initFixedSizeElements();
        this.initMarkerHover();
		this.initObjectsInfoHover(); // Додано ініціалізацію hover для objects-info
    }
	
	    // Додано новий метод для ініціалізації hover-ефектів objects-info
    initObjectsInfoHover() {
        // Отримуємо всі класи для яких потрібно показувати objects-info
        const objectClasses = Object.keys(this.objectsInfo);
        
        objectClasses.forEach(className => {
            const elements = this.svg.querySelectorAll(`.${className}`);
            
            elements.forEach(element => {
                // Додаємо transition для плавної зміни brightness
                element.style.transition = 'all 0.3s ease';
                
                // Показати objects-info та додати brightness при наведенні
                element.addEventListener('mouseenter', () => {
                    this.showObjectsInfo(className);
                    element.style.filter = 'saturate(123%)';
                });
                
                // Приховати objects-info та прибрати brightness при відведенні
                element.addEventListener('mouseleave', () => {
                    this.hideObjectsInfo();
                    element.style.filter = 'saturate(100%)';
                });
            });
        });
    }
    
    // Додано метод для показу objects-info
    showObjectsInfo(className) {
        const info = this.objectsInfo[className];
        if (info && this.objectsInfo) {
            const objectsInfoElement = document.querySelector('.objects-info');
            if (objectsInfoElement) {
                objectsInfoElement.textContent = info;
                objectsInfoElement.style.display = 'block';
            }
        }
    }
    
    // Додано метод для приховування objects-info
    hideObjectsInfo() {
        const objectsInfoElement = document.querySelector('.objects-info');
        if (objectsInfoElement) {
            objectsInfoElement.style.display = 'none';
        }
    }
    
    initMarkerHover() {
        // Ініціалізація hover-ефектів для маркерів
        Object.keys(this.markerInfo).forEach(className => {
            const elements = this.svg.querySelectorAll(`.${className}`);
            
            elements.forEach(element => {
                // Показати інформацію при наведенні
                element.addEventListener('mouseenter', (e) => {
                    this.showMarkerInfo(className, e);
                });
                
                // Приховати інформацію при відведенні
                element.addEventListener('mouseleave', () => {
                    this.hideMarkerInfo();
                });
                
                // Оновлювати позицію при русі миші
                element.addEventListener('mousemove', (e) => {
                    this.updateMarkerInfoPosition(e);
                });
            });
        });
    }
    
    showMarkerInfo(className, event) {
        const info = this.markerInfo[className];
        if (info && this.markerInfoDiv) {
            this.markerInfoDiv.textContent = info;
            this.markerInfoDiv.style.display = 'block';
            this.updateMarkerInfoPosition(event);
        }
    }
    
    hideMarkerInfo() {
        if (this.markerInfoDiv) {
            this.markerInfoDiv.style.display = 'none';
        }
    }
    
    updateMarkerInfoPosition(event) {
        if (this.markerInfoDiv && this.markerInfoDiv.style.display === 'block') {
            const rect = this.container.getBoundingClientRect();
            const x = event.clientX - rect.left + 15; // Зміщення на 15px вправо від курсора
            const y = event.clientY - rect.top - 10; // Зміщення на 10px вгору від курсора
            
            this.markerInfoDiv.style.left = x + 'px';
            this.markerInfoDiv.style.top = y + 'px';
        }
    } 
    
    initFixedSizeElements() {
        // Налаштування елементів сталого розміру
        this.fixedSizeElements.forEach(className => {
            const elements = this.svg.querySelectorAll(`.${className}`);
            elements.forEach(element => {
                element.style.transition = 'transform 0.3s ease';
                
                // Зберігаємо початкову позицію та розмір
                const bbox = element.getBBox();
                const centerX = bbox.x + bbox.width / 2;
                const centerY = bbox.y + bbox.height; 
                
                // Встановлюємо transform-origin відносно центру елемента
                element.style.transformOrigin = `${centerX}px ${centerY}px`;
                element.style.transform = `scale(${1 / this.scale})`;
            });
        });
    }
    
    updateFixedSizeElements() {
        // Оновлення розміру елементів сталого розміру
        this.fixedSizeElements.forEach(className => {
            const elements = this.svg.querySelectorAll(`.${className}`);
            elements.forEach(element => {
                // Використовуємо той же transform-origin, що був встановлений при ініціалізації
                element.style.transform = `scale(${1 / this.scale})`;
            });
        });
    }
    
        initElementVisibility() {
        // Налаштування початкових стилів для всіх елементів
        Object.keys(this.visibilityConfig).forEach(className => {
            const elements = this.svg.querySelectorAll(`.${className}`);
            const config = this.visibilityConfig[className];
            
            elements.forEach(element => {
                element.style.transition = config.transition;
                // Для елементів з maxScale - видимі коли масштаб менший або дорівнює maxScale
                // Для елементів з minScale - видимі коли масштаб більший або дорівнює minScale
                if (config.maxScale !== undefined) {
                    element.style.opacity = this.scale <= config.maxScale ? '1' : '0';
                } else {
                    element.style.opacity = this.scale >= config.minScale ? '1' : '0';
                }
            });
        });
    }
    
    updateElementVisibility() {
        Object.keys(this.visibilityConfig).forEach(className => {
            const elements = this.svg.querySelectorAll(`.${className}`);
            const config = this.visibilityConfig[className];
            
            elements.forEach(element => {
                let shouldBeVisible;
                
                // Для елементів з maxScale - видимі коли масштаб менший або дорівнює maxScale
                // Для елементів з minScale - видимі коли масштаб більший або дорівнює minScale
                if (config.maxScale !== undefined) {
                    shouldBeVisible = this.scale <= config.maxScale;
                } else {
                    shouldBeVisible = this.scale >= config.minScale;
                }
                
                element.style.opacity = shouldBeVisible ? '1' : '0';
                
                // Опціонально: можна додати pointer-events для кращої продуктивності
                element.style.pointerEvents = shouldBeVisible ? 'auto' : 'none';
            });
        });
    }
    
    initEventListeners() {
    // --- Миша ---
    this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.container.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.container.addEventListener('mouseleave', this.onMouseUp.bind(this));
    this.container.addEventListener('wheel', this.onWheel.bind(this));

    // --- Сенсор (тач) ---
    this.container.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
    this.container.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
    this.container.addEventListener('touchend', this.onTouchEnd.bind(this));

    // --- Кнопки керування ---
    document.getElementById('zoomIn').addEventListener('click', () => this.zoom(1.2));
    document.getElementById('zoomOut').addEventListener('click', () => this.zoom(0.8));
    document.getElementById('resetView').addEventListener('click', () => this.resetView());

    // Запобігання стандартному контекстному меню
    this.container.addEventListener('contextmenu', (e) => e.preventDefault());
}

// --- Touch-логіка ---
onTouchStart(e) {
    if (e.touches.length === 1) {
        // Переміщення одним пальцем
        this.isDragging = true;
        this.lastTouchX = e.touches[0].clientX;
        this.lastTouchY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
        // Початок pinch-to-zoom
        this.isDragging = false;
        this.lastPinchDistance = this.getPinchDistance(e.touches);
    }
}

onTouchMove(e) {
    e.preventDefault(); // Щоб сторінка не скролилась при жестах

    if (e.touches.length === 1 && this.isDragging) {
        // Переміщення
        const deltaX = e.touches[0].clientX - this.lastTouchX;
        const deltaY = e.touches[0].clientY - this.lastTouchY;
        this.translateX += deltaX;
        this.translateY += deltaY;
        this.lastTouchX = e.touches[0].clientX;
        this.lastTouchY = e.touches[0].clientY;
        this.updateTransform();
    } 
    else if (e.touches.length === 2) {
        // Масштабування pinch-to-zoom
        const newDistance = this.getPinchDistance(e.touches);
        if (this.lastPinchDistance) {
            const zoomFactor = newDistance / this.lastPinchDistance;
            const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale * zoomFactor));
            this.scale = newScale;
            this.updateTransform();
        }
        this.lastPinchDistance = newDistance;
    }
}

onTouchEnd(e) {
    if (e.touches.length === 0) {
        this.isDragging = false;
        this.lastPinchDistance = null;
    }
}

getPinchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}
    
    onMouseDown(e) {
        this.isDragging = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        this.container.style.cursor = 'url(../images2/cursorGrab/grabbing.webp) 15 15, none';
    }
    
    onMouseMove(e) {
        if (!this.isDragging) return;
        
        const deltaX = e.clientX - this.lastMouseX;
        const deltaY = e.clientY - this.lastMouseY;
        
        this.translateX += deltaX;
        this.translateY += deltaY;
        
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        
        this.updateTransform();
    }
    
    onMouseUp() {
        this.isDragging = false;
        this.container.style.cursor = 'url(../images2/cursorGrab/grab.webp) 20 20, grab';
    }
    
    onWheel(e) {
        e.preventDefault();
        
        const rect = this.container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale * zoomFactor));
        
        if (newScale !== this.scale) {
            const scaleDiff = newScale / this.scale;
            this.translateX = this.translateX * scaleDiff - mouseX * (scaleDiff - 1);
            this.translateY = this.translateY * scaleDiff - mouseY * (scaleDiff - 1);
            this.scale = newScale;
            this.updateTransform();
        }
    }
    
    zoom(factor) {
        const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale * factor));
        if (newScale !== this.scale) {
            this.scale = newScale;
            this.updateTransform();
        }
    }

    resetView() {
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.updateTransform();
    }
    
    updateTransform() {
        const transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
        this.svg.style.transform = transform;
        this.zoomInfo.textContent = `Масштаб: ${Math.round(this.scale * 100)}%`;
        
        // Оновлення видимості елементів
        this.updateElementVisibility();
        
        // Оновлення елементів сталого розміру
        this.updateFixedSizeElements();
    }
}

// Ініціалізація карти
const map = new InteractiveMap('mapContent');
