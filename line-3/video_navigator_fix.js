class VideoNavigator {
constructor() {
this.currentVideo = 0;
this.totalVideos = 41; // 0-40 (21 + 20)

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
   const savedIndex = parseInt(urlPage ?? localStorage.getItem('currentVideoIndex'));  
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
    return this.currentVideo <= 20 ? 1 : 2;  
}  

getVideoPath() {  
    if (this.currentVideo <= 10) {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line3-chapter1@latest/chapter1/';
    } else if (this.currentVideo <= 20) {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line3-chapter1-p2@latest/chapter1/';
    } else if (this.currentVideo <= 30) {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line3-chapter2@latest/chapter2/';
    } else {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line3-chapter2-p2@latest/chapter2/';
    }
}

getMusicTrack() {
    const v = this.currentVideo;
    if (v === 0) return 'klochaSample0';
    if (v >= 1 && v <= 12) return 'klochaSample1';
    if (v >= 13 && v <= 20) return 'klochaSample2';
    if (v >= 21 && v <= 24) return 'klochaSample3';
    if (v >= 25 && v <= 34) return 'klochaSample4';
    if (v >= 35 && v <= 39) return 'klochaSample4-5';
	if (v === 40) return 'klochaSample5';
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
        this.goToVideo(1); // Розділ 1 починається з першого відео (не з нульового)
    } else {
        this.goToVideo(21); // Розділ 2 починається з 21-го відео
    }
}

