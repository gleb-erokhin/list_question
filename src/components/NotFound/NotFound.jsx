import { Link } from 'react-router-dom'
import styles from './../NotFound/NotFound.module.css'
import mainStyles from './../Main/Main.module.css'

function NotFound() {
  return (
    <main className={mainStyles.main}>
      <div className={`${styles.questions} ${mainStyles.bcgColorWhite}`}> 
        <div className={styles.textBlock}>
          <span>404</span>
          <h2>Страница не найдена</h2>
          <p>К сожалению, запрашиваемая страница не существует или была перемещена.</p>
          {/* Используем Link из react-router-dom для бесшовного перехода */}
          <Link to="/" style={{ color: '#334155', fontWeight: 'bold', textDecoration: 'underline' }}>
            Вернуться на главную
          </Link>
        </div>
      </div>

    </main>
  )
}

export default NotFound