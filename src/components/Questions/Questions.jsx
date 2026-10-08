import Pagination from '../Pagination/Pagination'
import Spoiler from '../Spoiler/Spoiler'
import styles from './Questions.module.css'
import mainStyles from './../Main/Main.module.css'

function Questions({ items, currentPage, totalPages, setCurrentPage }) {
   // Собираем плоский массив всех ID текущей страницы, например: [12, 15, 88, 104...]
  const allIdsOnPage = items.map(item => item.id);

  return (
    <>
      <div className={`${styles.questions} ${mainStyles.bcgColorWhite}`}>
        <h2 className={styles.questions__title}>Вопросы React, JavaScript</h2>
        <div className={styles.spoilers}>
          {
            items.map((item) => {

              return (
                <Spoiler 
                  key={item.id} 
                  title={item.title}
                  id={item.id} 
                  spoilerImg={item.imageSrc} 
                  rate={item.rate} 
                  complexity={item.complexity}
                  // Передаем весь массив ID текущей страницы пропсом
                  allIdsOnPage={allIdsOnPage}
                >
                  {/* ВАЖНО: Выводим обработанный HTML через специальный атрибут React */}
                  <div 
                    className={styles.answerContent}
                    dangerouslySetInnerHTML={{ __html: item.shortAnswer }} 
                  />
                  {/* <a className={styles.spoiler__more} htef="" >Подробнее</a> */}
                </Spoiler>
              )
            })
          }
        </div>
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  )
}

export default Questions