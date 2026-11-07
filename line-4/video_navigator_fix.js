class VideoNavigator {
constructor() {
this.currentVideo = 0;
this.totalVideos = 31; // 0-30 

// 🎵 Шлях до папки з музикою
this.musicBasePath = '../music/';
this.currentTrack = null;
this.musicElement = new Audio();
this.musicElement.loop = true;
this.musicDelay = 800; // ⏱ затримка перед стартом треку (мс) 
this.musicTimeout = null;

// 🔇 Заглушення музики
this.imagesDir = '../images/';
this.musicMuted = localStorage.getItem('musicMuted') === '1';

this.initElements();  
    this.bindEvents();  
   this.bindMusicButton();
   this.updateMusicBtnUI();
   // 🔗 Посилання ?page=N відкриває конкретну сторінку (має пріоритет над збереженою)
   const urlPage = new URLSearchParams(location.search).get('page');
   const savedIndex = parseInt(urlPage ?? localStorage.getItem('currentVideoIndex2'));  
    if (!isNaN(savedIndex) && savedIndex >= 0 && savedIndex < this.totalVideos) {  
        this.goToVideo(savedIndex);  
    } else {  
         this.goToVideo(0);  
    }  
} 

bindMusicButton() {
    if (!this.musicBtn) return;
    this.musicBtn.addEventListener('click', () => this.toggleMusic());
}

toggleMusic() {
    this.musicMuted = !this.musicMuted;
    localStorage.setItem('musicMuted', this.musicMuted ? '1' : '0');
    this.updateMusicBtnUI();

    if (this.musicMuted) {
        this.musicElement.pause();
    } else {
        // Відновлюємо відтворення поточного треку без очікування зміни сторінки
        if (this.musicElement.src) {
            this.musicElement.play().catch(() => {});
        } else {
            // Трек ще жодного разу не було встановлено — запускаємо примусово
            this.currentTrack = null;
            this.updateMusic();
        }
    }
}

updateMusicBtnUI() {
    if (!this.musicBtn) return;
    this.musicBtn.style.backgroundImage = this.musicMuted
        ? `url('${this.imagesDir}no-music-btn.webp')`
        : '';
}  

initElements() {  
    this.videoElement = document.getElementById('mainVideo');  
    this.firstBtn = document.getElementById('firstBtn');  
    this.prevBtn = document.getElementById('prevBtn');  
    this.nextBtn = document.getElementById('nextBtn');  
    this.lastBtn = document.getElementById('lastBtn');  
    this.videoTitle = document.getElementById('videoTitle'); // може бути null  
    this.currentVideoSpan = document.getElementById('currentVideo'); // може бути null  
    this.currentChapterSpan = document.getElementById('currentChapter'); // може бути null  
    this.pageDateSpan = document.getElementById('pageDate'); // може бути null  
    this.footerPS = document.getElementById('footerPS'); // може бути null  
    this.navButtons = document.querySelectorAll('.nav-button');
    
    // Breadcrumb кнопки
    this.bookStartBtn = document.getElementById('bookStart');
    this.chapterStartBtn = document.getElementById('chapterStart');
	
	// Кнопка глушення музики
    this.musicBtn = document.getElementById('musicBtn');
}  

bindEvents() {  
    // Кнопки навігації відео  
    this.firstBtn.addEventListener('click', () => this.goToVideo(0));  
    this.prevBtn.addEventListener('click', () => this.goToPrevious());  
    this.nextBtn.addEventListener('click', () => this.goToNext());  
    this.lastBtn.addEventListener('click', () => this.goToVideo(this.totalVideos - 1));  

    // Кнопки навігаційної панелі  
    this.navButtons.forEach(button => {  
        button.addEventListener('click', () => {  
            const videoIndex = parseInt(button.getAttribute('data-video'));  
            this.goToVideo(videoIndex);  
        });  
    });  

    // Breadcrumb кнопки
    if (this.bookStartBtn) {
        this.bookStartBtn.addEventListener('click', () => this.goToVideo(0));
    }
    
    if (this.chapterStartBtn) {
        this.chapterStartBtn.addEventListener('click', () => this.goToChapterStart());
    }

    // Клавіатурна навігація  
    document.addEventListener('keydown', (e) => {  
        switch(e.key) {  
            case 'ArrowLeft':  
                e.preventDefault();  
                this.goToPrevious();  
                break;  
            case 'ArrowRight':  
                e.preventDefault();  
                this.goToNext();  
                break;  
            case 'Home':  
                e.preventDefault();  
                this.goToVideo(0);  
                break;  
            case 'End':  
                e.preventDefault();  
                this.goToVideo(this.totalVideos - 1);  
                break;  
        }  
    }); 
	const videoEl = document.getElementById('mainVideo');

videoEl.addEventListener('click', (e) => {
    // Перевіряємо чи саме відео (або його контейнер) у fullscreen
    if (document.fullscreenElement === videoEl || document.fullscreenElement?.contains(videoEl)) {
        const videoWidth = videoEl.clientWidth;
        const clickX = e.clientX;

        if (clickX > videoWidth / 2) {
            // Права половина — вперед
            this.goToNext();
        } else {
            // Ліва половина — назад
            this.goToPrevious();
        }
    }
});	
}  

getCurrentChapter() {  
    if (this.currentVideo <= 10) {
        return 1;
    } else if (this.currentVideo <= 20) {
        return 2;
    } else {
        return 3;
    }
}  

getVideoPath() {  
    if (this.currentVideo === 3) {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line4-chapter1-page3@latest/chapter1/';
    } else if (this.currentVideo <= 5) {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line4-chapter1@latest/chapter1/';
    } else if (this.currentVideo <= 10) {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line4-chapter1-p2@latest/chapter1/';
    } else if (this.currentVideo <= 15) {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line4-chapter2@latest/chapter2/';
    } else if (this.currentVideo <= 20) {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line4-chapter2-p2@latest/chapter2/';
    } else if (this.currentVideo <= 25) {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line4-chapter3@latest/chapter3/';
    } else {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line4-chapter3-p2@latest/chapter3/';
    }
}

getMusicTrack() {
    const v = this.currentVideo;
    if (v === 0) return 'perpereSample0';
    if (v >= 1 && v <= 9) return 'perpereSample1';
    if (v === 10) return 'perpereSample1-5';
    if (v >= 11 && v <= 16) return 'perpereSample2';
    if (v >= 17 && v <= 20) return 'perpereSample3';
    if (v >= 21 && v <= 29) return 'perpereSample4';
	if (v === 30) return 'perpereSample4-5';
    return null;
}

updateMusic() {
    const track = this.getMusicTrack();
    if (!track) return;

    // Якщо трек не змінився — нічого не робимо, музика продовжує грати
    if (track === this.currentTrack) return;

    this.currentTrack = track;

    // Скасовуємо попередній відкладений запуск, якщо користувач швидко перемикає сторінки
    clearTimeout(this.musicTimeout);

    // Одразу зупиняємо поточну музику, щоб вона не грала під час паузи
    this.musicElement.pause();

    this.musicTimeout = setTimeout(() => {
        this.musicElement.src = `${this.musicBasePath}${track}.MP3`;
        this.musicElement.loop = true;
        this.musicElement.currentTime = 0;
		
		if (this.musicMuted) return; // заглушено — просто готуємо трек, не граємо

        const playPromise = this.musicElement.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Автоплей заблоковано браузером до першої взаємодії користувача —
                // запустимо музику при першому кліку/натисканні
                const resumeOnInteraction = () => {
                    this.musicElement.play().catch(() => {});
                    document.removeEventListener('click', resumeOnInteraction);
                    document.removeEventListener('keydown', resumeOnInteraction);
                };
                document.addEventListener('click', resumeOnInteraction, { once: true });
                document.addEventListener('keydown', resumeOnInteraction, { once: true });
            });
        }
    }, this.musicDelay);
}

