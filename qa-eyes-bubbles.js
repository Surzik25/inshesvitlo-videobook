const items = document.querySelectorAll('.qa');
let hideTimer;

items.forEach((item, i) => {
  item.style.setProperty('--i', i); // порядковий номер для каскадної появи в мобільному Q&A
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

// Телефони: кнопка "Q&A" вгорі показує/ховає список (стилі .qa-open — у style-main.css)
const qaPanel = document.querySelector('.side-panel.right');
qaPanel.querySelector('.qa-item2').addEventListener('click', () => {
  qaPanel.classList.toggle('qa-open');
});

// Safari не прокручує панель з pointer-events: none, навіть коли курсор чи палець на пункті
// з pointer-events: auto — замість неї їде сторінка. Тому прокрутку над пунктами Q&A
// передаємо панелі вручну: колесо/тачпад і перетягування пальцем з інерцією.
// Відкритий мобільний список (.qa-open) має pointer-events: auto і скролиться сам.
let qaCarry = 0, qaLastY = null, qaLastT = 0, qaSpeed = 0, qaGlide = 0;
const qaAtEdge = dy => dy < 0
  ? qaPanel.scrollTop <= 0
  : qaPanel.scrollTop + qaPanel.clientHeight >= qaPanel.scrollHeight - 1;
const qaScroll = dy => { // Safari округлює scrollTop, тож дрібні зсуви тачпада накопичуємо
  qaCarry += dy;
  const step = Math.round(qaCarry);
  qaCarry -= step;
  qaPanel.scrollTop += step;
};

qaPanel.addEventListener('wheel', e => {
  if (qaPanel.classList.contains('qa-open')) return;
  const dy = e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? qaPanel.clientHeight : 1);
  if (qaAtEdge(dy)) return; // на краю списку віддаємо прокрутку сторінці
  e.preventDefault();
  qaScroll(dy);
}, { passive: false });

qaPanel.addEventListener('touchstart', e => {
  cancelAnimationFrame(qaGlide);
  qaLastY = e.touches[0].clientY;
  qaLastT = e.timeStamp;
  qaSpeed = 0;
}, { passive: true });

qaPanel.addEventListener('touchmove', e => {
  if (qaPanel.classList.contains('qa-open') || qaLastY === null) return;
  const y = e.touches[0].clientY, dy = qaLastY - y;
  if (qaAtEdge(dy)) return;
  e.preventDefault();
  qaScroll(dy);
  qaSpeed = dy / Math.max(e.timeStamp - qaLastT, 1); // px/мс — для інерції
  qaLastY = y;
  qaLastT = e.timeStamp;
}, { passive: false });

qaPanel.addEventListener('touchend', e => {
  if (qaLastY === null) return;
  qaLastY = null;
  if (e.timeStamp - qaLastT > 100) return; // палець зупинився перед тим, як відпустити
  const glide = () => {
    if (Math.abs(qaSpeed) < 0.05 || qaAtEdge(qaSpeed)) return;
    qaScroll(qaSpeed * 16);
    qaSpeed *= 0.95;
    qaGlide = requestAnimationFrame(glide);
  };
  qaGlide = requestAnimationFrame(glide);
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
  // Тексти бульбашок лежать у HTML (#bubble-messages), щоб їх бачив і індексував Google
  const bubbleMessages = {};
  document.querySelectorAll('#bubble-messages [data-bubble]').forEach(el => {
    bubbleMessages[el.dataset.bubble] = el.innerHTML.trim();
  });

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
		
