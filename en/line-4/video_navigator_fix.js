class VideoNavigator {
constructor() {
this.currentVideo = 0;
this.totalVideos = 31; // 0-30 

// 🎵 Шлях до папки з музикою
this.musicBasePath = '../../music/';
this.currentTrack = null;
this.musicElement = new Audio();
this.musicElement.loop = true;
this.musicDelay = 800; // ⏱ затримка перед стартом треку (мс) 
this.musicTimeout = null;

// 🔇 Заглушення музики
this.imagesDir = '../../images/';
this.musicMuted = localStorage.getItem('musicMuted') === '1';

this.initElements();  
    this.bindEvents();  
   this.bindMusicButton();
   this.updateMusicBtnUI();
   const savedIndex = parseInt(localStorage.getItem('currentVideoIndex2'));  
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
        ? `url('${this.imagesDir}no-music-btn.png')`
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
	if (this.currentVideo <= 5) {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line4-chapter1-pt1-eng@latest/chapter1-pt1/';
    } else if (this.currentVideo <= 10) {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line4-chapter1-pt2-eng@latest/chapter1-pt2/';
    } else if (this.currentVideo <= 15) {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line4-chapter2-pt1-eng@latest/chapter2-pt1/';
    } else if (this.currentVideo <= 20) {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line4-chapter2-pt2-eng@latest/chapter2-pt2/';
    } else if (this.currentVideo <= 25) {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line4-chapter3-pt1-eng@latest/chapter3-pt1/';
    } else {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line4-chapter3-pt2-eng@latest/chapter3-pt2/';
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
        "Wanna hide in your own blanket tent with your phone in your hands? :D",  
        "That little green flying one—it's not Oki, right? Because he probably doesn’t know such long and complicated words.",  
        "“I wasn’t even going to argue,” says the diary. “I get enough adventures from you. The tea stains you’ve dripped onto my yellowed pages are plenty for me.”",  
        "Who here has ever started a diary but never kept it going? You kind of do have things to write down at the end of the day, but you’re already sleepy… and the next day, more stuff happens again…And that’s how you end up forgetting half your life :p",  
        "I don’t know what kind of nuts those are that you have, but they definitely don’t look like the ones we have. It’d be interesting to try them… If you guys still have any left :p\n\nP.S. They STILL have some, I know.",  
        "Professions for the win! 8D \n\nIt’s just that you’ll STILL have to go outside eventually. Sooner or later.",  
        "Wow. even the DIARY did not deserve his trust. What can we say about US humans here? \nEvery searcher has his own hacker holes. \n\nSurely, a searcher is like a hacker, only legal :]",  
        "Per-pere-super-hero is a cliché, in my opinion :D Although, it's better for him not to become a super-VILLAIN. \nEven for the sake of originality. \n\nBy the way, in our world it would be much easier to reconcile a diode and an AI. Surely, our AI still has room to develop :O",  
        "Imagine a crowd of one hundred and thirty-four tea fans, amicably and delicately sharing a single rare and scarce tealeaf. Who will win: tea or friendship? \nSpoiler: no one will survive.",  
        "Per-pere: \"I hate paying for virtual things\" \nSurzik25: *dreams of starting a Patreon*\nConclusion: there is no clear logic in the world.",  
        "Have you ever seen Per-pere without a hood?..\nThat's good. You're better off not knowing. Because you'll completely rethink him.\n\nAnd you'll also understand why light diodes come from flashlights.",  
        "Hey-hey! Where is the inscription \"Chapter 2\" or \"Line 4\"? Readers definitely need to be reminded ONCE AGAIN what exactly they are reading, because..they might forget by accident! Especially since Klocha HAS such a structure.",  
        "Confess: who among you is the fanciest? Get out your fancy meter - let's measure ourselves >:]",  
        "Yes, yes, you will meet these robots again. And pseudo-cats. And a miniature tea Timetrain. And the guy who was wandering around with a tea vacuum cleaner, collecting tea residues from Per-pere's tea cup. (If you manage to isolate these objects - I solemnly take my hat off to you)",  
        "Bruh, they scared me. \nBut it's just out of this harshness. I really like thunderstorms. And pear rolls. \np.s. but you don't have to make Captain Vo angry. This isn't a playground for you, Mr. Green Fatty.",   
        "Aren't you afraid that your arm will fall off from telling stories about Oki?\n\nBut I am afraid. Because my long-suffering animator's back will fall off.",  
        "The same situation when, confused, you come to some adult for writing advice, but in the end you don't even dare to ask anything because you see that the atmosphere around you is too busy and troublesome.",  
        "Oh boy...you don't get to see little hands like that every day. Or every night. \np.s. Captain Vo must have gone somewhere. Because they pulled back that curtain again.",  
        "Revealing our biggest secret :D In every sense.",  
        "We all depend on our LANGUAGE, yes-yes! And having a SECRET language means being safe from all the villains in the world. Virtual and real. Even if you realize that you have slipped up - only yours will understand ;)",  
        "If you ever happen to see both diodes at the same time, grab a pair of sunglasses. They glow so brightly the whole forest probably knows about it :D\np.s. Am I the only one who can spot the heads of some suspicious-looking creatures on their table? *-*",
        "Have you seen that edit? Whuff, whuff, WHUF - Captain Vo. That must have been done by master Per-pere. \n\nI wonder if he showed it to Captain Vo HIMSELF.\nIntriguing how she would react, eh?",
        "Have you seen microscopic teal cats climbing microscopic ladders on Oki's hand?... At least PRETEND that you do ;( \np.s. Aunt Veda does NOT actually have those proportions. It's just Per-pere playing with her photo using AI XD \np.s. I hope she never finds out.",
        "My biggest problem with Oki is that I can never capture him completely. He's so tall that I always have to sacrifice something т.т",
        "Oh, those adults with their respectable societies! They can be so strange sometimes... But Per-pere is a detective - he will examine all the artifacts under a magnifying glass! And for this, it is not even necessary to deal with the Internet. Oki himself is the entire Internet for him.",
		"And what do YOU ​​associate the word \"CANON\" with? Because Per-pere seems to see some strange pencils. \n\nBut seriously, it's always nice to know that those you often come into contact with taste exactly the way you're used to :)",
        "What do you think: from what angle does Oki see everything? Do the surrounding objects and diodes seem tiny to him or... on the contrary? \n\nAnd the green ghostling seems to really like using his leg as a twisting exerciser for himself.",
        "I'm telling you: protect all your information from this teal Oki-like creature. Because once he grabs it and tastes it, he won't leave a single piece.\n\n Maybe that's why his eyes have become so gigantic. From his wide erudition.",
        "Have you noticed that in the Diode World, they give great respect to NUTS? \n\nIs that one of their national symbols? XD",
        "Have you ever dreamed of meeting your past self and showing off how much you know? These guys would probably do it :D \n\nBut you have to admit that meeting your future self is much scarier.",
        "Diode expert was very afraid that Oki wouldn't even fit on the tech page, but since he is only three or five days old... he can still be dealt with. \np.s. shadows sometimes reveal those who are not visible to the naked eye... although Kaz is visible anyway :D"
    ];

    return footerTexts[this.currentVideo] || "";  
}  

getPageDate() {  
    const pageDates = [  
        "June 6th, 151 (P.E.), 12:58",  
        "June 6th, 151 (P.E.), 13:00",  
        "June 6th, 151 (P.E.), 13:02",  
        "June 6th, 151 (P.E.), 13:07",  
        "June 6th, 151 (P.E.), 13:13",  
        "June 6th, 151 (P.E.), 13:17",  
        "June 7th, 151 (P.E.), 11:05",  
        "June 7th, 151 (P.E.), 11:13",  
        "June 7th, 151 (P.E.), 11:21",  
        "June 8th, 151 (P.E.), 14:33",  
        "June 6th to 9th, 151 (P.E.), every 13 o'clock",  
        "June 15th, 151 (P.E.), 15:06",  
        "June 15th, 151 (P.E.), 15:09",  
        "June 15th, 151 (P.E.), 15:11",  
        "June 15th, 151 (P.E.), 15:13",  
        "June 16th, 151 (P.E.), 11:26",  
        "June 16th, 151 (P.E.), 11:32",  
        "June 16th, 151 (P.E.), 16:40",  
        "June 16th, 151 (P.E.), sometime :D",  
        "June 17th, 151 (P.E.), 12:40",  
        "no exact date here :d",  
        "July 33rd, 151 (P.E.), 9:14",  
        "August 1st, 151 (P.E.), 13:35",  
        "August 1st, 151 (P.E.), 13:41",  
		"August 1st, 151 (P.E.), 13:51", 
		"August 2nd, 151 (P.E.), 16:10",
		"August 2nd, 151 (P.E.), 16:25",
		"October 3rd to 4th, 145 (P.E.), 24/7",
		"October 5th, 145 (P.E.), 16:30",
		"October 5th, 145 (P.E.), 16:35",
		"once upon a time there in 151 (P.E.)",
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