goToChapterStart() {
    const currentChapter = this.getCurrentChapter();
    if (currentChapter === 1) {
        this.goToVideo(1); // Розділ 1 починається з першого відео
    } else if (currentChapter === 2) {
        this.goToVideo(11); // Розділ 2 починається з 11-го відео
    } else {
        this.goToVideo(21); // Розділ 3 починається з 21-го відео
    }
}

goToVideo(index) {
    // Виправлення синтаксичної помилки: додано || замість пропущеного оператора
    if (index < 0 || index >= this.totalVideos) return;

    this.currentVideo = index;  
    // 💾 Зберігаємо в localStorage  
    localStorage.setItem('currentVideoIndex2', index);
    // 🔗 Адреса завжди показує поточну сторінку, тож її можна скопіювати й поділитися
    const url = new URL(location.href);
    url.searchParams.set('page', index);
    history.replaceState(null, '', url);  

    this.updateVideo();  
    this.updateInterface();
	this.updateMusic(); 	
}  

goToNext() {  
    if (this.currentVideo < this.totalVideos - 1) {  
        this.goToVideo(this.currentVideo + 1);  
    }  
}  

goToPrevious() {  
    if (this.currentVideo > 0) {  
        this.goToVideo(this.currentVideo - 1);  
    }  
}  

