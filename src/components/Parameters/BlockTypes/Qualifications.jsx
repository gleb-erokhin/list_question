import { useState } from 'react';
import styles from './../../Parameters/Parameters.module.css'

function Qualifications({ title, items = [], activeFilter, setActiveFilter }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Ограничиваем показ кнопок
  const visibleItems = isExpanded ? items : items.slice(0, 5);
  const hasMoreThanFive = items.length > 5;

  console.log('3. Получатель items:', items);
  console.log('Сколько всего специализаций пришло в компонент:', items.length);

  return (
    <div className={styles.parameters__types}>
      <h3 className={styles.parameters__title}>{title}</h3>
      <ul className={styles.tags}> 
        {visibleItems.map((item) => {
          const isSelected = activeFilter?.type === 'specialization' && activeFilter?.id === item.id;
          return (
            <li key={item.id}>
              <button className={`${styles.tag}`}
                onClick={()=> setActiveFilter({ type: 'specialization', id: item.id })}
                style={{ fontWeight: isSelected ? 'bold' : 'normal' }}
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