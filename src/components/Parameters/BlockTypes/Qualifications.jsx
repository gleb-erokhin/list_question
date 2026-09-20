import { useEffect, useState } from 'react';
import axios from 'axios';

import styles from './../../Parameters/Parameters.module.css'
const API_QFN = 'https://api.yeatwork.ru/specializations'

function Qualifications({title}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Делаем GET-запрос к API
    axios.get(API_QFN)
      .then(response => {
        console.log(response.data.data)
        // получаем конечный массив объектов
        setItems(response.data.data);
      })
      .catch(error => {
        console.error('Ошибка при запросе:', error);
      })
      .finally(() => {
        setLoading(false)
      });
  }, []); // Пустой массив, чтобы запрос сработал один раз при загрузке

  if (loading) return <p>Загрузка тегов...</p>;

  return (
    <div className={styles.parameters__types}>
      <h3 className={styles.parameters__title}>{title}</h3>
      <ul className={styles.tags}> 
        {items.map((item) => (
          <li key={item.id}><button className={`${styles.tag}`}>{item.title}</button></li>
        ))}
      </ul>
      <a href="#" className={styles.viewAll}>Посмотреть всё</a>
    </div>
  )
}

export default Qualifications