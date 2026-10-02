// Ждем полной загрузки DOM-структуры перед запуском скрипта
document.addEventListener('DOMContentLoaded', () => {

    /* ========================================== */
    /* 0. ИНИЦИАЛИЗАЦИЯ EMAILJS SDK v4            */
    /* ========================================== */
    emailjs.init({
        publicKey: "gZpTXibkdx_2hYF6i"
    });

    // ЭЛЕМЕНТЫ МОДАЛЬНОГО ОКНА
    const modal = document.getElementById('mailModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const emailForm = document.getElementById('emailForm');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalSuccess = document.getElementById('modalSuccess');

    // ЭЛЕМЕНТЫ СЧЕТЧИКА СИМВОЛОВ
    const textarea = document.getElementById('clientMessage');
    const charCounter = document.getElementById('charCounter');
    const maxChars = 500;

    /* ========================================== */
    /* 1. ЛОГИКА ОТКРЫТИЯ И ЗАКРЫТИЯ МОДАЛКИ      */
    /* ========================================== */

    // Открытие окна при клике на кнопку почты
    openModalBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; /* Блокируем фон */
    });

    // Закрытие при клике на крестик
    closeModalBtn.addEventListener('click', closeModal);

    // Закрытие при клике на темную вуаль (overlay) вне самого окна
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Функция аккуратного закрытия и сброса скролла под адаптив
    function closeModal() {
        modal.classList.remove('active');

        // Восстанавливаем скролл: на десктопе у нас фиксированный экран, на мобилке - скролл разрешен
        if (window.innerWidth > 1024) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Через полсекунды (когда окно полностью закроется) возвращаем форму в исходное состояние
        setTimeout(() => {
            emailForm.style.display = 'block';
            modalSubtitle.style.display = 'block';
            modalSuccess.style.display = 'none';
        }, 400);
    }

    /* ========================================== */
    /* 2. ИНТЕРАКТИВНЫЙ СЧЕТЧИК СИМВОЛОВ TEXTAREA */
    /* ========================================== */
    textarea.addEventListener('input', () => {
        const remaining = maxChars - textarea.value.length;
        charCounter.textContent = `Осталось символов: ${remaining}`;

        // Если лимит подходит к концу (осталось меньше 50 букв), подсвечиваем желтым
        if (remaining < 50) {
            charCounter.style.color = '#eab308';
        } else {
            charCounter.style.color = '#94a3b8';
        }
    });

    /* ========================================== */
    /* 3. ОБРАБОТКА РЕАЛЬНОЙ ОТПРАВКИ ФОРМЫ       */
    /* ========================================== */
    emailForm.addEventListener('submit', (event) => {
        // Отключаем стандартную перезагрузку страницы браузером
        event.preventDefault();

        // Элементы управления кнопкой отправки
        const submitBtn = emailForm.querySelector('.form-submit-btn');
        const originalBtnText = submitBtn.textContent;

        // Переводим кнопку в состояние загрузки
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;

        // Собираем точные данные из полей для передачи в созданный HTML-шаблон EmailJS
        const templateParams = {
            client_phone: document.getElementById('clientContact').value,
            client_message: document.getElementById('clientMessage').value
        };

        // ОТПРАВКА ДАННЫХ ЧЕРЕЗ ОФИЦИАЛЬНЫЙ SDK EMAILJS v4
        emailjs.send('service_blwyxt1', 'template_joqjfdr', templateParams)
            .then(() => {
                // КОД ВЫПОЛНИТСЯ ПРИ УСПЕШНОЙ ОТПРАВКЕ:

                // Переключаем интерфейс модалки на экран успеха (без alert!)
                emailForm.style.display = 'none';
                modalSubtitle.style.display = 'none';
                modalSuccess.style.display = 'flex';

                // Полностью очищаем поля формы и сбрасываем счетчик символов в фоне
                emailForm.reset();
                charCounter.textContent = `Осталось символов: 500`;
                charCounter.style.color = '#94a3b8';

                // Возвращаем кнопку в исходное состояние для будущих отправок
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;

                // Автоматически закрываем модальное окно через 3 секунды
                setTimeout(() => {
                    if (modal.classList.contains('active')) {
                        closeModal();
                    }
                }, 3000);
            })
            .catch((error) => {
                // КОД ВЫПОЛНИТСЯ, ЕСЛИ ПРОИЗОШЛА ОШИБКА (например, упал интернет):
                console.error('Ошибка отправки через EmailJS:', error);
                alert('Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте связаться через мессенджеры.');

                // Возвращаем кнопку в активное состояние, чтобы клиент мог попробовать еще раз
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
    });
});