updateVideo() {  
    const videoPath = this.getVideoPath(); 
  const freezeframe = document.getElementById('freezeOverlay');
  const videoFilter = document.getElementById('mainVideo');
    const videoSrc = `${videoPath}Per-pere-${this.currentVideo}.mp4`;  
    this.videoElement.src = videoSrc; 
  freezeframe.style.opacity = 0;  
  videoFilter.style.filter = 'none';
    this.videoElement.load(); // Перезавантажуємо відео 
    // Скидаємо кнопки infinite/freeze до початкового стану
    if (typeof window.resetVideoControls === 'function') {
        window.resetVideoControls();
    }  
}

getFooterText() {  
    const footerTexts = [  
        "Любите зачаїтися у своїй власній ковдровій палатці з телефоном у руках? :D",  
        "Той зелененький, летючий - це ж не Окі, правда? Бо він навряд чи знає такі довгі й закручені слова.",  
        "\"Та я й не хотів заперечувати\", - каже щоденник. \"Мені пригод не бракує від тебе. Мені достатньо чайних плям, які ти накропив на мої жовтяві сторінки.\"",  
        "Хто з вас коли починав писати щоденник, але ніколи його не продовжував? Тобі ніби і Є що записати в кінці дня, але вже спати хочеться..а наступного дня стаються ще якісь перипетії...\n\nОтак-то потім і забуваєш пів життя :p",  
        "Не знаю, що це у тебе за такі горішки, але вони точно не так виглядають, як у нас. Було б цікаво їх спробувати..\nЯкби щось залишилось :p \n\np.s. у них ЩЕ є, я знаю.",  
        "Професії хоч куди! 8D\n\nТільки-от надвір ВСЕ ОДНО тобі доведеться колись ходити. Рано чи пізно.",  
        "Отакої, навіть ЩОДЕННИК не заслужив його довіри. Що вже тут про нас казати? \nКожен пошуковець має свої хакерські нори. \n\nПевне, пошуковець - це як хакер, тільки легальний :]",  
        "Пер-пере-супергерой - це кліше, як на мене :D Хоча, суперЛИХОДІЄМ краще для нього не ставати. \nНавіть заради оригінальності. \n\nДо речі, у нашому світі помирити діода і ШІ було б набагато легше. Певне, нашому ШІ ще є куди розвиватись :О",  
        "Уявіть собі юрбу зі сто тридцяти чотирьох чайних фанатів, які дружно і тендітно розділяють між собою одну раритетну й дефіцитну чаїнку. Хто переможе: чай чи дружба? \nСпойлер: не виживе ніхто.",  
        "Пер-пере: \"Я ненавиджу платити за віртуальні штуки\" \nSurzik25: *мріє завести собі patreon*\nВисновок: у світі немає чіткої логіки.",  
        "Ви колись бачили Пер-пере без каптура?..\nОт і добре. Краще вам не знати. Бо ви повністю його переосмислите.\n\nА ще ви зрозумієте, чому світлові діоди походять від ліхтариків.",  
        "Гей-гей! А де напис \"Розділ 2\" чи \"Лінія 4\"? Читачам обов'язково треба ЩЕ РАЗ нагадати, що вони читають, бо..вони можуть забути ненароком! Тим паче, що Клоча МАЄ таку структуру. \nЗа структуру відповідає той, хто адаптовує щоденники цих діодів під книжку. Всі горіхи на автора :d",  
        "Признавайтеся: хто тут із вас найхвацькіший? Діставайте хвацькометр - будемо вимірюватись >:]",  
        "Так-так, ви ще зустрінете цих роботів знову. І псевдокотів. І мініатюрного чайного Часопотяга. І того типа, який швендяв з чайним пилососом, збираючи чайні залишки від Пер-перської чайної чашки. (якщо вам вдасться виокремити ці об'єкти - я урочисто стягну перед вами капелюха)",  
        "Йой, налякали. \nАле це просто від несподіванки. Я так-то люблю грозу. І грушеві рогалики. \np.s. але капітана Во сердити не треба. Це вам не іграшки, пане зелений товстунчику.",   
        "Ти вже не боїшся, що в тебе від розповідей про Окі рука відвалиться?\n\nЗате я боюсь. Бо в мене відвалиться моя багатостраждальна аніматорська спина.",  
        "Та сама ситуація, коли ти, збентежений, приходиш до якогось дорослого за письменницькою порадою, але зрештою не смієш навіть щось запитати, бо бачиш, що атмосфера навколо занадто робоча й клопітка.",  
        "Ой лишенькооо...такі рученята ви не кожен день побачите. І не кожну ніч. \np.s. Певне, капітан Во подався кудись. Оскільки вони знову ту шторку відсмикнули.",  
        "Розкриття нашого найбільшого секрету :D В усіх сенсах.",  
        "Нічогенько ми всі залежимо від нашої МОВИ, так-так! А мати ТАЄМНУ мову - це бути застрахованим від усіх лиходіїв на світі. Віртуальних і реальних. Навіть, якщо ти второпаєш, що проговорився - це зрозуміють тільки твої ;)",  
        "Якщо вам трапляються обоє діодів за раз - беріть сонцезахисні окуляри. Бо вони світяться так, що аж гай шумить (на іншому кінці села) :D\np.p.s. це тільки я бачу голови якихось підозрілих істот у них на столику? *-*",
        "Бачили той едіт? Вжух, вжух, ВЖУХ - капітан Во. Це, певне, Пер-пере зробив. \n\nЦікаво, чи показував він його для САМОГО капітана Во.\nІнтригуюче, як би вона відреагувала, еге ж?",
        "Бачили мікроскопічних бірюзових котів, які лазити по мікроскопічних драбинках в Окі на руці?... Хоча б ПРИКИНЬТЕСЬ, що так ;( \np.s. тітка Веда насправді НЕ МАЄ таких пропорцій. Це просто Пер-пере грається з її фото за допомогою ШІ XD \np.p.s. сподіваюсь, вона ніколи про це не дізнається.",
        "Найбільша моя біда щодо Окі полягає в тім, що ніколи я не можу захопити його всього. Він такий височенний, що постійно доводиться чимось жертвувати т.т",
        "Ох уже ті дорослі зі своїми пристойними товариствами! Такі часом дивні бувають...Але Пер-пере у нас детектив - всі артефакти під скельцем розгляне! І для цього необов'язково навіть з Інтернетом мати справу. Сам Окі - це вже для нього цілий інтернет.",
		"А з чим ВАМ асоціюється слово \"КАНОН\"? Бо для Пер-пере, схоже, ввижаються якісь дивні олівці. \n\nА якщо серйозно, то.. завжди приємно знати, що ті, з котрими ти часто контактуєш, смакують саме так, як ти звик :)",
        "Як ви думаєте: під яким кутом Окі бачить все? Навколишні предмети і діоди здаються йому крихітними чи..навпаки? \n\nА зелене привиденятко, схоже, дуже любить використовувати його ніжку як крутильний тренажер для себе.",
        "Кажу вам: захищайте від цієї бірюзової Окі-зної істоти всю свою інформацію..Бо як захопить і скуштує - ні шматочка не залишить.\n\n Може, від тої надивленості в нього й очиці такі гігантські стали.",
        "Ви вже встигли помітити, що у Світі діодів велику шану надають ГОРІХАМ? \n\nЦе що - один з їхніх національних символів? XD",
        "Ви колись мріяли зустрітися з собою минулим і похизуватися, скільки ви вже всього вмієте? Певне, ці хлопці так би й зробили :D \n\nАле погодьтеся, що зустрічатися з собою майбутнім набагато більш лячно.",
        "Художній експерт дуже боявся, щоби Окі хоч вліз у нього на технічну сторінку, але оскільки йому тут тільки три-п'ять деньочків..з ним ще можна дати раду. \n\np.s. тіні часом проявляють тих, кого не видно неозброєним оком..хоча Каза видно всяко :D"
    ];

    return footerTexts[this.currentVideo] || "";  
}  

