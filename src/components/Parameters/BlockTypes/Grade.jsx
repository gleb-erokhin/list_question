import { useEffect, useState } from 'react';
import { API_BASE } from '../../../apiCondig';
import axios from 'axios';
import styles from './../../Parameters/Parameters.module.css'

const Grade = ({title}) => {
  const [tags, setTags] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
    // Делаем GET-запрос к API
    axios.get(API_BASE + 'skills')
      .then(response => {
        // console.log("Skils tags", response.data.data)
        // получаем конечный массив объектов
        setTags(response.data.data);
      })
      .catch(error => {
        console.error('Ошибка при запросе:', error);
      })
  }, []); // Пустой массив, чтобы запрос сработал один раз при загрузке

    // Вычисляем видимые теги
  const visibleTags = isExpanded ? tags : tags.slice(0, 5);
  // Проверяем, есть ли вообще смысл что-то раскрывать
  const hasMoreThanFive = tags.length > 5;

  return (
    <div className={styles.parameters__types}>
      <h3 className={styles.parameters__title}>{title}</h3>
      <ul className={styles.tags}>
        {visibleTags.map((tag) => (
          <li key={tag.id}>
            <button className={`${styles.tag} ${styles.selected}`}>
            <span>
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.0351 15C15.0351 12.2386 17.2737 10 20.0351 10C22.7965 10 25.0351 12.2386 25.0351 15C25.0351 17.7614 22.7964 20 20.0351 20C17.2736 20 15.0351 17.7614 15.0351 15Z" fill="#00BCFF" />
                <path d="M5.0351 25C5.0351 22.2386 7.27367 20 10.0351 20L12.6996 18.5933L15.0351 20V25C15.0351 27.7615 12.7965 30 10.0351 30C7.27367 30 5.0351 27.7614 5.0351 25Z" fill="#00CF7F" />
                <path d="M15.0351 0L12.3144 4.72676L15.0351 9.99996H19.965C22.7264 9.99996 24.965 7.76139 24.965 4.99998C24.965 2.23857 22.7264 0 19.965 0H15.0351Z" fill="#FF7361" />
                <path d="M4.9649 4.99998C4.9649 7.76139 7.20348 9.99996 9.96489 9.99996L12.6172 11.0244L15.035 9.99996V0H9.96483C7.20348 0 4.9649 2.23857 4.9649 4.99998Z" fill="#FF4D12" />
                <path d="M5.0351 15C5.0351 17.7615 7.27367 20 10.0351 20H15.0351V10H10.0351C7.27367 10 5.0351 12.2386 5.0351 15Z" fill="#B659FF" />
              </svg>
              {tag.title}
            </span>
            </button>
          </li>
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

export default Grade