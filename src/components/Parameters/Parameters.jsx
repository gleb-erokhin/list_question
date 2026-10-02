import Grade from './BlockTypes/Grade'
import Qualifications from './BlockTypes/Qualifications'
import Rank from './BlockTypes/Rank'
import styles from './Parameters.module.css'
import Search from './Search'

function Parameters({ specializations, skills, activeSpecializations, setActiveSpecializations, activeSkills,
  setActiveSkills, activeDifficulties, setActiveDifficulties, activeRatings, setActiveRatings, searchQuery,setSearchQuery }) {
    
  const difficult = ['1-3',' 4-6', '7-8', '9-10']
  const status = ['Изученные', 'Не изученные', 'Все']

  // console.log('2. Проводник specializations:', specializations);

  return (
    <div className={styles.parameters}>
      <Search
        value={searchQuery}
        onChange={setSearchQuery}
      />
      {/* Передаем массив специализаций и стейты фильтра вниз */}
      <Qualifications 
        title='Специализация'
        items={specializations}
        activeSpecializations={activeSpecializations}
        setActiveSpecializations={setActiveSpecializations}
      />
      {/* Передаем массив навыков и стейты фильтра вниз */}
      <Grade 
        title='Навыки'
        items={skills}
        activeSkills={activeSkills}
        setActiveSkills={setActiveSkills}
      />
      <Rank 
        arrays={difficult} 
        title='Уровень сложности' 
        activeItems={activeDifficulties}
        setActiveItems={setActiveDifficulties}
      />
      <Rank 
        arrays={[1, 2, 3, 4, 5]} 
        title='Рейтинг' 
        activeItems={activeRatings}
        setActiveItems={setActiveRatings}
      />
      <Rank arrays={status} title='Статус' />
    </div>
  )
}

export default Parameters