getPageDate() {  
    const pageDates = [  
        "6 червня 151 рік п. е., 12:58",  
        "6 червня 151 рік п. е., 13:00",  
        "6 червня 151 рік п. е., 13:02",  
        "6 червня 151 рік п. е., 13:07",  
        "6 червня 151 рік п. е., 13:13",  
        "6 червня 151 рік п. е., 13:17",  
        "7 червня 151 рік п. е., 11:05",  
        "7 червня 151 рік п. е., 11:13",  
        "7 червня 151 рік п. е., 11:21",  
        "8 червня 151 рік п. е., 14:33",  
        "6-9 червня 151 рік п. е., 13-ті години",  
        "15 червня 151 рік п. е., 15:06",  
        "15 червня 151 рік п. е., 15:09",  
        "15 червня 151 рік п. е., 15:11",  
        "15 червня 151 рік п. е., 15:13",  
        "16 червня 151 рік п. е., 11:26",  
        "16 червня 151 рік п. е., 11:32",  
        "16 червня 151 рік п. е., 16:40",  
        "16 червня 151 рік п. е., колись :D",  
        "17 червня 151 рік п. е., 12:40",  
        "я не записав точної дати тут :d",  
        "33 липня 151 рік п. е., 9:14",  
        "1 серпня 151 рік п. е., 13:35",  
        "1 серпня 151 рік п. е., 13:41",  
		"1 серпня 151 рік п. е., 13:51", 
		"2 серпня 151 рік п. е., 16:10",
		"2 серпня 151 рік п. е., 16:25",
		"3-4 жовтня 145 рік п. е., 24/7",
		"5 жовтня 145 рік п. е., 16:30",
		"5 жовтня 145 рік п. е., 16:35",
		"колись там 151 року п. е.",
    ];  
      
    return pageDates[this.currentVideo] || "";  
}  

