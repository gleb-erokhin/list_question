import Grade from './BlockTypes/Grade'
import KeyWords from './BlockTypes/KeyWords'
import Levels from './BlockTypes/Levels'
import Qualifications from './BlockTypes/Qualifications'
import Rank from './BlockTypes/Rank'
import styles from './Parameters.module.css'
import Search from './Search'

function Parameters({ specializations, skills, activeSpecializations, setActiveSpecializations, activeSkills,
  setActiveSkills, activeDifficulties, setActiveDifficulties, activeRatings, setActiveRatings, searchQuery,setSearchQuery, isDetailPage=false, question = null }) {
    
  const difficult = ['1-3',' 4-6', '7-8', '9-10']
  const status = ['Изученные', 'Не изученные', 'Все']
  // console.log('2. Проводник specializations:', specializations);

  return (
    <div className={`${styles.parameters} ${isDetailPage ? styles.parameters_question : ''}`}>
      {/* 1. Поиск: показываем только если это НЕ страница вопроса */}
      {
        !isDetailPage &&
        <Search
          value={searchQuery}
          onChange={setSearchQuery}
        />
      }
      {/* Передаем массив специализаций и стейты фильтра вниз если это не страница вопроса */}
      {
        !isDetailPage &&
        <Qualifications 
          title='Специализация'
          items={specializations}
          activeSpecializations={activeSpecializations}
          setActiveSpecializations={setActiveSpecializations}
        />
      }
      {
        isDetailPage && question &&
        <Levels 
          title='Уровень'
          question={question}
        />
      }
      {/* Передаем массив навыков и стейты фильтра вниз, на страницу вопроса добавляется навык из конкретного вопроса передаваемый в АПИ QuestionPage */}
      <Grade 
        title='Навыки'
        items={skills}
        isDetailPage={isDetailPage}
        activeSkills={activeSkills}
        setActiveSkills={setActiveSkills}
      />
      {
        isDetailPage && question &&
        <KeyWords 
          title='Ключевые слова'
          question={question}
        />
      }
      {/* Остальные компоненты ниже тоже скрываем для страницы вопроса */}
      {
        !isDetailPage &&
        <Rank 
          arrays={difficult} 
          title='Уровень сложности' 
          activeItems={activeDifficulties}
          setActiveItems={setActiveDifficulties}
        />
      }
      {
        !isDetailPage &&
        <Rank 
          arrays={[1, 2, 3, 4, 5]} 
          title='Рейтинг' 
          activeItems={activeRatings}
          setActiveItems={setActiveRatings}
        />
      }
      {
        !isDetailPage &&
        <Rank arrays={status} title='Статус' />
      }
    </div>
  )
}

export default Parameters