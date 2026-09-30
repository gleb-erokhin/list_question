import { useState } from 'react';
import styles from './../../Parameters/Parameters.module.css'

function Qualifications({ title, items = [], activeSpecializations, setActiveSpecializations }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Ограничиваем показ кнопок
  const visibleItems = isExpanded ? items : items.slice(0, 5);
  const hasMoreThanFive = items.length > 5;

    // Функция-обработчик клика по конкретной кнопке
  const handleToggleSpecialization = (id) => {
    if (activeSpecializations.includes(id)) {
      // Если кнопка уже активна — убираем её ID из списка
      setActiveSpecializations(activeSpecializations.filter(activeId => activeId !== id));
    } else {
      // Если кнопка не активна — добавляем её ID к остальным активным
      setActiveSpecializations([...activeSpecializations, id]);
    }
  };

  return (
    <div className={styles.parameters__types}>
      <h3 className={styles.parameters__title}>{title}</h3>

      <ul className={styles.tags}> 
        {visibleItems.map((item) => {
          // Кнопка подсвечивается, если её ID присутствует в массиве активных
          const isSelected = activeSpecializations.includes(item.id);

          return (
            <li key={item.id}>
              <button className={`${styles.tag} ${isSelected ? styles.selected : null}`}
                onClick={()=> handleToggleSpecialization(item.id)}
              >
                {item.title}
              </button>
            </li>
          )
          })
        }
      </ul>
      <button 
        onClick={() => {
          if (hasMoreThanFive) setIsExpanded(!isExpanded);
        }}  
        className={styles.toggleAllLink}
        disabled={!hasMoreThanFive}
        style={{ background: 'none', border: 'none', textDecoration: hasMoreThanFive ? 'underline' : 'none' }}
      >
        {isExpanded ? 'Свернуть' : 'Посмотреть всё'}
      </button>
    </div>
  )
}

export default Qualifications