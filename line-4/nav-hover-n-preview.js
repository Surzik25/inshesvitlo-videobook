document.addEventListener('DOMContentLoaded', function() {
    // Отримуємо всі приховані зображення по класах
    const hiddenImages = document.querySelectorAll('.nav-branches-hidden, .nav-branches2-hidden, .nav-branches3-hidden');
    const buttons = document.querySelectorAll('.nav-button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            // Отримуємо позицію кнопки
            const buttonRect = button.getBoundingClientRect();
            
            // Застосовуємо ефект до всіх прихованих зображень
            hiddenImages.forEach(hiddenImage => {
                const imageRect = hiddenImage.getBoundingClientRect();
                const centerX = buttonRect.left - imageRect.left + buttonRect.width / 2;
                const centerY = buttonRect.top - imageRect.top + buttonRect.height / 2;
                
                // Створюємо радіальний градієнт з плавним переходом
                const maskValue = `radial-gradient(circle at ${centerX}px ${centerY}px, 
                    black 0px, 
                    black 30px, 
                    rgba(0,0,0,0.7) 60px,
                    rgba(0,0,0,0.3) 70px,
                    transparent 95px)`;
                
                // Застосовуємо маску і показуємо зображення
                hiddenImage.style.mask = maskValue;
                hiddenImage.style.webkitMask = maskValue;
                hiddenImage.classList.add('show');
            });
        });
        
        button.addEventListener('mouseleave', function() {
            // Ховаємо всі зображення
            hiddenImages.forEach(hiddenImage => {
                hiddenImage.classList.remove('show');
            });
        });
    });
});
 // Створюємо кнопки навігації
        const navPanel = document.getElementById('navPanel');
        const previewBubble = document.getElementById('previewBubble');
        const previewImage = document.getElementById('previewImage');
        const previewText = document.getElementById('previewText');

       

        // Обробка наведення миші
        const buttons = document.querySelectorAll('.nav-button');
        let hoverTimeout;

        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                clearTimeout(hoverTimeout);
                
                const pageNumber = e.target.getAttribute('data-video');
                const buttonRect = e.target.getBoundingClientRect();
                
                // Оновлюємо контент попереднього перегляду
                previewImage.src = `../images2/perpere-thumbs/page${pageNumber}.png`;
                previewText.textContent = `сторінка ${pageNumber}`;
                
                // Позиціонуємо бульбашку справа від кнопки з відступом 30px
                previewBubble.style.left = `${buttonRect.right + 30}px`;
                previewBubble.style.top = `${buttonRect.top + buttonRect.height/2 - previewBubble.offsetHeight/2}px`;
                
                // Показуємо з затримкою для плавності
                hoverTimeout = setTimeout(() => {
                    previewBubble.classList.add('show');
                }, 500);
            });

            button.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
                previewBubble.classList.remove('show');
            });
        });

        // Приховуємо попередній перегляд при наведенні на нього
        previewBubble.addEventListener('mouseenter', () => {
            previewBubble.classList.remove('show');
        });

        // Обробка помилок завантаження зображень
        previewImage.addEventListener('error', () => {
            previewImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ5IiBoZWlnaHQ9IjE0MiIgdmlld0JveD0iMCAwIDI0OSAxNDIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDkiIGhlaWdodD0iMTQyIiBmaWxsPSIjZjVmNWY1Ii8+Cjx0ZXh0IHg9IjEyNC41IiB5PSI3MSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiIGZpbGw9IiM5OTkiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCI+Ч89vбp. перегл.</text+Cjwvc3ZnPgo=';
        });