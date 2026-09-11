import styles from './Header.module.css'
import logo from '../../assets/img/logo.svg'
import yeahub from '../../assets/img/yeahub.png'

function Header() {
  return (
    <header className={styles.header}>
        <div className={styles.header__wrapper}>
          <div className={styles.header__logo}>
            <img src={logo}/>
            <img src={yeahub}/>
          </div>
          <nav className={styles.header__nav}>
            <ul className={styles.header__nav_list}>
              <li className={styles.header__nav_list_item}>База вопросов</li>
              <li className={styles.header__nav_list_item}>Тренажёр</li>
              <li className={styles.header__nav_list_item}>Материалы</li>
              <li className={styles.header__nav_list_item}>Навыки (hh)</li>
            </ul>
          </nav>
          <div className={styles.header__buttons}>
            <div className={styles.header__enter}>
              <a href='#'>Вход</a>
            </div>
            <button className={styles.header__btn_reg}>Регистрация</button>
          </div>
        </div>
    </header>
  )
}

export default Header