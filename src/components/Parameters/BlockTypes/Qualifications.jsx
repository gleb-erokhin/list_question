import { useEffect, useState } from 'react';
import axios from 'axios';

import styles from './../../Parameters/Parameters.module.css'
const API_QFN = 'https://api.yeatwork.ru/specializations'

function Qualifications({title}) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
    // Стейт для переключения режима развернутого списка
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Делаем GET-запрос к API
    axios.get(API_QFN)
      .then(response => {
        console.log(response.data.data)
        // получаем конечный массив объектов
        setTags(response.data.data);
      })
      .catch(error => {
        console.error('Ошибка при запросе:', error);
      })
      .finally(() => {
        setLoading(false)
      });
  }, []); // Пустой массив, чтобы запрос сработал один раз при загрузке

  if (loading) return <p>Загрузка тегов...</p>;
  // Вычисляем видимые теги
  const visibleTags = isExpanded ? tags : tags.slice(0, 5);
  // Проверяем, есть ли вообще смысл что-то раскрывать
  const hasMoreThanFive = tags.length > 5;

  return (
    <div className={styles.parameters__types}>
      <h3 className={styles.parameters__title}>{title}</h3>
      <ul className={styles.tags}> 
        {visibleTags.map((tag) => (
          <li key={tag.id}><button className={`${styles.tag}`}>{tag.title}</button></li>
        ))}
      </ul>
      <button 
        onClick={() => {
          if (hasMoreThanFive) setIsExpanded(!isExpanded);
        }}  
        className={styles.toggleAllLink}
        disabled={!hasMoreThanFive}
      >
        {isExpanded ? 'Свернуть' : 'Посмотреть всё'}
      </button>
    </div>
  )
}

export default Qualifications