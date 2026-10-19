import Parameters from '../Parameters/Parameters'
import useQuestionsFilter from './../Hooks/useQuestionsFilter';
import Qestions from '../Questions/Questions'
import styles from './Main.module.css'
import useSidebar from './../Hooks/useSidebar'

function Main() {
  // Вызываем хук и деструктурируем готовые методы
  const { isSidebarOpen, openSidebar, closeSidebar } = useSidebar();

  // Автономная логика фильтрации и пагинации данных
  const { 
    filteredQuestions, 
    currentPage, 
    setCurrentPage, 
    totalPages, 
    filterState 
  } = useQuestionsFilter();
  
  // console.log('1. Родоначальник uniqueSpecs:', uniqueSpecs);

  return (
    <main className={styles.main}>
      <section className={styles.main__wrapper}>
        {/* 4. Отдаем списку вопросов уже отфильтрованный массив, данные серверной пагинации */}
        <Qestions 
          items={filteredQuestions} 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onOpenFilters={openSidebar} 
          searchQuery={filterState.searchQuery}
          setSearchQuery={filterState.setSearchQuery}
        />
        {/* 5. Передаем списки и управление фильтром в блок параметров */}
        <Parameters 
          isDetailPage={false} 
          isFiltersVisible={isSidebarOpen} 
          onCloseFilters={closeSidebar} 
          {...filterState} 
        />
      </section>
    </main>
  )
}

export default Main