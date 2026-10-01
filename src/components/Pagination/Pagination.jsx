import styles from './Pagination.module.css'

function Pagination({ currentPage, totalPages, setCurrentPage }) {
    // Динамически строим массив страниц на основе ответа сервера (например, [1, 2, 3])
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

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
        
        {/* Номера страниц */}
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => setCurrentPage(number)}
              className={`${styles.page__link} ${currentPage === number ? styles.page__current : ''}`}
            >
              {number}
            </button>
          </li>
        ))}

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