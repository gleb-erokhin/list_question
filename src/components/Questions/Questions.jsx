import { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../Pagination/Pagination'
import Spoiler from '../Spoiler/Spoiler'
import styles from './Questions.module.css'

const API_BASE = 'https://api.yeatwork.ru/questions/public-questions'

function Questions() {
  const [items, setItems] = useState([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Делаем GET-запрос к API
    axios.get(API_BASE)
      .then(response => {
        // получаем конечный массив объектов
        setItems(response.data.data);
      })
      .catch(error => {
        console.error('Ошибка при запросе:', error);
      });
  }, []); // Пустой массив, чтобы запрос сработал один раз при загрузке

  return (
    <>
      <div className={styles.questions}>
        <h2 className={styles.questions__title}>Вопросы React, JavaScript</h2>
        <div className={styles.spoilers}>
          {
            items.map((item) => {
              return (<Spoiler key={item.id} title={item.title} spoilerImg={item.imageSrc} reating={item.rate} difficult={item.complexity}>
                <p>{item.shortAnswer}</p>
              </Spoiler>)
            })
          }
        </div>
        <Pagination />
      </div>
    </>
  )
}

export default Questions