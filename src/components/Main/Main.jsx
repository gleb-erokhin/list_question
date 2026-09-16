import Parameters from '../Parameters/Parameters'
import Qestions from '../Questions/Questions'
import styles from './Main.module.css'

function Main() {
  
  return (
    <main className={styles.main}>
      <section className={styles.main__wrapper}>
        <Qestions />
        <Parameters />
      </section>
    </main>
  )
}

export default Main