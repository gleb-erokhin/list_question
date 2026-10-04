import mainStyles from './../Main/Main.module.css'
import imgExample from './../../assets/img/imgExample.png'
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../apiCondig';
import Parameters from '../Parameters/Parameters';
import QuestionAnswerBlock from './QuestionAnswerBlock';
import styles from './QuestionPage.module.css'

function QuestionPage() {
  // 1. Извлекаем параметры окружения и навигации? Достаем ID вопроса из адресной строки (например, если URL /questions/2, то id = 2)
  const { id } = useParams();
  // Инициализируем функцию переходов
  const navigate = useNavigate(); 
  // 2. Инициализируем локатор для считывания скрытого state роутера
  const location = useLocation(); 
  
  // Достаем массив ID с главной страницы (если прилетел напрямую, иначе пустой массив)
  const { allIdsOnPage } = location.state || { allIdsOnPage: [] };

  // 4. СОЗДАЕМ СОБСТВЕННЫЙ СТЕЙТ. Изначально данных нет (null)
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =======================================================
  // ДИНАМИЧЕСКИЙ РАСЧЕТ РЕАЛЬНЫХ СОСЕДЕЙ ПРИ КАЖДОМ РЕНДЕРЕ
  // =======================================================
  // Находим индекс текущего ID в массиве. Приводим типы к строкам для безопасности
  const currentIndex = allIdsOnPage.findIndex(pageId => pageId.toString() === id.toString());

  // Вычисляем реальные ID соседей на основе индекса в массиве
  const prevId = currentIndex > 0 ? allIdsOnPage[currentIndex - 1] : null;
  const nextId = currentIndex !== -1 && currentIndex < allIdsOnPage.length - 1 ? allIdsOnPage[currentIndex + 1] : null;

  // Для отладки — теперь при каждом клике вы будете видеть актуальное движение по массиву!
  console.log('Текущий индекс:', currentIndex, 'Массив ID:', allIdsOnPage, 'Соседи (prev/next):', prevId, nextId);

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
      setLoading(true)
      // Достаем объект вопроса из ответа сервера
      const rawQuestion = response.data.data || response.data;
        // Сброс кнопок теперь инкапсулирован внутри дочернего QuestionAnswerBlock через [htmlContent]
        setQuestion({
          ...rawQuestion,
          shortAnswer: decodeHtmlString(rawQuestion.shortAnswer),
          longAnswer: decodeHtmlString(rawQuestion.longAnswer)
        });
      })
      .catch(err => {
        console.error('Ошибка при загрузке:', err);
        setError('Не удалось загрузить подробный ответ.');
      })
      .finally(() => setLoading(false));
  }, [id]); // Эффект перезапустится, если id в URL изменится

 // Обработчики кликов: теперь мы ОБЯЗАТЕЛЬНО пробрасываем allIdsOnPage дальше при каждом navigate
  const handlePrevQuestion = () => {
    if (prevId) {
      navigate(`/questions/${prevId}`, { state: { allIdsOnPage } });
    }
  };
  const handleNextQuestion = () => {
    if (nextId) {
      navigate(`/questions/${nextId}`, { state: { allIdsOnPage } });
    }
  };

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

return (
  <main className={mainStyles.main}>
    <Link to="/" className={styles.questionPage__backBtn}>&larr; Назад</Link>
    <div className={mainStyles.main__wrapper} style={{ padding: '20px' }}>
      
      {/* ЛЕВЫЙ БЛОК: Подробное описание вопроса */}
      <article className={styles.questionPage__inner}>

        <div className={`${styles.questionPage__header} ${styles.questionPage__pading24} ${mainStyles.bcgColorWhite}`}>
          <img className={styles.questionPage__img} src={`${!question.imageSrc && imgExample}`} alt="image from question" />
          <div className={styles.questionPage__desc}>
            <h1>{question.title}</h1> 
            <p className={styles.questionPage__about}>{question.description}</p> 
          </div>
        </div>

        {/* Блок перехода по вопросам */}
        <div className={`${styles.questionPage__slider} ${mainStyles.bcgColorWhite}`}>
          <div className={styles.questionPage__sliderContainer}>
            <button
              onClick={handlePrevQuestion}
              disabled={prevId === null || prevId === undefined} 
              className={styles.questionPage__prevBtn}
            >
              {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.23809 0.180571C7.55259 0.450138 7.58901 0.923613 7.31944 1.23811L1.73781 7.75001L7.31944 14.2619C7.58901 14.5764 7.55259 15.0499 7.23809 15.3195C6.9236 15.589 6.45012 15.5526 6.18056 15.2381L0.180558 8.23811C-0.0601858 7.95724 -0.0601858 7.54279 0.180558 7.26192L6.18056 0.26192C6.45012 -0.0525743 6.9236 -0.0889955 7.23809 0.180571Z" fill="#5E5E5E" />
              </svg> */}
              Предыдущий
            </button >
            <button 
              onClick={handleNextQuestion}
              disabled={nextId === null || nextId === undefined} 
              className={styles.questionPage__nextBtn}
            >
              Следующий
              {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.26192 0.180571C0.576414 -0.0889955 1.04989 -0.0525743 1.31946 0.26192L7.31946 7.26192C7.5602 7.54279 7.5602 7.95724 7.31946 8.23811L1.31946 15.2381C1.04989 15.5526 0.576414 15.589 0.26192 15.3195C-0.0525743 15.0499 -0.0889955 14.5764 0.180571 14.2619L5.76221 7.75001L0.180571 1.23811C-0.0889955 0.923613 -0.0525743 0.450138 0.26192 0.180571Z" fill="#5E5E5E" />
              </svg> */}
            </button>
          </div>
        </div>
        {/* ВЫНЕСЕННЫЙ БЛОК: Короткий ответ */}
        <QuestionAnswerBlock 
          htmlContent={question.shortAnswer} 
          lineClamp={4} 
        />
        {/* ВЫНЕСЕННЫЙ БЛОК: Полный ответ */}
        <QuestionAnswerBlock 
          htmlContent={question.longAnswer} 
          lineClamp={12} 
          isLongAnswer={true} 
        />

      </article>

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