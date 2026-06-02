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
            'paluba-mark': 'Captain Vo\'s deck area. Captain Vo protects his grapes from slugs there 24/7 🌱🍇👒',
            'halabuda-mark': 'The perfect spot for a hideout. Discovered by Oki and Per-pere on their secret evening walk 🤍🍃✨️',
            'bus-stop-mark': 'School bus stop. Per-pere would also stand here if he went to a regular school! ⏳',
            'factory-mark': 'Global Economic Enterprise *999 trucks* ⛽. AGI deposits. Per-pere wants to seriously compete with them 🤖',
            'bus-stop-end-mark': 'The city\'s final stop. A place where life ends, although formally one could live there ☠︎︎',
            'school-mark': 'School No. 1. If it weren\'t for good Aunt Veda, Per-pere would have come all the way here...to gnaw on the granite of science 👀',
            'pencil-shop-mark': 'Pencil Shop. Per-pere\'s pure idea about how huge and stable a pencil can be ✐ᝰ',
            'zatoka-mark': 'Aunt Yishi\'s favorite fishing bay. If the fish doesn\'t bite, she becomes a fish herself 🦈🛶 ',
            'bridge-mark': 'Bridge. Crossing from town to village (and vice versa)╰┈➤ˎˊ˗',
            'klocha-tree-mark': 'Townsfolk fir tree. A single fir tree among a horde of buildings 👀🌲',
            'tech-shop-mark': 'Hardware store. If Oki had ever come there, they would have given him all the spare parts for free (out of fear, probably) ⛯🔧',
            'graveyard-mark': 'Rusted and long hopeless soul-connection needles. Like graves, only deeper and sharper.',
            'orden-mark': '"Eternal Memory. To the Order of Pathfaithers, or the Keepers of Order." The strangest tombstone of all times 💀',
            'stones-mark': 'Who made these statues bigger than diode houses? 🗿',
            'radioactive-mark': 'Once upon a time there was a kingdom of metaphorizers. If they were still alive, there wouldn\'t be a single ultimate diode left. 𖥸',
            'fate-mark': 'Stone Table. Residence of Cardinale. Fate\'s workplace, where she controls all the diodes\' lifelines, but no one can see it. 𖡎',
            'veda-shop': 'The shop where Aunt Veda always goes at eight in the morning to buy fresh..paper napkins! 🧺🧼🥣',
			'mail-mark': 'Post office, main branch. If you see a courier leaving from there, nine times out of ten he\'s going to Aunt Yishi 📦',
			'library-mark': 'Library. Per-pere thinks this building is a bit old-fashioned for their time, but sometimes even he agrees that it can be atmospheric there 🕮',
			'mesnuk-mark': 'Avenger\'s Underground. Who is the Avenger, no one will tell you now, but Per-pere knows that the author with that nickname releases very cool songs 💥',
			'river-mark': 'In this place, even the river water becomes the same color as this desert ☢️',
			'timetrain-mark': 'Timetrain rails. Real time veins of the Diode World itself 𖣘',
			'klocha-market-mark': 'Grocery market. In the city, at least they have a boatload of them 🛒',
			'lizards-mark': 'The lizard kingdom. There are hordes of them there, but you won\'t be able to catch a single one! 🦎',
			'pink-diodette-mark': 'Pink Diodette\'s house 🌸 So small and so pink that she could easily live among Oki\'s mechanisms',
			'waterfall-mark': 'A waterfall flowing from the very hanging island! Opposite it, Oki and Per-pere always walk 🏞️',
			'tombstone-forbidden-mark': 'A place for walking forbidden by Aunt Veda. Not only because of the high-voltage barbed wire, but also because of the tombstone, which may have hidden eyes 𓉸',
			'yardman-mark': 'Every July 19th, Yardman-boletus comes to this barn. Firewood harvesting is no joke 🪵🪓',
			'exoskeletons-mark': 'Exoskeletons Center. A center where diodes rebuild themselves to gain new features for their bodies 🛠️',
			'end-circle-mark': 'A ring road. It\'s quite strange, because it seemed like there were definitely no roads after the final bus stop',
			'planetarium-mark': 'Madame Olle\'s wandering planetariums. Sometimes they can be confused with the Cardboard Wizard\'s Lair 🎩🔮',
			'willow-tali-mark': 'The branches of the Withered Willow, When you hear them creak, it\'s definitely Talismanka - Cardinale\'s younger sister - eating blue hot dogs on them 🌭',
			'golku-broken-mark': 'If any of the diodes saw this, they would shudder: sometimes a hunched figure in sackcloth walks near these needles. Can this be truly true?',
            'marker-klocha': '🏢Building 35 (apts. ##215-219). Klocha and his aunt Yishi live here 🪲☯',
            'marker-perpere': '🏡House, captained by Aunt Veda. Kaz\'s nest. The place where Per-pere and Oki settled down 🔎⚙️⁂'
        };
		
		// Додано інформацію про об'єкти для objects-info
        this.objectsInfo = {
            'planet': 'The desert part of the Diode World',
			'forest': 'The mushrooms are calling! (for Aunt Veda)',
			'lake': 'A wonderful body of water, which would finally fit Oki in size!',
			'islands': 'Islands of Quart-vartalli (or simply Kvarts)',
			'orden': 'It would be interesting to go down this tombstone to the bottom...or not',
			'PSK': 'City (advertising and robotics welcome you!)',
			'LSK': 'A village (three hundred and thirteen natures per 1 cm²!)',
			'fields': 'Fields (Aunt Veda\'s comfort)',
			'hashchi': 'Thickets (you go inside - you immediately get lost)',
			'PSK-roads': 'Whush, whush..How far can you drive on these?',
			'PSK-buildings-big': 'Do they LIVE here, or do they just buy stuff?',
			'PSK-buildings-small': 'And windows, and doors, and walls, and ceilings',
            'school': 'A huge force of diodes-schoolchildren trampled this place',
			'LSK-roads': 'Tractor tracks (you can get really stuck here)',
			'LSK-buildings-small': 'Pretty neighbors! (it\'s pretty that Aunt Veda doesn\'t have many of them)',
			'LSK-buildings-big': 'Where is more interesting - in the city houses or here?',
			'LSK-river': 'Per-pere! You\'ll write an essay about this stream, huh?',
			'river': 'River (Oki honestly wants to go there!)',
			'trees-extra-small': 'Aunt Veda recently planted almost all of them',
			'trees-small': 'Green friends (not metal ones)',
			'trees-big': 'They\'re old enough to build treehouses on them',
			'PSK-roads-small': 'Who wants to go for a bike ride?',
			'reiku': 'Are these rails or someone\'s teal imagination?',
			'stones-big': 'These things guard a large gorge',
			'golku-big': 'Needles that once connected someone\'s soul to their body',
			'golku-small': 'How many of someone\'s diode ancestors have crossed the Boundary already...',
			'lore-chair': 'Such a massive table..can\'t bring it home, for real',
			'willow': 'Withered Willow (Cardinale herself is dozing on its branches)',
			'skulls': 'Whose skulls are these? :O',
			'metaphorosnics': 'The symbol of metaphorizers (twisted like that)',
			'gravestones': 'Careful...these tombstones sometimes sing (rock??)',
			'bones': 'Do diodes have bones? Or just microcircuits? :O',
			'PSK-wall': 'The townspeople built this to protect themselves from drafts of the Abyss',
			'paluba': 'Don\'t trample the loose Captain\'s soil!',
			'hata-vedu': 'If you thought village huts were always small...',
			'radioactive': 'Hold your breath or get out!'
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
        // Запам'ятовуємо центр між пальцями
        this.pinchCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        this.pinchCenterY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    }
}

