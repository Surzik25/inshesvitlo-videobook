class VideoNavigator {
constructor() {
this.currentVideo = 0;
this.totalVideos = 41; // 0-40 (21 + 20)

this.initElements();  
    this.bindEvents();  
   const savedIndex = parseInt(localStorage.getItem('currentVideoIndex'));  
    if (!isNaN(savedIndex) && savedIndex >= 0 && savedIndex < this.totalVideos) {  
        this.goToVideo(savedIndex);  
    } else {  
         this.goToVideo(0);  
    }  
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
    const overwriteVideos = [8, 9, 10, 40];
    
    if (overwriteVideos.includes(this.currentVideo)) {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line3-eng-overwrite@latest/overwrite/';
    } else if (this.currentVideo === 0) {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line3-chapter1@latest/chapter1/';
    } else if (this.currentVideo <= 10) {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line3-chapter1-pt1-eng@latest/chapter1-pt1/';
    } else if (this.currentVideo <= 20) {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line3-chapter1-pt2-eng@latest/chapter1-pt2/';
    } else if (this.currentVideo <= 30) {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line3-chapter2-pt1-eng@latest/chapter2-pt1/';
    } else {
        return 'https://cdn.jsdelivr.net/npm/@surzik25/line3-chapter2-pt2-eng@latest/chapter2-pt2/';
    }
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

    this.updateVideo();  
    this.updateInterface();  
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
        "It seems like someone is there. \n\nBy the way… have you ever chased a stray cat that lives in the ventilation under someone else’s apartment building entrance??",  
        "Is he… from the past? Every evening he lights candles and holds gatherings with abandoned souls?..\n\nBut anyway… alright. Your eyes get used to the darkness pretty quickly.",  
        "A lizard-dragon-gecko-cat. I want a creature like that for myself :D",  
        "Tell me honestly: do you like the smell of basements? Personally, I absolutely love it. I’d gladly chip off a piece of a cellar from somewhere and put it in my room instead of an aroma lamp. Who’s with me?",  
        "Somehow… that pink seat makes me uneasy. Something isn’t right about it…",  
        "Oh, it’s such a tiny little world! Are you sure dinosaurs and elephants would fit in there? Because humans definitely wouldn’t all be able to squeeze in.",  
        "Slice-slash-slit-gash-hustle-hustle-rush-dash :D Some good metaphors you have, y'know.",  
        "*Soot-sweeping machines*? Are you from the future or the past, Mr. Klocha? Or is this some kind of metaphor again (most likely).",  
        "Too much lore for a line that is declared as *a line without lore*. But..what can you do here? It's all the because of this author. He confuses us with his pondering (although, by the way, he didn't write it for us).",  
        "All the truths of life are at your fingertips. Especially about mosquitoes.",  
        "He was so intently thinking about the structure of his world that he accidentally scared away all the hedgehogs of darkness that had gathered under his feet. \nDon't worry - they'll hiss a little and crawl out.",  
        "Wow..is that how he imagines those semi-material soul-connection needles and threads? How does he know their appearance so well?\nYep. this Klocha reads too many ancient books.",  
        "He's about as dramatic with that knife as I am when I think about my future at 2:38 a.m.",  
        "What could be more atmospheric and romantic than a night city? \n\nThat's right: a night VILLAGE.",  
        "Was Klocha ever really this close to the Abyss, or is this picture just another imaginary fake in his head?\n Judging by his yellow dielectric glove, which he uses to grab onto the barbed wire... Quite realistic.",  
        "The Abyss is an eternal storm on the horizon, multiplied by itself nine times. \np.s. It was good for Klocha three years ago... not to bother his head with complicated seriousness. C'mon bro, you're only fourteen!",  
        "Diode factories and plants are the most compact factories and plants you've ever seen. Unless you've been on an Intergalactic Factory Tour, of course ;3",  
        "Sharpen the knife for technical purposes >:) And feed the experimental ants (with poisonous sugar).",  
        "Now we use the knife as a hatch opener.\n\nBy the way... if you suddenly meet a bat outside - send greetings through it to someone from Line 4. Because he loves bats very much.",  
        "Oh, the pink sign! Is that the same amorphous Madame Olle from the wandering planetarium who lives there? \n\nIt's better not to go to her.",  
        "Did you notice the teal smoke coming out of the lizard's mouth? It was the path of the soul of the butterfly she had just eaten. \np.s. even the smallest creature in the Diode World has its own path of the soul. All these paths lead to the Abyss. To one strict point.",  
        "Autumn, school, aunt's forest mushrooms... from two evil stones choose the smaller one. Pilling mushrooms is at least not passing exams. (Although it's still boring)",
        "Cowboy music, yi-i-i-ihaaa. And Aunty Yishi is a cowboy of the highest nobility level (because she not only washes the neighbors' windows, but also waters their houseplants). Both outside the buildings and inside. And the house puddles are no problem at all.",
        "In the room, Aunt Yishi climbs the Swedish walls. Outside the room - on the houses. And outside the houses - on the high mountains! \nBy the way, those mountains are not even visible on the map. Because they are hidden on the planet's other side. So.. keep this in mind and don't try to find them :D",
        "Or maybe she would be scared by those two from Line 4, wouldn't she? They don't live that far from them. \np.s. catty bears are cute.",
        "Congratulations, we are in for a horror thriller. With slugs in the lead role. (If anything, it could have been even worse).",
		"Still, diodes trust each other much more than we do. We would NOT snore so peacefully while some suspicious strangers are roaming around our apartment and throwing down the hallway rakes. \n\n(in this case it was Klocha, but..what if it wasn't him?)",
        "Actually, transparent bodies sound so beautiful and elegant! At first glance...it all depends on who is used to what.",
        "He should have thrown it in there anyway (put it on top and flattened it with the lid). Nothing will ruin this chum bucket anyways.\np.s. maybe he was afraid of that pincer. Who knows what pincers live in that Diode World. Mutant pincers that bite through semi-mechanical exoskeletons :d",
        "Yeah, that's why he's so flustered when his aunt hits him with a jet of water. \n\nAmong light diodes, water fans are very rare. Their bodies contain biological microcircuits, light veins, even living flame... It's understandable. But it's a pity. Because water is fun :p",
        "A constant injustice in life: if you don't need something, it creeps up on you. But as soon as you taste it! \nIt will run away from you like those darkness hedgehogs from sunlight.",
        "It's already the thirty-second of August... the penultimate day of summer...dang. Summer needs to be saved with some kind of time-retarder so that it doesn't fly by so inexorably.",
        "With those demographic problems, it's never clear what's true. \n\nAnd your jumping jacks are...really huge. No metaphors.",
        "Does anyone wonder why Aunt Yishi sleeps in the company of glass bottles with long necks and inscriptions \"9%\"? \nAlthough... maybe these are solutions for feeding bacteria. Or fungi. Or maybe it's just machine oil. And if it's even an alcohol tincture, then so what?",
        "\"Beware: a red bear.\" They drew anyone there, but definitely not a bear. \nNow it\'s clear why Aunt Yishi doesn't lock her door at night. She has traps from thieves that guard the entrance to her bedroom. Ingenious, huh? But the ant queen is provided with all the amenities: a red carpet, steps, and a passage.",
        "Since when did Aunt Yishi's bedroom look like a magician's den? \n\nIt was probably just Klocha's imagination getting the better of him because of that strange advertisement.",
        "The author of this diary's fantasy has once again gone wild...\n\n It seems he's having this from lack of sleep. Pieces of sleep simply make their way into reality and do their thing.",
        "\"None of your sarcasm\" - says the aunt. \n\n\"Zippy ember without sarcasm is not zippy ember\" - says zippy ember.",
		"Wherever you plant that aunt Yishi, she will grow. She will also grow a crowd of invertebrates or intestinal worms beside her (or whatever species those slugs belong to).",
        "It seems to me that all of Klocha's phobias have a similar form. Just think of that planetarium pink seat. The insidious irony of Fate...",
        "Nastiness surrounds us everywhere, and only we can choose which nastiness will become a part of ourselves. Who knows - maybe, compared to the true twists and turns of life, slugs will seem like childish gibberish to us.\nAnyways, any nastiness is not created for nothing."
    ];

    return footerTexts[this.currentVideo] || "";  
}  

