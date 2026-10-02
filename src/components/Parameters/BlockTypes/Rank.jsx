import styles from './../../Parameters/Parameters.module.css'

function Rank({ title, arrays = [], activeItems = [], setActiveItems }) {
    // универсальная логика множественного выбора handleToggleItem(value). он подхватывает новые пропсы автоматически и работает на Уровень сложности, рейтинг и статус.
    const handleToggleItem = (value) => {
    // Если функции управления не переданы (например, для Рейтинга, который мы еще не настроили),
    // чтобы код не падал, просто выходим из функции
    if (!setActiveItems) return;

    // Безопасно проверяем тип данных
    if (Array.isArray(activeItems)) {
      setActiveItems((prevSelected) => {
        if (prevSelected.includes(value)) {
          return prevSelected.filter(item => item !== value);
        } else {
          return [...prevSelected, value];
        }
      });
    } else {
      setActiveItems(value);
    }
  };

  return (
    <div className={styles.parameters__types}>
      <h3 className={styles.parameters__title}>{title}</h3>
      <ul className={styles.tags}> 
        {arrays.map((value, index) => {
          // Безопасное вычисление активности кнопки
          const isSelected = Array.isArray(activeItems) 
            ? activeItems.includes(value) 
            : activeItems === value;

          return (
            <li key={index}>
              <button className={`${styles.tag} ${isSelected ? styles.selected : null}`}
                onClick={() => handleToggleItem(value)}
              >
                {value}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Rank