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
			'klocha-market-mark',
			'lizards-mark',
			'pink-diodette-mark',
			'waterfall-mark',
			'tombstone-forbidden-mark',
			'yardman-mark',
			'exoskeletons-mark',
			'end-circle-mark',
			'planetarium-mark',
			'willow-tali-mark',
			'golku-broken-mark',
            'marker-klocha',
            'marker-perpere'
        ];
        
                // Інформація про маркери
        this.markerInfo = {
            'paluba-mark': 'Captain Vo\'s Deck Area. Everything grows in symmetry, harmony, and economy 🌱🍇👒',
            'halabuda-mark': 'The perfect spot for a hideout. little Klocha would be absolutely delighted 🤍🍃✨️',
            'bus-stop-mark': 'Klocha always waits for the school bus at this stop ⏳',
            'factory-mark': 'Global economic enterprise *999 trucks* ⛽ Deposits of AGI (artificial general intelligence) lie underground 🤖',
            'bus-stop-end-mark': 'The final stop of the town. It is popularly called the stop at the end of the world ☠︎︎',
            'school-mark': 'School No. 1. Klocha goes there, and his own vacuum bubble saves him from boredom _-_🖋',
            'pencil-shop-mark': 'Pencil Shop. Looks like a giant pencil, therefore special ✐ᝰ',
            'zatoka-mark': 'Aunt Yishi\'s favorite fishing bay. Both fish and fishing 🦈🛶 ',
            'bridge-mark': 'Bridge. Crossing from village to town (and vice versa)╰┈➤ˎˊ˗',
            'klocha-tree-mark': 'Townsfolk fir tree, which Klocha always glances at 👀🌲',
            'tech-shop-mark': 'Hardware store. Per-pere often runs there for spare parts (because they just CAN\'T get enough!) ⛯🔧',
            'graveyard-mark': 'Soul-connection needles. Rusted memory fragments of diodes that have passed the point of no return.',
            'orden-mark': '"Eternal Memory. To the Order of Pathfaithers, or the Keepers of Order." This tombstone is more than a century and a half old. 💀',
            'stones-mark': 'A row of mystical stone statues. Ask their permission if you want to enter the Quiet Valley without any unpleasant adventures! 🗿',
            'radioactive-mark': 'Once upon a time there was a kingdom of metaphorizers (erroneously derived diodes with extremely dangerous radiation). Their extinction caused the beginning of Post-Era (P.E.)𖥸',
            'fate-mark': 'Stone Table. Residence of Cardinale (Fate). Here the scrolls are unrolled and the life lines of all the diodes are intertwined. 𖡎',
            'veda-shop': 'The shop where Aunt Veda always buys paper napkins (and other useful things) 🧺🧼🥣',
			'mail-mark': 'Post office, main branch. There are only two departure points: RSQ and LSQ 📦',
			'library-mark': 'Library. The Internet doesn\'t smell like book dust, and it doesn\'t hide a dream catcher over its doors. Klocha\'s Alchemical dictionaries is all from there 🕮',
			'mesnuk-mark': 'The Avenger\'s Underground. Since the Post-Era, no one has ever mentioned it. And they couldn\'t even if they wanted to. 💥',
			'river-mark': 'The waters of this river do not make this desert any less..deserty ☢️',
			'timetrain-mark': 'No one rides here except the Timetrain Itself. Its rails seem to run through the entire Diode World 𖣘',
			'klocha-market-mark': 'Grocery market. One of the advantages of living in the city is that all the groceries are right at your doorstep 🛒',
			'lizards-mark': 'A windy field behind the forest. Where all kinds of lizards breed, and where Klocha found Darky herself! 🦎',
			'pink-diodette-mark': 'The neat and very tiny house of Pink Diodette 🌸 One of Aunt Veda\'s few neighbors, who is really afraid of ghosts 👻',
			'waterfall-mark': 'The only island of Quart-vartalli, from which a whole waterfall flows. Around it are such picturesque landscapes that even the most citizeny citizen would be enchanted 🏞️',
			'tombstone-forbidden-mark': 'The place near which Aunt Veda once strictly forbade Per-pere and Oki from walking. All because of this strange tombstone 𓉸',
			'yardman-mark': 'Every summer, Yardman-Boletus\' truck stops here. He is an important guest at Aunt Veda\'s house 🪵🪓',
			'exoskeletons-mark': 'Exoskeletons Center. Anyone who wants to get their body updated (or doesn\'t want to, but just has to) comes here 🛠️',
			'end-circle-mark': 'A ring road that marks the beginning of the city. Speeding is common here, as the police don\'t reach it.',
			'planetarium-mark': 'Madame Olle\'s wandering planetariums. They move around all the time, but this is where Klocha saw them last time',
			'willow-tali-mark': 'The branches of the Withered Willow, on which Talismanka (Cardinale\'s younger sister) loves to swing 🪩',
			'golku-broken-mark': 'These needles have been looking a little strange lately. It\'s like someone\'s... chopping them off. Maybe it\'s just an illusion?',
            'marker-klocha': '🏢Building 35 (apts. ##215-219). Klocha and his aunt Yishi live here 🪲☯',
            'marker-perpere': '🏡House, captained by Aunt Veda. Kaz\'s nest. The place where Per-pere and Oki settled down 🔎⚙️⁂'
        };
		
		// Додано інформацію про об'єкти для objects-info
        this.objectsInfo = {
            'planet': 'The bare part of the Diode World',
'forest': 'The mushrooms are calling! (for Aunt Yishi)',
'lake': 'The permanent diode sea (splash into the mud)',
'islands': 'Small geo islands that hang over the Abyss',
'orden': 'Where does this tombstone grow from? From the Abyss itself??',
'PSK': 'The city (look out, there\'s a computer farm underground!)',
'LSK': 'The village (touch the grass!)',
'fields': 'Fields (preferably not to trample)',
'hashchi': 'Thickets that are impossible to get through',
'PSK-roads': 'Roads (city veins)',
'PSK-buildings-big': 'Buildings (mobile and not very)',
'PSK-buildings-small': 'These buildings are definitely mobile',
'school': 'It would be nice if this building went somewhere',
'LSK-roads': 'Dirt paths (no asphalt!)',
'LSK-buildings-small': 'There are even smaller huts (but they are not visible here)',
'LSK-buildings-big': 'Wanna go everywhere at once, huh?',
'LSK-river': 'Where are the stories about this stream, Per-pere?',
'river': 'River (Oki really wants to go there!)',
'trees-extra-small': 'Aunt Veda must have planted them recently',
'trees-small': 'Green friends (diodes + nature)',
'trees-big': 'They\'ve already grown...rooty, like those thermal diodes',
'PSK-roads-small': 'It\'s hard for massive cars to warm up here',
'reiku': 'Are these rails or a desert mirage?',
'stones-big': 'Strange things happen in the cemetery',
'golku-big': 'Rusty, but dangerously sharp',
'golku-small': 'It seems that if you touch them, they\'ll suck your soul inside',
'lore-chair': 'Here the fate of all our lifelines is decided',
'willow': 'Withered Willow (Cardinale\'s silent friend)',
'skulls': 'It\'s better not to stay here for long',
'metaphorosnics': 'The symbol of metaphorizers (a triangular electric plug)',
'gravestones': 'Hush...these tombstones sometimes make a howl',
'bones': 'Whose bones are these? :O',
'PSK-wall': 'The wall that protects the town from the Abyss',
'paluba': 'Enter the deck carefully!',
'hata-vedu': 'Why is the woodpile near Veda\'s house so high?',
'radioactive': 'Toxicity level: high. Put on a spacesuit!'
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
	this.container.addEventListener('selectstart', e => e.preventDefault());
}