onTouchMove(e) {
    e.preventDefault();

    if (e.touches.length === 1 && this.isDragging) {
        const deltaX = e.touches[0].clientX - this.lastTouchX;
        const deltaY = e.touches[0].clientY - this.lastTouchY;
        this.translateX += deltaX;
        this.translateY += deltaY;
        this.lastTouchX = e.touches[0].clientX;
        this.lastTouchY = e.touches[0].clientY;
        this.updateTransform();
    } 
    else if (e.touches.length === 2) {
        const newDistance = this.getPinchDistance(e.touches);

        if (this.lastPinchDistance) {
            const zoomFactor = newDistance / this.lastPinchDistance;
            const oldScale = this.scale;
            const newScale = Math.max(this.minScale, Math.min(this.maxScale, oldScale * zoomFactor));

            // Зсуваємо translateX/Y так, щоб точка під пальцями не зрушила
            this.translateX = this.pinchCenterX - (this.pinchCenterX - this.translateX) * (newScale / oldScale);
            this.translateY = this.pinchCenterY - (this.pinchCenterY - this.translateY) * (newScale / oldScale);

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
        this.pinchCenterX = null;
        this.pinchCenterY = null;
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
        this.container.style.cursor = 'url(../../images2/cursorGrab/grabbing.png) 15 15, none';
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
        this.container.style.cursor = 'url(../../images2/cursorGrab/grab.png) 20 20, grab';
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