goToVideo(index) {
    // Виправлення синтаксичної помилки: додано || замість пропущеного оператора
    if (index < 0 || index >= this.totalVideos) return;

    this.currentVideo = index;  
    // 💾 Зберігаємо в localStorage  
    localStorage.setItem('currentVideoIndex', index);
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
    const videoSrc = `${videoPath}Klocha-${this.currentVideo}.mp4`;  
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
        "Там, здається, хтось є. \n\nДо речі...ви колись наздоганяли кота-волоцюгу, який живе у вентиляції під чужим під'їздом?",  
        "Він що - із минулого? Щовечора запалює свічки і влаштовує посиденьки з покинутими душами?..\n А втім..гаразд. \nОчі звикають до темряви доволі швидко.",  
        "Ящірка-дракон-гекон-кіт. Хочу собі таку тварюку :D",  
        "Скажіть чесно: ви любите запах підземелля? Особисто я від нього просто в захваті. Я б залюбки відбила звідкись шмат погреба і помістила його в себе в кімнаті замість аромалампи. Хто зі мною?",  
        "Якось мені..не по собі від цього рожевого крісла. Щось тут не чисто...",  
        "Ой, та це ж зовсім крихітний світик! Ти впевнений, що динозаври і слони помістилися б? Бо люди точно би туди всі не влізли.",  
        "Ріж-ніж-ріж-хутчіш :D Непогані у тебе метафори.",  
        "*Сажотруських установок*? Ви з майбутнього чи з минулого, пане Клочо? Чи це знову якась метафора (скоріше за все).",  
        "Забагато лору, як для лінії, котра заявлена як *лінія без лору*.  Але..що ж тут поробиш? Це все автор той. Заплутує нас своїми теревенями (хоча він, втім, і не для нас їх писав).",  
        "Вся життєва правда - як на долоні. Особливо про комарів.",  
        "Він так напружено думав про будову свого світу, що випадково розполохав усіх їжачків пітьми, які зібралися у нього під ногами. \nНічого страшного - покомизяться трохи і виповзуть.",  
        "Ого..це він собі так уявляє напівматеріальні голки та нитки соул-зв'язки? Звідки він настільки добре знає їхній вигляд?\nКажу вам: цей Клоча занадто багато читає древніх книжок.",  
        "Він із цим ножем осьдечки такий драматичний, як я, коли думаю про своє майбутнє о 2:38 ночі.",  
        "Що може бути атмосферніше і романтичніше за нічне місто? \n\nПравильно: нічне СЕЛО.",  
        "Клоча колись справді був так близько до Прірви, чи ця картинка - черговий уявний фейк у його голові?\n З погляду на його жовту діелектричну рукавичку, якою він вхопився за колючий дріт... Цілком реалістично.",  
        "Прірва в діодів - то є вічна гроза на горизонті, помножена сама на себе дев'ять разів. \np.s. добре було Клочі три роки тому..не морочив собі голову складними серйозностями. Камон, тобі тільки чотирнадцять!",  
        "Діодські фабрики й заводи - це найкомпактніші фабрики й заводи з усіх тих, які ви коли-небудь бачили. Якщо ви тільки не були на Міжгалактичній екскурсії фабрик і заводів, звісно ;3",  
        "Гостримо ножа для технічних цілей >:) І підгодовуємо піддослідних мурашок (отруйним цукром).",  
        "Тепер використовуємо ножа як відкривачку для люка.\n\nДо речі...якщо ви раптом також зустрінете надворі кажанчика - передавайте через нього привіт для декого з четвертої лінії. Бо він любить кажанчиків дуже сильно.",  
        "О, рожева вивіска! То це там живе та сама аморфна мадам Оллє із бродячого планетарію? \n\nКраще до неї не ходити.",  
        "Помітили бірюзовий дим у ящірки із рота? Це був шлях душі метелика, якого вона тільки що з'їла. \np.s. навіть найменше створіння у Світі діодів має свій шлях душі. Шляхи ці прокладаються до Прірви. Всі до єдиного.",  
        "Осінь, школа, лісові тітчині грибочки..із двох злих каменів вибирають меншого. Чистити гриби - це хоч не контрольні писати. (Хоча все одно нудно)",
        "Ковбойська музика, і-і-і-іхааа. А тітонька Їші у нас - ковбой найвищого рівня благородства (бо не тільки вікна миє сусідам, а ще й поливає їхні кімнатні рослини). Як ззовні будівель, так і всередині. А кімнатні калюжки - то все пусте.",
        "У кімнаті тітка Їші лазить по шведських стінках. Поза кімнатою - по будинках. А поза будинками - по горах високІЇХ! \nДо речі, гір тих навіть на карті не видко. Бо вони зачаїлися на іншому боці планети. Тож..майте собі це на увазі і не намагайтеся їх знайти :D",
        "А, може, її би налякали ті двоє з четвертої лінії, як ви думаєте? Вона біля них не так вже й далеко живе. \np.s. ведмедокоти милахи.",
        "Вітаю, нас чекає хорорний триллер. Зі слимаками у головній ролі. (Якщо що, могло бути й гірше).",
		"Все таки, діоди довіряють одне одному набагато більше, ніж ми. Ми б так спокійно не давали хропака, поки якісь підозрілі незнайомці шастають по нашій квартирі й штовхають дверима коридорні граблі. \n\n(в даному випадку це був Клоча, але..якщо б це був не він?)",
        "Взагалі-то, прозорі тіла - це звучить страх як прекрасно й елегантно! На перший погляд..все залежить від того, хто до чого звик.",
        "Треба було все одно викинути його туди (покласти зверху і кришкою приплюснюти). Це помийне відро нічого вже не зіпсує.\np.s. може, він боявся тієї щипавки. Хтозна, які у тих діодів щипавки мешкають. Щипавки-мутанти, які прокусують напівмеханічні екзоскелети :d",
        "Ага, так ось, чого він так брижиться, коли його тітка Їші водяним струменем торкне. \n\nСеред світлових діодів взагалі дуже рідко трапляються водяні фанати. Їхні тіла містять то біологічні мікросхемки, то світлові жилки, до живі язички полум'я..Воно й зрозуміло. Але шкода. Бо у воді весело :р",
        "Постійна життєва несправедливість: якщо тобі чогось не треба, воно до тебе само лізе. Але як тільки ти його розкуштуєш! \nВоно втече від тебе, наче їжачки пітьми від сонячного світла.",
        "Вже ціле тридцять друге серпня..передостанній день літа..а щоб його. У літо потрібно вцілити якимось часосповільнювачем, щоби не так невблаганно пролітало.",
        "З тими демографічними проблемами ніколи нічого не зрозуміло, що правда то правда. А коники-стрибунці у вас..дійсно велетенські. Без метафор.",
        "Нікого не дивує те, що тітка Їші спить в компанії скляних плящин з довгими горлечками та написами \"9%\"? \nХоча так..може, це розчини для годування бактерій. Чи грибів. Чи, може, це взагалі машинне мастило. А якщо це навіть спиртова настоянка, то що з того?",
        "\"Обережно: рудий ведмідь.\" Там намальований хто завгодно, але точно не ведмідь. \nТепер зрозуміло, чому тітка Їші не замикає наніч двері. У неї є пастки від злодюжок, які охороняють вхід до її спальні. Винахідливо, га? Зате мурашиній королеві надані всі зручності: і червона доріжка, і східці, і прохід.",
        "З яких це пір спальня тітки Їші стала схожою на лігво фокусника? \n\nЦе, певне, просто Клоча науявляв собі зайвого через ту дивну рекламу.",
        "Фантазія автора цього щоденника знову влаштувала гулянку...\n\n Схоже, це в нього від недосипання. Шматочки сну елементарно пробираються в реальність і роблять свою справу.",
        "\"Тіки давай-но без сарказму\", - каже тітка. \n\n\"Любчик без сарказму не любчик\", - каже любчик.",
		"Де не посій ту тітку Їші - то вона вродиться. Ще й вродить біля себе юрбу безхребетних чи кишковопорожнинних..(чи до якого там виду відносяться ті слимаки).",
        "Мені чогось здається, що всі фобії Клочі мають якусь схожу форму. Згадати тільки те його планетарне рожеве крісло. Підступна іронія Долі...",
        "Мерзота оточує нас всюди, і тільки ми можемо обирати, яка мерзота стане частинкою нас самих..Хтозна - може, проти істинних виворотів життя слимаки здаватимуться нам дитячим белькотом.\n\n Хай йому грець, світ такий суб\'єктивний!"
    ];

    return footerTexts[this.currentVideo] || "";  
}  

