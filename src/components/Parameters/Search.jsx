import styles from './Search.module.css'

function Search() {
  return (
    <div className={styles.searchContainer}>
      <button type="button" className={styles.searchButton} aria-label="Поиск">
        {/* Вариант с SVG (рекомендуется для четкости) */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://w3.org">
          <circle cx="11" cy="11" r="7" stroke="#a3a3a3" strokeWidth="2"/>
          <path d="M20 20L16 16" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        {/* Или вариант с картинкой: <img src="search-icon.svg" alt="Лупа" /> */}
      </button>
      <input 
        className={styles.input} 
        type='text' 
        placeholder='Введите запрос' 
      />
    </div>
  )
}

export default Search