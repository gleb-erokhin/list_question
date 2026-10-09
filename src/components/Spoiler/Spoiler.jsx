import { useState } from 'react'
import { Link } from 'react-router-dom';
import styles from './Spoiler.module.css'
import mainStyles from './../Main/Main.module.css'


function Spoiler({ id, title, children, spoilerImg, rate, complexity, allIdsOnPage }) {
  // 2. Создаем состояние: по умолчанию спойлер закрыт (false)
  const [isOpen, setIsOpen] = useState(false)

   // 3. Функция для переключения состояния
  const toggleSpoiler = () => {
    // console.log('Клик сработал! Старое состояние:', isOpen);
    setIsOpen((prev) => !prev); // Инвертируем текущее значение (true -> false / false -> true)
  };

  // console.log('Компонент перерисован. Текущий isOpen:', isOpen); 

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
            {rate && complexity ?             
            <div className={styles.spoiler__levels}>
              <div className={styles.spoiler__levels_block}>
                <div className={styles.spoiler__marker}>Рейтинг: <span>{rate}</span></div>
                <div className={styles.spoiler__marker}>Сложность: <span>{complexity}</span></div>
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
            {/* Кнопка-ссылка для перехода внутрь, на страницу с полным описанием */}
            <div className={styles.spoiler__more} style={{ textAlign: 'right' }}>
              <Link 
                to={`questions/${id}`} 
                state={{ allIdsOnPage }} // Перевозим данные о соседях
                className={mainStyles.detailsLink}
              >
                Подробнее
              </Link>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M13.4697 5.46967C13.7626 5.17678 14.2374 5.17678 14.5303 5.46967L20.5303 11.4697C20.8232 11.7626 20.8232 12.2374 20.5303 12.5303L14.5303 18.5303C14.2374 18.8232 13.7626 18.8232 13.4697 18.5303C13.1768 18.2374 13.1768 17.7626 13.4697 17.4697L18.1893 12.75H4C3.58579 12.75 3.25 12.4142 3.25 12C3.25 11.5858 3.58579 11.25 4 11.25H18.1893L13.4697 6.53033C13.1768 6.23744 13.1768 5.76256 13.4697 5.46967Z" fill="#6A0BFF" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Spoiler