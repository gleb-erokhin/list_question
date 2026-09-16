import styles from './Parameters.module.css'

function Parameters() {
  return (
    <div className={styles.main__parameters}>
      <input type='text' placeholder='Введите запрос' />
      <div className={styles.main__types}>
        <h3 className={styles.main__spec}>Специализация</h3>
        <ul className={styles.tags}> 
          <li><button className={`${styles.tag} ${styles.selected}`}>Figma</button></li>
          <li><button className={styles.tag}>UI/UX design</button></li>
          <li><button className={styles.tag}>Frontend developer</button></li>
          <li><button className={styles.tag}>Backend developer</button></li>
          <li><button className={styles.tag}>Fullstack</button></li> 
        </ul>
        <a href="#" className={styles.viewAll}>Посмотреть всё</a>
      </div>
      <div className={styles.main__types}>
        <h3 className={styles.skils}>Навыки</h3>
      </div>
      <div className={styles.main__types}>
        <h3 className={styles.main__difficult}>Уровень сложности</h3>
      </div>
      <div className={styles.main__types}>
        <h3 className={styles.main__raiting}>Рейтинг</h3>
      </div>
      <div className={styles.main__types}>
        <h3 className={styles.main__status}>Статус</h3>
      </div>
    </div>
  )
}

export default Parameters