getPageDate() {  
    const pageDates = [  
        "16 серпня 150 рік п. е., 19:56",  
        "16 серпня 150 рік п. е., 20:04",  
        "16 серпня 150 рік п. е., 20:43",  
        "16 серпня 150 рік п. е., 20:57",  
        "18 серпня 150 рік п. е., 14:45",  
        "18 серпня 150 рік п. е., 15:08",  
        "18 серпня 150 рік п. е., 15:46",  
        "18 серпня 150 рік п. е., 21:24",  
        "19 серпня 150 рік п. е., 13:01",  
        "19 серпня 150 рік п. е., 17:10",  
        "19 серпня 150 рік п. е., 21:07",  
        "20 серпня 150 рік п. е., 11:38",  
        "21 серпня 150 рік п. е., 19:11",  
        "21 серпня 150 рік п. е., 22:09",  
        "21 серпня 150 рік п. е., 22:25",  
        "22 серпня 150 рік п. е., 13:03",  
        "22 серпня 150 рік п. е., 18:13",  
        "22 серпня 150 рік п. е., 19:30",  
        "22 серпня 150 рік п. е., 19:38",  
        "22 серпня 150 рік п. е., 19:49",  
        "22 серпня 150 рік п. е., 19:56",  
        "9 вересня 150 рік п. е., 10:17",  
        "9 вересня 150 рік п. е., 11:35",  
        "9 вересня 150 рік п. е., 12:08",  
        "12 вересня 150 рік п. е., 14:27",  
        "13 вересня 150 рік п. е., 15:58",  
        "32 серпня 150 рік п. е., 04:55",  
        "32 серпня 150 рік п. е., 05:08",  
        "32 серпня 150 рік п. е., 05:19",  
        "32 серпня 150 рік п. е., 05:28",  
        "32 серпня 150 рік п. е., 05:32",  
        "32 серпня 150 рік п. е., 05:44",  
        "32 серпня 150 рік п. е., 05:57",  
        "32 серпня 150 рік п. е., 06:03",  
        "32 серпня 150 рік п. е., 06:11",  
        "32 серпня 150 рік п. е., 06:13",  
        "32 серпня 150 рік п. е., 06:18",  
        "32 серпня 150 рік п. е., 06:22",  
        "32 серпня 150 рік п. е., 06:29",  
        "32 серпня 150 рік п. е., 07:07",  
        "32 серпня 150 рік п. е., 07:47"  
    ];  
      
    return pageDates[this.currentVideo] || "";  
}  

updateInterface() {  
    // Оновлюємо заголовок (якщо елемент існує)  
    if (this.videoTitle) {  
        this.videoTitle.textContent = `Klocha-${this.currentVideo}`;  // Виправлення синтаксису
    }  
      
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
    
    localStorage.setItem('activeNavButtons', JSON.stringify(activeButtons));
	
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

