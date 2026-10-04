import Pagination from '../Pagination/Pagination'
import Spoiler from '../Spoiler/Spoiler'
import styles from './Questions.module.css'

function Questions({ items, currentPage, totalPages, setCurrentPage }) {

  return (
    <>
      <div className={styles.questions}>
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
                  reating={item.rate} 
                  difficult={item.complexity}
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