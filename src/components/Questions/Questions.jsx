import Pagination from '../Pagination/Pagination'
import Spoiler from '../Spoiler/Spoiler'
import styles from './Questions.module.css'

function Questions({ items }) {

  return (
    <>
      <div className={styles.questions}>
        <h2 className={styles.questions__title}>Вопросы React, JavaScript</h2>
        <div className={styles.spoilers}>
          {
            items.map((item) => {
              return (
                <Spoiler key={item.id} title={item.title} spoilerImg={item.imageSrc} reating={item.rate} difficult={item.complexity}>
                  <p>
                    {item.shortAnswer} <br />
                  </p>
                  {/* <a className={styles.spoiler__more} htef="" >Подробнее</a> */}
                </Spoiler>
              )
            })
          }
        </div>
        <Pagination />
      </div>
    </>
  )
}

export default Questions