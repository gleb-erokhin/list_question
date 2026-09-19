import styles from './../../Parameters/Parameters.module.css'

function Rank({ title, arrays }) {
  return (
    <div className={styles.parameters__types}>
      <h3 className={styles.parameters__title}>{title}</h3>
      <ul className={styles.tags}> 
        {arrays.map((item, index) => (
          <li key={index}><button className={`${styles.tag}`}>{item}</button></li>
        ))}
      </ul>
    </div>
  )
}

export default Rank