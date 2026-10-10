import styles from './../Header.module.css'

function AuthButtons({ className }) {

  return (
    <div className={className}>
      <button className={styles.header__login}>Вход</button>
      <button className={styles.header__register}>Регистрация</button>
    </div>
  )
}

export default AuthButtons