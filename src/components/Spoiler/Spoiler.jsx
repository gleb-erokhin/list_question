import { useState } from 'react'
import styles from './Spoiler.module.css'

function Spoiler({title, children}) {
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
          <span className={styles.spoiler__arrow} data-open={isOpen}>▼</span>
        </button>
        {/* 5. Класс 'is-open' теперь добавляется динамически в зависимости от isOpen */}
        <div className={styles.spoiler__content} data-open={isOpen}>
          <div className={styles.spoiler__inner}>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default Spoiler