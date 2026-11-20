// src/components/Questions/Questions.jsx
import Spoiler from '../Spoiler/Spoiler';
import Pagination from '../Pagination/Pagination';
import styles from './Questions.module.css';
import mainStyles from '../Main/Main.module.css';
import openParam from '../../assets/img/openParam.png'; // проверьте ваш путь импорта иконки

function Questions({
  items = [],
  loading,
  error,
  onRetry,
  onResetFilters,
  currentPage,
  onPageChange,
  totalPages,
  onOpenFilters,
}) {
  // Собираем плоский массив всех ID текущей страницы, например: [12, 15, 88, 104...]
  const allIdsOnPage = items.map((item) => item.id);

  return (
    <>
      <div className={`${styles.questions} ${mainStyles.bcgColorWhite}`}>
        <div className={styles.questions__titleBlock}>
          <h2 className={styles.questions__title}>Вопросы React, JavaScript</h2>
          <button className={styles.questions__openParamBtn} onClick={onOpenFilters}>
            <img src={openParam} alt="openParam" />
          </button>
        </div>

        <div className={styles.spoilers}>
          {loading ? (
            /* 1. Состояние загрузки: скелетоны карточек */
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className={styles.skeletonCard} aria-hidden="true">
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonMeta} />
              </div>
            ))
          ) : error ? (
            /* 2. Состояние ошибки с кнопкой повтора */
            <div className={styles.stateBox}>
              <h3 className={styles.stateTitle}>Не удалось загрузить вопросы</h3>
              <p className={styles.stateText}>{error}</p>
              {onRetry && (
                <button type="button" onClick={onRetry} className={styles.stateBtn}>
                  Повторить попытку
                </button>
              )}
            </div>
          ) : items.length === 0 ? (
            /* 3. Состояние пустого результата */
            <div className={styles.stateBox}>
              <h3 className={styles.stateTitle}>Ничего не найдено</h3>
              <p className={styles.stateText}>
                По выбранным параметрам или поисковому запросу вопросов не найдено.
              </p>
              {onResetFilters && (
                <button type="button" onClick={onResetFilters} className={styles.stateBtn}>
                  Сбросить фильтры
                </button>
              )}
            </div>
          ) : (
            /* 4. Успешный рендер списка вопросов */
            items.map((item) => (
              <Spoiler
                key={item.id}
                title={item.title}
                id={item.id}
                spoilerImg={item.imageSrc}
                rate={item.rate}
                complexity={item.complexity}
                allIdsOnPage={allIdsOnPage}
              >
                <div
                  className={styles.answerContent}
                  dangerouslySetInnerHTML={{ __html: item.shortAnswer }}
                />
              </Spoiler>
            ))
          )}
        </div>

        {/* Пагинацию показываем только когда нет загрузки, нет ошибки и список не пуст */}
        {!loading && !error && items.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={onPageChange}
          />
        )}
      </div>
    </>
  );
}

export default Questions;
