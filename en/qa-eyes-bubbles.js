const items = document.querySelectorAll('.qa');
let hideTimer;

items.forEach(item => {
  const button = item.querySelector('.qa-item');
  const answer = item.querySelector('.answer'); // відповіді

  button.addEventListener('click', e => {
    e.stopPropagation(); // щоб клік не "спав" на document

    const isActive = item.classList.toggle('active');

    // Закриваємо всі інші
    items.forEach(i => {
      if (i !== item) i.classList.remove('active');
    });

    clearTimeout(hideTimer);

    if (isActive) {
      // Довжина відповіді без HTML
      let charCount = answer ? answer.textContent.trim().length : 0;
      
      // Розрахунок часу
      let displayTime = Math.min(Math.max(charCount * 60, 3000), 37000);
      // 60 мс на символ, мінімум 5 сек, максимум 20 сек

      hideTimer = setTimeout(() => {
        item.classList.remove('active');
      }, displayTime);
    }
  });
});

// При кліку поза .qa — ховаємо всі
document.addEventListener('click', e => {
  if (!e.target.closest('.qa')) {
    items.forEach(item => item.classList.remove('active'));
    clearTimeout(hideTimer);
  }
});
  
  // Eye-following cursor effect
    const eyes = document.querySelectorAll('.eye');
    const pupils = document.querySelectorAll('.pupil');

    document.addEventListener('mousemove', (e) => {
      eyes.forEach((eye) => {
        const eyeRect = eye.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;
        const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
        const distance = Math.min(eye.offsetWidth / 4, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 10);
        const pupilX = Math.cos(angle) * distance;
        const pupilY = Math.sin(angle) * distance;
        
        const pupil = eye.querySelector('.pupil');
        pupil.style.transform = `translate(-50%, -50%) translate(${pupilX}px, ${pupilY}px)`;
      });
    });
	//це для ховерів
	 document.querySelectorAll('.side-button').forEach(button => {
    const idleImg  = button.querySelector('.side-button-idle');
    const hoverImg = button.querySelector('.hover-img');
    let hoverTimer;

    button.addEventListener('mouseenter', () => {
      // приховуємо idle й відразу показуємо hover
      idleImg.style.opacity  = '0';
      // перезапускаємо GIF
      const originalSrc = hoverImg.src;
      hoverImg.src = '';
      hoverImg.src = originalSrc + '?' + Date.now();
      hoverImg.style.opacity = '1';

      // через 1 секунду — зворотній ефект
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        hoverImg.style.opacity = '0';  // ховаємо hover
        idleImg.style.opacity  = '1';  // показуємо idle
      }, 850);
    });

    button.addEventListener('mouseleave', () => {
      // якщо курсор пішов — миттєво повертаємо все назад
      clearTimeout(hoverTimer);
      hoverImg.style.opacity = '0';
      idleImg.style.opacity  = '1';
    });
  });
  
  //це ций мудрагель закодив
  const bubbleMessages = {
			0: '🎞️📔 A videobook is a type of media that combines text and animated strips, repeated or looped in an eternal flow. Designed for the combined perception of info and the freedom of the reader\'s imagination. ◡̈🌟',
            1: '💙💛 The real origin of this book is Ukraine :D But the site is now officially English adapted!',
            2: '❗For readers from 13 to ∞ ;) The book is sometimes uneven, and often built on metaphors; may touch on deep/ambiguous topics, including issues of Fate and life after death; there is increased detail, small text, and a large number of offtopics (jumping from topic to topic). For a younger audience, the content may be difficult to perceive or not entirely relatable❗',
            3: '🔦 This is just a switch to the dark/ultra-dark theme of the site. On a LIGHT theme, the glow of the diodes would not be visible, and we are definitely not going to put up with that :p',
            4: '✂ We are not YouTubers, but..:) <br><br><a href="https://www.youtube.com/@inshesvitlo" target="_blank" style="color: #470616; text-decoration: underline;">🎥 C\'mon, take a peek :D →</a>',
            5: '₍^. .^₎⟆ If you have that paper airplane thing, you can see us there too.<br><br><a href="https://t.me/inshesvitlo" target="_blank" style="color: #023973; text-decoration: underline;">💬 Our tg-channel →</a>',
            6: 'OUR DISCORD SERVER (a fun and cozy place you should definitely visit). It\'s where we build theories, post fanart, and just chat to our heart\'s content! <br><br><a href="https://discord.gg/xMSHbqytTK" target="_blank" style="color: #2efff8; text-decoration: underline;">👾 COME COME COME →</a>',
			7: '🖥️ Looks best on large monitors (HD 1080px, 16:9). Basically adapted to mobile devices, but may have noticeable delays there. Immediately pinch to your PC, grr! 📺',
			8: 'Just another backup social network (you can message there if you don\'t really feel like wandering through channels or suspicious servers) :] <br><br><a href="https://bsky.app/profile/surzik25.bsky.social" target="_blank" style="color: #210f96; text-decoration: underline;">˚🦋༘ Chase the butterfly →</a>',
			9: 'Our official international wiki project (all information written by the admin is verified!).<br> Wanna learn more about <b>Different Light</b>? <br><br><a href="https://different-light.fandom.com/wiki/Different_Light:_Ultimate_Diodes_and_Their_Life_Cycle" target="_blank" style="color: #0b2e01; text-decoration: underline;">📚 DIVE INTO THE ENCYCLOPEDIA! →</a>',
			10: 'WHO WANTS TO SUPPORT THE PROJECT IN A COOL AND PROFITABLE WAY?<br> And get a ton of exclusive content in return 😋<br><br><a href="https://www.patreon.com/Surzik25" target="_blank" style="color: #0b2e01; font-weight: bold; text-decoration: underline;"> This will help me more than you think 🥹 →</a>',
			11: 'AN EVEN MORE simple way to support (use it before it\'s too late!)<br><br><a href="https://ko-fi.com/surzik25" target="_blank" style="color: #024500; font-weight: bold; text-decoration: underline;">🥐 FEED HUNGRY KAZ →</a>'	
        };

        const buttons = document.querySelectorAll('.side-button');
        const speechBubble = document.getElementById('speech-bubble');
        const bubbleText = document.getElementById('bubble-text');
        let currentTimeout;

        buttons.forEach(button => {
    button.addEventListener('click', function() {
        const bubbleNumber = this.getAttribute('data-bubble');
        const message = bubbleMessages[bubbleNumber];
        
        if (currentTimeout) {
            clearTimeout(currentTimeout);
        }
        
        speechBubble.classList.remove('show');
        
        setTimeout(() => {
            bubbleText.innerHTML = message;
            speechBubble.className = `speech-bubble bubble-${bubbleNumber}`;
            
            const buttonRect = this.getBoundingClientRect();
            const bubbleTop = buttonRect.top + (buttonRect.height / 2) - 30;
            const bubbleLeft = buttonRect.right + 20;
            
            speechBubble.style.top = bubbleTop + 'px';
            speechBubble.style.left = bubbleLeft + 'px';
            
            speechBubble.classList.add('show');
            
            // Розрахунок часу показу:
            let charCount = message.replace(/<[^>]*>/g, '').length; // без HTML
            let displayTime = Math.min(Math.max(charCount * 60, 5000), 20000); 
            // 60 мс на символ, мінімум 5 сек, максимум 20 сек
            
            currentTimeout = setTimeout(() => {
                speechBubble.classList.remove('show');
            }, displayTime);
        }, 300);
    });
});


        // Ховаємо бульбашку при кліку поза нею
        document.addEventListener('click', function(e) {
            if (!e.target.classList.contains('side-button') && !e.target.closest('.speech-bubble')) {
                speechBubble.classList.remove('show');
                if (currentTimeout) {
                    clearTimeout(currentTimeout);
                }
            }
        });
		
