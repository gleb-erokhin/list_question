import styles from './QuestionPage.module.css'
import mainStyles from './../Main/Main.module.css'
import questionStyles from './../Questions/Questions.module.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../apiCondig';
import { Link } from 'react-router-dom';
import Parameters from '../Parameters/Parameters';

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

   // ДИНАМИЧЕСКИЙ СБОР ПАРАМЕТРОВ СТРОГО ДЛЯ ЭТОГО ВОПРОСА
  // Передаем в сборщик массив из одного вопроса, и код сам вытащит нужные ID и Title
  const singleQuestionArray = [question];

  const uniqueSpecs = [];
  const specMap = new Map();
  singleQuestionArray.forEach(q => {
    q.questionSpecializations?.forEach(spec => {
      if (!specMap.has(spec.id)) {
        specMap.set(spec.id, true);
        uniqueSpecs.push({ id: spec.id, title: spec.title });
      }
    });
  });

  const uniqueSkills = [];
  const skillMap = new Map();
  singleQuestionArray.forEach(q => {
    q.questionSkills?.forEach(skill => {
      if (!skillMap.has(skill.id)) {
        skillMap.set(skill.id, true);
        uniqueSkills.push({ id: skill.id, title: skill.title });
      }
    });
  });

// Внутри рендера QuestionPage.jsx
return (
  <main className={mainStyles.main}>
    <div className={mainStyles.main__wrapper} style={{ padding: '20px' }}>
      
      {/* ЛЕВЫЙ БЛОК: Подробное описание вопроса */}
      <div className={styles.leftColumn}>
        <Link to="/" className={styles.backBtn}>&larr; Вернуться к списку вопросов</Link>
        
        <article className={styles.questionArticle}>
          <h1 className={styles.questionTitle}>{question.title}</h1>
          
          <div className={styles.contentSection}>
            <h2>Полный разбор вопроса:</h2>
            <div 
              className={questionStyles.answerContent} 
              dangerouslySetInnerHTML={{ __html: question.longAnswer }} 
            />
          </div>
        </article>
      </div>

      {/* ПРАВЫЙ БЛОК: Параметры конкретного вопроса */}
      <Parameters 
        // флаг, который сообщит компоненту, что это страница QuestionPage и необходимо отображать только ограниченные компоненты
        isDetailPage={true} 

        specializations={uniqueSpecs}
        skills={uniqueSkills}
        
        // Передаем пустые заглушки для стейтов, так как кликать и фильтровать здесь ничего не нужно
        activeSpecializations={[]}
        setActiveSpecializations={() => {}}
        activeSkills={[]}
        setActiveSkills={() => {}}
        
        // Для сложности, рейтинга и статуса передаем данные текущего вопроса напрямую
        activeDifficulties={[`${question.complexity}-${question.complexity}`]} // Подсветит нужный диапазон
        setActiveDifficulties={() => {}}
        
        activeRatings={[question.rate]} // Подсветит нужную цифру рейтинга
        setActiveRatings={() => {}}
        
        activeStatus={question.isLearned ? 'Изученные' : 'Не изученные'} // Подсветит статус вопроса
        setActiveStatus={() => {}}

        searchQuery=""
        setSearchQuery={() => {}}
      />

    </div>
  </main>
  );

}

export default QuestionPage