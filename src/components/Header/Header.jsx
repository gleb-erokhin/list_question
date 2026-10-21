import styles from './Header.module.css'
import logo from '../../assets/img/logo.svg'
import yeahub from '../../assets/img/yeahub.png'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import AuthButtons from './AuthButton/AuthButtons'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)   // Для бургер-меню (кнопки входа)
  const [isNavOpen, setIsNavOpen] = useState(false);   // Для спойлера навигации (меню)

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev)
  }

  const toggleNav = () => {
    setIsNavOpen(prev => !prev);
  };

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsNavOpen(false);
  };

  // Вспомогательная функция для динамических классов CSS-модулей
  const setActiveClass = ({ isActive }) => 
    `${styles.header__navLink} ${isActive ? styles.header__navLink_active : ''}`

  return (
    <header className={styles.header}>
      <div className={styles.header__wrapper}>
        <div className={styles.header__logo}>
          <img src={logo}/>
          <img src={yeahub}/>
        </div>

        <nav className={`${styles.header__nav} ${isNavOpen ? styles.header__nav_open : ''}`}>
          {/* Шапка спойлера: видна ТОЛЬКО на экранах <= 1024px */}
          <div className={styles.header__navHeader} onClick={toggleNav}>
            <span>Подготовка</span>
            <svg 
              className={`${styles.header__navArrow} ${isNavOpen ? styles.header__navArrow_rotated : ''}`} 
              width="12" 
              height="8" 
              viewBox="0 0 12 8" 
              fill="none" 
              xmlns="http://w3.org"
            >
              <path d="M1 1L6 6L11 1" stroke="#334155" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          <ul className={styles.header__navList}>
            <li className={styles.header__navListItem}><NavLink to="/" className={setActiveClass} onClick={closeAll}>База вопросов</NavLink></li>
            <li className={styles.header__navListItem}><NavLink to="/training" className={setActiveClass} onClick={closeAll}>Тренажёр</NavLink></li>
            <li className={styles.header__navListItem}><NavLink to="/docs" className={setActiveClass} onClick={closeAll}>Материалы</NavLink></li>
            <li className={styles.header__navListItem}><NavLink to="/skils" className={setActiveClass} onClick={closeAll}>Навыки (hh)</NavLink></li>
          </ul>
        </nav>

        {/* ДЕСКТОПНЫЕ КНОПКИ: Видны только > 1024px */}
        <AuthButtons
          className={`${styles.header__buttons_desktop}`}
        />

        {/* ВНЕШНЯЯ КНОПКА БУРГЕРА (Появляется на 1024px и управляет ТОЛЬКО кнопками входа) */}
        <button 
          className={`${styles.header__burger} ${isMenuOpen ? styles.header__burger_active : ''}`}
          onClick={toggleMenu}
          aria-label="Открыть меню авторизации"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* МОБИЛЬНОЕ БУРГЕР-МЕНЮ: Выпадает по клику на бургер */}
        <AuthButtons 
          className={`${styles.header__buttons_mobile} ${isMenuOpen ? styles.header__buttons_mobileOpen : ''}`}
        />

      </div>
    </header>
  )
}

export default Header