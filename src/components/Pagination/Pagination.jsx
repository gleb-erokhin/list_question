import styles from './Pagination.module.css'

function Pagination({ currentPage, totalPages, setCurrentPage = () => {} }) {
  // АЛГОРИТМ: ДВА ТРОЕТОЧИЯ С ИСХОДНОЙ ПЕРВОЙ И ПОСЛЕДНИМИ СТРАНИЦАМИ
  const getPageRange = () => {
    const range = [];

    // 1. Первая страница ВСЕГДА должна быть на экране
    range.push(1);

    // Вычисляем границы центрального "окна" вокруг текущей страницы
    // Показываем текущую страницу и по одной соседней с каждой стороны (например, для 5 это будет 4, 5, 6)
    let leftBound = Math.max(2, currentPage - 1);
    let rightBound = Math.min(totalPages - 1, currentPage + 1);

    // Дополнительная корректировка краев, чтобы в центре всегда было строго 3 цифры
    if (currentPage <= 3) {
      leftBound = 2;
      rightBound = Math.min(totalPages - 1, 4);
    }
    if (currentPage >= totalPages - 2) {
      leftBound = Math.max(2, totalPages - 3);
      rightBound = totalPages - 1;
    }

    // 2. Ставим ПЕРВОЕ троеточие, если между '1' и началом центрального окна есть разрыв
    if (leftBound > 2) {
      range.push('...');
    }

    // 3. Заполняем центральное скользящее окно (обычно 3 цифры)
    for (let i = leftBound; i <= rightBound; i++) {
      range.push(i);
    }

    // 4. Ставим ВТОРОЕ троеточие, если между концом центрального окна и тремя последними страницами есть разрыв
    // Так как в конце у нас зафиксированы три страницы (например, 171, 172, 173), разрыв проверяем до (totalPages - 2)
    if (rightBound < totalPages - 3) {
      range.push('...');
    }

    // 5. Добавляем фиксированные последние 3 страницы (если они еще не вывелись в цикле)
    if (totalPages > 3) {
      const lastStart = Math.max(rightBound + 1, totalPages - 2);
      for (let i = lastStart; i <= totalPages; i++) {
        range.push(i);
      }
    }

    return range;
  };

  const pages = getPageRange();

  return (
    <>
      <nav className={styles.pagination}>
        <button className={styles.btn__left} 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M6.06694 0.183058C6.31102 0.427136 6.31102 0.822864 6.06694 1.06694L2.13388 5H13.9583C14.3035 5 14.5833 5.27982 14.5833 5.625C14.5833 5.97018 14.3035 6.25 13.9583 6.25H2.13388L6.06694 10.1831C6.31102 10.4271 6.31102 10.8229 6.06694 11.0669C5.82286 11.311 5.42714 11.311 5.18306 11.0669L0.183058 6.06694C-0.0610194 5.82286 -0.0610194 5.42714 0.183058 5.18306L5.18306 0.183058C5.42714 -0.0610194 5.82286 -0.0610194 6.06694 0.183058Z" fill="#6A0BFF" />
          </svg>
        </button>
        
        {/* Выводим цифры и троеточия напрямую */}
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`dots-${index}`} className={styles.dots}>
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`${styles.page__link} ${currentPage === page ? styles.page__current : ''}`}
            >
              {page}
            </button>
          );
        })}

        <button className={styles.btn__right}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M8.51639 11.0669C8.76047 11.311 9.1562 11.311 9.40027 11.0669L14.4003 6.06694C14.6444 5.82287 14.6444 5.42714 14.4003 5.18306L9.40028 0.18306C9.1562 -0.0610173 8.76047 -0.0610174 8.51639 0.18306C8.27232 0.427137 8.27232 0.822866 8.51639 1.06694L12.4495 5L0.625001 5C0.279823 5 1.04386e-06 5.27982 9.83506e-07 5.625C9.23153e-07 5.97018 0.279823 6.25 0.625001 6.25L12.4495 6.25L8.51639 10.1831C8.27231 10.4271 8.27231 10.8229 8.51639 11.0669Z" fill="#6A0BFF" />
          </svg>
        </button>
      </nav>
    </>
  )
}

export default Pagination