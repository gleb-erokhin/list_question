// import { API_BASE } from '../../apiCondig';
import { sanitizeAnswerContent } from '../utils/sanitizeContent';
import axios from 'axios';
import styles from './QuestionPage.module.css'
import questions from './../Questions/Questions.module.css'
import mainStyles from './../Main/Main.module.css'
import parameters from './../Parameters/Parameters.module.css'
import imgExample from './../../assets/img/imgExample.png'
import filterBtn from './../../assets/img/filterBtn.png'
import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Parameters from '../Parameters/Parameters';
import QuestionAnswerBlock from './QuestionAnswerBlock';
import QuestionSkeleton from './../Skeleton/QuestionSkeleton';
import QuestionSlider from './QuestionSlider';
import Guru from '../Parameters/BlockTypes/Guru';
import useSidebar from './../Hooks/useSidebar'

// 1. Внешний контроллер: мгновенно сбрасывает loading, error, question и закрывает шторку при смене id или нажатии «Повторить»
function QuestionPage() {
  const { id } = useParams();
  
  return (
    <QuestionContent
    key={`${id}`}
    id={id}
    />
  );
}

// 2. Внутренний компонент детальной страницы
function QuestionContent({ id }) {
  const location = useLocation()

    // Если пришли из каталога — вернём на исходную страницу с фильтрами, иначе на корень '/'
  const backToCatalogUrl = location.state?.fromSearch
    ? `/${location.state.fromSearch}`
    : '/';

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isSidebarOpen, openSidebar, closeSidebar } = useSidebar();

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    axios
      .get(`/api/questions/public-questions/${id}`, {
        signal: controller.signal,
      })
      .then((response) => {
        if (!isActive) return;

        const rawQuestion = response.data?.data || response.data;
        if (!rawQuestion) {
          setError('Вопрос не найден.');
          setQuestion(null);
          return;
        }

        setQuestion({
          ...rawQuestion,
          shortAnswer: sanitizeAnswerContent(rawQuestion.shortAnswer),
          longAnswer: sanitizeAnswerContent(rawQuestion.longAnswer),
        });
        setError(null);
      })
      .catch((err) => {
        if (!isActive || axios.isCancel(err) || err.name === 'CanceledError') return;

        console.error('Ошибка при загрузке вопроса:', err);
        setError('Не удалось загрузить данные вопроса.');
        setQuestion(null);
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [id]);

  // Собираем теги текущего вопроса (безопасно через optional chaining)
  const uniqueSpecs = [];
  const specMap = new Map();
  question?.questionSpecializations?.forEach((spec) => {
    const key = spec.id ?? spec.title;
    if (!specMap.has(key)) {
      specMap.set(key, true);
      uniqueSpecs.push({ id: key, title: spec.title });
    }
  });

  const uniqueSkills = [];
  const skillMap = new Map();
  question?.questionSkills?.forEach((skill) => {
    const key = skill.id ?? skill.title;
    if (!skillMap.has(key)) {
      skillMap.set(key, true);
      uniqueSkills.push({ id: key, title: skill.title });
    }
  });
 
  return (
  <main className={`${mainStyles.main} ${mainStyles.main_qst}`}>
    <Link to={backToCatalogUrl} className={`${styles.questionPage__backBtn} ${mainStyles.detailsLink}`}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.9427 15.8078C13.0007 15.8659 13.0468 15.9348 13.0782 16.0107C13.1097 16.0865 13.1258 16.1679 13.1258 16.25C13.1258 16.3321 13.1097 16.4134 13.0782 16.4893C13.0468 16.5652 13.0007 16.6341 12.9427 16.6922C12.8846 16.7502 12.8157 16.7963 12.7398 16.8277C12.6639 16.8592 12.5826 16.8753 12.5005 16.8753C12.4184 16.8753 12.3371 16.8592 12.2612 16.8277C12.1853 16.7963 12.1164 16.7502 12.0583 16.6922L5.8083 10.4422C5.75019 10.3841 5.70409 10.3152 5.67264 10.2393C5.64119 10.1634 5.625 10.0821 5.625 9.99998C5.625 9.91785 5.64119 9.83652 5.67264 9.76064C5.70409 9.68477 5.75019 9.61584 5.8083 9.55779L12.0583 3.30779C12.1756 3.19052 12.3346 3.12463 12.5005 3.12463C12.6663 3.12463 12.8254 3.19052 12.9427 3.30779C13.06 3.42507 13.1258 3.58413 13.1258 3.74998C13.1258 3.91583 13.06 4.07489 12.9427 4.19217L7.13409 9.99998L12.9427 15.8078Z" fill="#6A0BFF" />
      </svg>
      Назад
    </Link>
    <div className={`${mainStyles.main__wrapper} ${mainStyles.main__wrapper_qst}`} >
      {/* ЛЕВЫЙ БЛОК: Подробное описание вопроса */}
      <article className={styles.questionPage__inner}>
        {
          loading ? (
            <QuestionSkeleton />
          ) : error ? (
             /* Состояние ошибки: стейт error рендерится на экране */
            <div className={`${styles.errorContainer}`}>
              <div className={`${styles.errorContainerBlock} ${mainStyles.bcgColorWhite}`}>
                <h2>Упс! Произошла ошибка</h2>
                <p className={styles.errorMessage}>{error}</p>

                <div className={styles.errorActions}>
                  <Link to={backToCatalogUrl} className={styles.btnBackHome}>Вернуться на главную</Link>
                </div>
              </div>

              {/* Оставляем слайдер, чтобы пользователь мог переключиться на соседние рабочие ID */}
              <QuestionSlider id={id} />
            </div>
          ) : (
            <>
              <div className={`${styles.questionPage__header} ${styles.questionPage__pading24} ${mainStyles.bcgColorWhite}`}>
                <img className={styles.questionPage__img} src={`${!question.imageSrc && imgExample}`} alt="image from question" />
                <div className={styles.questionPage__desc}>
                  <div className={styles.questionPage__titleParam}>
                    <h1 className={styles.questionPage__title}>{question.title}</h1> 
                    <button className={questions.questions__openParamBtn} onClick={openSidebar}>
                      <img src={filterBtn} alt="filterBtn" />
                    </button>
                  </div>
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
      <div className={styles.questionPage__rightBlock}>
        {/* ПРАВЫЙ БЛОК: Параметры конкретного вопроса */}
        {
          question ? (
            <Parameters 
              // флаг, который сообщит компоненту, что это страница QuestionPage и необходимо отображать только ограниченные компоненты
              isDetailPage={true} 

              question={question}

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

              // передаем пропсы для закрытия параметров конкретного вопроса
              isFiltersVisible={isSidebarOpen} 
              onCloseFilters={closeSidebar} 
            />
          ) : (
            <div className={`${parameters.parameters} ${parameters.parameters_question}`} style={{ alignSelf: 'flex-start' }}>
              <div className={styles.sidebarSkeletonPlaceholder}>
                {/* Можно оставить пустым или написать нежный текст загрузки параметров */}
                Загрузка параметров...
              </div>
            </div>
          )}
          <Guru />
        </div>
    </div>
  </main>
  );
}

export default QuestionPage