// --- Touch-логіка ---
onTouchStart(e) {
    if (e.touches.length === 1) {
        this.isDragging = true;
        this.lastTouchX = e.touches[0].clientX;
        this.lastTouchY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
        this.isDragging = false;
        this.lastPinchDistance = this.getPinchDistance(e.touches);
        
        // Отримуємо межі контейнера, щоб рахувати координати відносно нього
        const rect = this.container.getBoundingClientRect();
        
        // Знаходимо центр між двома пальцями ВІДНОСНО КОНТЕНТУ КАРТИ
        const touchCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const touchCenterY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        
        // Центруємо координату відносно центру контейнера (аналогічно до логіки onWheel)
        this.pinchCenterX = touchCenterX - (rect.left + rect.width / 2);
        this.pinchCenterY = touchCenterY - (rect.top + rect.height / 2);

        // ХОВАЄМО ТАБЛИЧКУ: Користувач почав зумити двома пальцями
        this.hideMarkerInfo();
    }
}

onTouchMove(e) {
    if (e.cancelable) e.preventDefault(); 

    if (e.touches.length === 1 && this.isDragging) {
        const deltaX = e.touches[0].clientX - this.lastTouchX;
        const deltaY = e.touches[0].clientY - this.lastTouchY;
        
        // Перевіряємо, чи це реальний зсув, а не випадковий мікро-тиць
        if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
            // ХОВАЄМО ТАБЛИЧКУ: Карта почала рухатися від пальця
            this.hideMarkerInfo();
        }

        this.translateX += deltaX;
        this.translateY += deltaY;
        this.lastTouchX = e.touches[0].clientX;
        this.lastTouchY = e.touches[0].clientY;
        this.updateTransform();
    } 
    else if (e.touches.length === 2) {
        const newDistance = this.getPinchDistance(e.touches);

        if (this.lastPinchDistance && this.lastPinchDistance > 0) {
            const zoomFactor = newDistance / this.lastPinchDistance;
            const oldScale = this.scale;
            const newScale = Math.max(this.minScale, Math.min(this.maxScale, oldScale * zoomFactor));

            if (newScale !== oldScale) {
                const scaleDiff = newScale / oldScale;
                
                // Формула точного зсуву відносно точки між пальцями
                this.translateX = this.translateX * scaleDiff - this.pinchCenterX * (scaleDiff - 1);
                this.translateY = this.translateY * scaleDiff - this.pinchCenterY * (scaleDiff - 1);
                
                this.scale = newScale;
                this.updateTransform();
            }
        }

        this.lastPinchDistance = newDistance;
        
        // Динамічно оновлюємо центр між пальцями під час руху, 
        // щоб зум плавно слідував за руками
        const rect = this.container.getBoundingClientRect();
        const touchCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const touchCenterY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        this.pinchCenterX = touchCenterX - (rect.left + rect.width / 2);
        this.pinchCenterY = touchCenterY - (rect.top + rect.height / 2);
    }
}

onTouchEnd(e) {
    if (e.touches.length === 0) {
        this.isDragging = false;
        this.lastPinchDistance = null;
        this.pinchCenterX = null;
        this.pinchCenterY = null;
    } else if (e.touches.length === 1) {
        // Якщо один палець прибрали, а другий залишився — перемикаємося назад на drag
        this.isDragging = true;
        this.lastTouchX = e.touches[0].clientX;
        this.lastTouchY = e.touches[0].clientY;
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
        this.container.style.cursor = 'url(../../images2/cursorGrab/grabbing.webp) 15 15, none';
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
        this.container.style.cursor = 'url(../../images2/cursorGrab/grab.webp) 20 20, grab';
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
        this.zoomInfo.textContent = `Zoom: ${Math.round(this.scale * 100)}%`;
        
        // Оновлення видимості елементів
        this.updateElementVisibility();
        
        // Оновлення елементів сталого розміру
        this.updateFixedSizeElements();
    }
}

// Ініціалізація карти
const map = new InteractiveMap('mapContent');