updateInterface() {    
      
    // Оновлюємо лічильник (починаємо з 0, а не з 1)  
    if (this.currentVideoSpan) {  
        this.currentVideoSpan.textContent = this.currentVideo;  
    }  

    // Оновлюємо номер розділу  
    if (this.currentChapterSpan) {  
        this.currentChapterSpan.textContent = this.getCurrentChapter();  
    }  

    // Оновлюємо дату сторінки  
    if (this.pageDateSpan) {  
        this.pageDateSpan.textContent = this.getPageDate();  
    }  

    // Оновлюємо текст футера  
    if (this.footerPS) {  
        this.footerPS.textContent = this.getFooterText();  
    }  

    // Оновлюємо стан кнопок навігації  
    this.firstBtn.disabled = this.currentVideo === 0;  
    this.prevBtn.disabled = this.currentVideo === 0;  
    this.nextBtn.disabled = this.currentVideo === this.totalVideos - 1;  
    this.lastBtn.disabled = this.currentVideo === this.totalVideos - 1;

    // Оновлюємо підсвічування кнопок
    this.updateButtonHighlight();

    // Оновлюємо активну кнопку навігаційної панелі  
    this.updateNavButtons();  
}  

updateButtonHighlight() {  
    // Підсвічуємо активні кнопки  
    const buttons = [this.firstBtn, this.prevBtn, this.nextBtn, this.lastBtn];  
    buttons.forEach(btn => {  
        btn.className = btn.disabled ? 'pattern-button' : 'pattern-button-lit';  
    });  
}  

updateNavButtons() {  
    // Основна функція - оновлення навігаційних кнопок  
    this.navButtons.forEach((button) => {  
        const videoIndex = parseInt(button.getAttribute('data-video'));  
          
        if (videoIndex === this.currentVideo) {  
            button.classList.add('active');  
        } else {  
            button.classList.remove('active');  // Виправлення синтаксичної помилки
        }  
    });  

    // 💾 Додаткове збереження стану навігаційних кнопок в localStorage (якщо потрібно)
    const activeButtons = Array.from(this.navButtons)
        .filter(btn => btn.classList.contains('active'))
        .map(btn => parseInt(btn.getAttribute('data-video')));
    
    localStorage.setItem('activeNavButtons2', JSON.stringify(activeButtons));
	
	// В кінці методу updateNavButtons() основного навігатора
if (window.navigationTreeAnimator) {
    window.navigationTreeAnimator.syncWithMainNavigator(this.currentVideo);
}
}

}

// Ініціалізуємо навігатор після завантаження сторінки
document.addEventListener('DOMContentLoaded', () => {
    new VideoNavigator();
});
