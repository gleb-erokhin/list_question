import { useState } from 'react'
import styles from './Spoiler.module.css'


function Spoiler({title, children, spoilerImg, reating, difficult}) {
  // 2. Создаем состояние: по умолчанию спойлер закрыт (false)
  const [isOpen, setIsOpen] = useState(false)

   // 3. Функция для переключения состояния
  const toggleSpoiler = () => {
    console.log('Клик сработал! Старое состояние:', isOpen);
    setIsOpen((prev) => !prev); // Инвертируем текущее значение (true -> false / false -> true)
  };

  console.log('Компонент перерисован. Текущий isOpen:', isOpen); 

  return (
    <>
      <div className={styles.spoiler__wrapper}>
        {/* 4. Привязываем клик к кнопке */}
        <button className={styles.spoiler__header}
          onClick={toggleSpoiler}
          aria-expanded={isOpen}>
          <span className={styles.spoiler__title}>{title}</span>{/* Стрелочка-индикатор */}
          <span className={styles.spoiler__arrow} data-open={isOpen}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="#6A0BFF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
        {/* 5. Класс 'is-open' теперь добавляется динамически в зависимости от isOpen */}
        <div className={styles.spoiler__content} data-open={isOpen}>
          <div className={styles.spoiler__inner}>
            {reating && difficult ?             
            <div className={styles.spoiler__levels}>
              <div className={styles.spoiler__levels_block}>
                <div className={styles.spoiler__marker}>Рейтинг: <span>{reating}</span></div>
                <div className={styles.spoiler__marker}>Сложность: <span>{difficult}</span></div>
              </div>
              <svg width="3" height="15" viewBox="0 0 3 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.8">
                  <circle opacity="0.8" cx="1.5" cy="1.5" r="1.5" fill="#5E5E5E" />
                  <circle opacity="0.8" cx="1.5" cy="7.5" r="1.5" fill="#5E5E5E" />
                  <circle opacity="0.8" cx="1.5" cy="13.5" r="1.5" fill="#5E5E5E" />
                </g>
              </svg>
            </div>
            : null}
            {spoilerImg ? <img className={styles.spoiler__img} src={spoilerImg} alt='img' /> : null}
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default Spoiler