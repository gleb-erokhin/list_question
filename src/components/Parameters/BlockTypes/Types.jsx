import styles from './../../Parameters/Parameters.module.css'

function Types({title}) {
  return (
    <div className={styles.parameters__types}>
      <h3 className={styles.parameters__title}>{title}</h3>
      <ul className={styles.tags}> 
        <li><button className={`${styles.tag} ${styles.selected}`}>Figma</button></li>
        <li><button className={styles.tag}>UI/UX design</button></li>
        <li><button className={styles.tag}>Frontend developer</button></li>
        <li><button className={styles.tag}>Backend developer</button></li>
        <li><button className={styles.tag}>Fullstack</button></li> 
      </ul>
      <a href="#" className={styles.viewAll}>Посмотреть всё</a>
    </div>
  )
}

export default Types