getPageDate() {  
    const pageDates = [  
        "August 16th, year 150 (P.E.), 19:56",  
        "August 16th, year 150 (P.E.), 20:04",  
        "August 16th, year 150 (P.E.), 20:43",  
        "August 16th, year 150 (P.E.), 20:57",  
        "August 18th, year 150 (P.E.), 14:45",  
        "August 18th, year 150 (P.E.), 15:08",  
        "August 18th, year 150 (P.E.), 15:46",  
        "August 18th, year 150 (P.E.), 21:24",  
        "August 19th, year 150 (P.E.), 13:01",  
        "August 19th, year 150 (P.E.), 17:10",  
        "August 19th, year 150 (P.E.), 21:07",  
        "August 20th, year 150 (P.E.), 11:38",  
        "August 21st, year 150 (P.E.), 19:11",  
        "August 21st, year 150 (P.E.), 22:09",  
        "August 21st, year 150 (P.E.), 22:25",  
        "August 22nd, year 150 (P.E.), 13:03",  
        "August 22nd, year 150 (P.E.), 18:13",  
        "August 22nd, year 150 (P.E.), 19:30",  
        "August 22nd, year 150 (P.E.), 19:38",  
        "August 22nd, year 150 (P.E.), 19:49",  
        "August 22nd, year 150 (P.E.), 19:56",  
        "September 9th, year 150 (P.E.), 10:17",  
        "September 9th, year 150 (P.E.), 11:35",  
        "September 9th, year 150 (P.E.), 12:08",  
        "September 12th year 150 (P.E.), 14:27",  
        "September 13th, year 150 (P.E.), 15:58",  
        "August 32nd, year 150 (P.E.), 04:55",  
        "August 32nd, year 150 (P.E.), 05:08",  
        "August 32nd, year 150 (P.E.), 05:19",  
        "August 32nd, year 150 (P.E.), 05:28",  
        "August 32nd, year 150 (P.E.), 05:32",  
        "August 32nd, year 150 (P.E.), 05:44",  
        "August 32nd, year 150 (P.E.), 05:57",  
        "August 32nd, year 150 (P.E.), 06:03",  
        "August 32nd, year 150 (P.E.), 06:11",  
        "August 32nd, year 150 (P.E.), 06:13",  
        "August 32nd, year 150 (P.E.), 06:18",  
        "August 32nd, year 150 (P.E.), 06:22",  
        "August 32nd, year 150 (P.E.), 06:29",  
        "August 32nd, year 150 (P.E.), 07:07",  
        "August 32nd, year 150 (P.E.), 07:47"  
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
