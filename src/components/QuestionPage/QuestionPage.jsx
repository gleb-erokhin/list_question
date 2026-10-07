import { API_BASE } from '../../apiCondig';
import axios from 'axios';
import styles from './QuestionPage.module.css'
import mainStyles from './../Main/Main.module.css'
import parameters from './../Parameters/parameters.module.css'
import imgExample from './../../assets/img/imgExample.png'
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Parameters from '../Parameters/Parameters';
import QuestionAnswerBlock from './QuestionAnswerBlock';
import QuestionSkeleton from './../Skeleton/QuestionSkeleton';
import QuestionSlider from './QuestionSlider';

function QuestionPage() {
  // Извлекаем параметры окружения и навигации, Достаем ID вопроса из адресной строки (например, если URL /questions/2, то id = 2)
  const { id } = useParams();
  // СОЗДАЕМ СОБСТВЕННЫЙ СТЕЙТ. Изначально данных нет (null)
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

  // ЭФФЕКТ ДЛЯ ЗАПРОСА ДАННЫХ. Срабатывает один раз при загрузке этой страницы
  useEffect(() => {
    // Делаем запрос к API конкретно для ОДНОГО вопроса по его ID
    axios.get(`${API_BASE}/questions/public-questions/${id}`)
    .then(response => {
      setLoading(true)
      // Достаем объект вопроса из ответа сервера
      const rawQuestion = response.data.data || response.data;
        // Сброс кнопок, инкапсулирован внутри дочернего QuestionAnswerBlock через [htmlContent]
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

  // ИНДИКАТОРЫ ЗАГРУЗКИ (Пока сервер отвечает, переменная question еще пустая)
  // if (loading) return <div className={styles.centered}>Загрузка подробного ответа...</div>;
  // if (error) return <div className={styles.centered}>{error} <br/> <Link to="/">Вернуться на главную</Link></div>;
    // Если вопрос не пришел с сервера
  // if (!question) return <div className={styles.centered}>Вопрос не найден.</div>;

  // =======================================================
  // ЗАЩИЩЕННЫЙ ДИНАМИЧЕСКИЙ СБОР ПАРАМЕТРОВ ДЛЯ ЭТОГО ВОПРОСА
  // Передаем в сборщик массив из одного вопроса, и код сам вытащит нужные ID и Title
  // =======================================================
  const uniqueSpecs = [];
  const uniqueSkills = [];

  // Защита: запускаем сборку ТОЛЬКО если question уже загрузился и не равен null
  if (question) {
    const singleQuestionArray = [question];
    const specMap = new Map();
    const skillMap = new Map();

    singleQuestionArray.forEach(q => {
      q.questionSpecializations?.forEach(spec => {
        if (!specMap.has(spec.id)) {
          specMap.set(spec.id, true);
          uniqueSpecs.push({ id: spec.id, title: spec.title });
        }
      });
    });

    singleQuestionArray.forEach(q => {
      q.questionSkills?.forEach(skill => {
        if (!skillMap.has(skill.id)) {
          skillMap.set(skill.id, true);
          uniqueSkills.push({ id: skill.id, title: skill.title });
        }
      });
    });
  }

return (
  <main className={mainStyles.main}>
    <Link to="/" className={styles.questionPage__backBtn}>&larr; Назад</Link>
    <div className={mainStyles.main__wrapper} style={{ padding: '20px' }}>
      
      {/* ЛЕВЫЙ БЛОК: Подробное описание вопроса */}
      <article className={styles.questionPage__inner}>
        {
          loading ? (
            <QuestionSkeleton />
          ) : error ? (
             /* Состояние ошибки: стейт error рендерится на экране */
            <div className={styles.errorContainer}>
              <h2>Упс! Произошла ошибка</h2>
              <p className={styles.errorMessage}>{error}</p>
              
              {/* Оставляем слайдер, чтобы пользователь мог переключиться на соседние рабочие ID */}
              <QuestionSlider id={id} />

              <div className={styles.errorActions}>
                <Link to="/" className={styles.btnBackHome}>Вернуться на главную</Link>
              </div>
            </div>
          ) : (
            <>
              <div className={`${styles.questionPage__header} ${styles.questionPage__pading24} ${mainStyles.bcgColorWhite}`}>
                <img className={styles.questionPage__img} src={`${!question.imageSrc && imgExample}`} alt="image from question" />
                <div className={styles.questionPage__desc}>
                  <h1>{question.title}</h1> 
                  <p className={styles.questionPage__about}>{question.description}</p> 
                </div>
              </div>

              {/* Блок слайдера, перехода по вопросам */}
              <QuestionSlider id={id}/>
              {/* ВЫНЕСЕННЫЙ БЛОК: Короткий ответ */}
              <QuestionAnswerBlock 
                key={`short-${question.id}`} // уникальный ключ для короткого ответа
                htmlContent={question.shortAnswer} 
                lineClamp={4} 
              />
              {/* Блок с ответами */}
              {/* ВЫНЕСЕННЫЙ БЛОК: Полный ответ */}
              <QuestionAnswerBlock 
                key={`long-${question.id}`} // уникальный ключ для полного ответа
                htmlContent={question.longAnswer} 
                lineClamp={12} 
                isLongAnswer={true} 
              />
            </>
          )
        }
      </article>

      {/* ПРАВЫЙ БЛОК: Параметры конкретного вопроса */}
      {
        question ? (
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
        ) : (
          <div className={`${parameters.parameters} ${parameters.parameters_question}`} style={{ alignSelf: 'flex-start' }}>
            <div className={styles.sidebarSkeletonPlaceholder}>
              {/* Можно оставить пустым или написать нежный текст загрузки параметров */}
              Загрузка параметров...
            </div>
          </div>
        )}
    </div>
  </main>
  );
}

export default QuestionPage