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
			0: '🎞️📔 Відеокнижка - це вид медіа, який поєднує в собі текст та анімаційні стрічки, повторювані або зациклені у вічному потоці. Розраховано на комбіноване сприйняття інформації та розвиток читацької уяви ◡̈🌟',
            1: '💙💛 Поки що книжка має тільки українську версію (оригінал). Колись (не скоро) ця тицялка буде перемикати вас на англійську адаптацію. Якщо ми не відкинемо ратиці, перекладаючи це :D',
            2: '❗Для читачів від 13 років до ∞ ;) Книжка має дещо уривчастий характер, і часто побудована на метафорах; можуть зачіпатися глибокі/неоднозначні теми, зокрема питання Долі та життя після смерті; присутня посилена деталізація, дрібний текст та велика кількість оффтопів (перескакування з теми на тему). Для молодшої аудиторії контент може бути складним для сприйняття або не зовсім relatable (знайомим за життєвим досвідом)❗',
            3: '🔦 Це просто перемикач на темну/ультратемну тему сайту. На СВІТЛІЙ темі не було б видно сяйва діодів, а з цим ми миритися точно не збираємось :p',
            4: '✂ Тут вже дещо є. <br><br><a href="https://www.youtube.com/@inshesvitlo" target="_blank" style="color: #470616; text-decoration: underline;">🎥 Можете глянути ;3 →</a>',
            5: '₍^. .^₎⟆ Тут підтримується зворотній зв\'язок. Розкажіть, що ви думаєте про цю штуку..нам цікаво буде :D<br><br><a href="https://t.me/inshesvitlo" target="_blank" style="color: #023973; text-decoration: underline;">💬 Наш tg-канал →</a>',
            6: 'Діскорд-сервер (кумедне та затишне місце, куди вам неодмінно треба потрапити). Там ми будуємо теорії, постимо фанарти і просто балакаємо від душі! <br><br><a href="https://discord.gg/xMSHbqytTK" target="_blank" style="color: #2efff8; text-decoration: underline;">👾 ПРИЄДНУЙСЯ ДО ВЕСЕЛОЩІВ →</a>',
			7: '🖥️ Найкраще виглядає на великих моніторах (HD 1080px, 16:9). Базово адаптовано до мобільних пристроїв, але може мати там відчутні затримки. Негайно чимчикуй до ПК, грр! 📺',
			8: 'Просто ще одна запасна соцмережа (можна написати туди, якщо не дуже кортить тинятися каналами чи підозрілими серверами) :] <br><br><a href="https://bsky.app/profile/surzik25.bsky.social" target="_blank" style="color: #210f96; text-decoration: underline;">˚🦋༘ Чкурнути за метеликом →</a>',
			9: 'Наш офіційний міжнародний вікі-проєкт (вся інформація, написана адміном, підтверджена).<br> Хочете дізнатися про <b>Інше світло</b> більше? <br><br><a href="https://different-light.fandom.com/wiki/Different_Light:_Ultimate_Diodes_and_Their_Life_Cycle" target="_blank" style="color: #0b2e01; text-decoration: underline;">📚 ШНУРКУЙТЕ ДО ЕНЦИКЛОПЕДІЇ! →</a>'
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
		
