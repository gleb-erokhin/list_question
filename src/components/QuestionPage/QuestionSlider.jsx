import styles from './QuestionPage.module.css'
import mainStyles from './../Main/Main.module.css'
import { useNavigate, useLocation } from 'react-router-dom';

function QuestionSlider({id}) {
  // Инициализируем функцию переходов
  const navigate = useNavigate(); 
    // 2. Инициализируем локатор для считывания скрытого state роутера
  const location = useLocation(); 
    // Достаем массив ID с главной страницы (если прилетел напрямую, иначе пустой массив)
  const { allIdsOnPage } = location.state || { allIdsOnPage: [] };

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

  return (
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
  )
}

export default QuestionSlider