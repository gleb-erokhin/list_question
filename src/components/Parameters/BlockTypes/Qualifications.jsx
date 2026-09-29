import { useState } from 'react';
import styles from './../../Parameters/Parameters.module.css'

function Qualifications({ title, items = [], activeSpecializations, setActiveSpecializations }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Ограничиваем показ кнопок
  const visibleItems = isExpanded ? items : items.slice(0, 5);
  const hasMoreThanFive = items.length > 5;

    // Функция-обработчик клика по конкретной кнопке
  const handleToggleSpecialization = (id) => {
    setActiveSpecializations((prevSelected) => {
      // prevSelected — это гарантированно актуальное предыдущее состояние массива
      if (prevSelected.includes(id)) {
        // Удаляем элемент: метод .filter() ВСЕГДА возвращает новый массив с новой ссылкой
        return prevSelected.filter(activeId => activeId !== id);
      } else {
        // Добавляем элемент: создаем полностью новый массив через [...]
        return [...prevSelected, id];
      }
    });
  };

  console.log('3. Получатель items:', items);
  console.log('Сколько всего специализаций пришло в компонент:', items.length);

  return (
    <div className={styles.parameters__types}>
      <h3 className={styles.parameters__title}>{title}</h3>

      <ul className={styles.tags}> 
        {visibleItems.map((item) => {
          // Кнопка подсвечивается, если её ID присутствует в массиве активных
          const isSelected = activeSpecializations.includes(item.id);

          return (
            <li key={item.id}>
              <button className={`${styles.tag}`}
                onClick={()=> handleToggleSpecialization(item.id)}
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