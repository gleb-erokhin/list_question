import styles from './QuestionPage.module.css'
import questionStyles from './../Questions/Questions.module.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../apiCondig';
import { Link } from 'react-router-dom';

function QuestionPage() {
    // 2. Достаем ID вопроса из адресной строки (например, если URL /questions/2, то id = 2)
  const { id } = useParams();
  
  // 3. СОЗДАЕМ СОБСТВЕННЫЙ СТЕЙТ. Изначально данных нет (null)
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Хелпер декодирования HTML (тот же, что мы делали для MainPage)
  const decodeHtmlString = (htmlStr) => {
    if (typeof htmlStr !== 'string') return '';
    let cleanStr = htmlStr.replace(/^["']|["']\$/g, '');
    if (typeof window !== 'undefined') {
      const txt = document.createElement('textarea');
      txt.innerHTML = cleanStr;
      cleanStr = txt.value;
    }
    return cleanStr;
  };

  // 4. ЭФФЕКТ ДЛЯ ЗАПРОСА ДАННЫХ. Срабатывает один раз при загрузке этой страницы
  useEffect(() => {
    // Делаем запрос к API конкретно для ОДНОГО вопроса по его ID
    axios.get(`${API_BASE}/questions/public-questions/${id}`)
      .then(response => {
        // Достаем объект вопроса из ответа сервера
        const rawQuestion = response.data.data || response.data;
        
        // 5. СОХРАНЯЕМ ДАННЫЕ В СТЕЙТ. И сразу очищаем свойство longAnswer от кавычек
        setQuestion({
          ...rawQuestion,
          longAnswer: decodeHtmlString(rawQuestion.longAnswer)
        });
      })
      .catch(err => {
        console.error('Ошибка при загрузке:', err);
        setError('Не удалось загрузить подробный ответ.');
      })
      .finally(() => setLoading(false));
  }, [id]); // Эффект перезапустится, если id в URL изменится

  // 6. ИНДИКАТОРЫ ЗАГРУЗКИ (Пока сервер отвечает, переменная question еще пустая)
  if (loading) return <div className={styles.centered}>Загрузка подробного ответа...</div>;
  if (error) return <div className={styles.centered}>{error} <br/> <Link to="/">Вернуться на главную</Link></div>;
  
  // Если вопрос не пришел с сервера
  if (!question) return <div className={styles.centered}>Вопрос не найден.</div>;

  // 7. ОСНОВНОЙ РЕНДЕР. Сюда код доходит, только когда question ЗАПОЛНИЛСЯ данными из API

// Внутри рендера QuestionPage.jsx
return (
  <div className={styles.pageWrapper}>
    <Link to="/" className={styles.backBtn}>&larr; Вернуться к списку вопросов</Link>
    
    <article className={styles.questionArticle}>
      <h1 className={styles.questionTitle}>{question.title}</h1>
      
      <div className={styles.metaInfo}>
        <span>Сложность: {question.complexity}/10</span>
        <span>Рейтинг: {question.rate}/5</span>
      </div>

      <div className={styles.contentSection}>
        {/* Здесь выводится именно ПОЛНОЕ ОПИСАНИЕ (longAnswer) с сервера */}
        <h2>Полный разбор вопроса:</h2>
        <div 
          className={questionStyles.answerContent} // Применяем наши готовые CSS-фиксы (canvas, pre, iframe)
          dangerouslySetInnerHTML={{ __html: question.longAnswer }} 
        />
      </div>
    </article>
  </div>
);

}

export default QuestionPage