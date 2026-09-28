import Grade from './BlockTypes/Grade'
import Qualifications from './BlockTypes/Qualifications'
import Rank from './BlockTypes/Rank'
import styles from './Parameters.module.css'
import Search from './Search'

function Parameters({specializations, skills, activeFilter, setActiveFilter}) {
  // const spec = ['UI/UX designe', 'Frontend developer', 'Backed developer', 'Fullstack', 'Figma']
  const reatings = [1, 2, 3, 4, 5]
  const difficult = ['1-3',' 4-6', '7-8', '9-10']
  const status = ['Изученные', 'Не изученные', 'Все']

  return (
    <div className={styles.parameters}>
      <Search />
      {/* Кнопка «Все вопросы» для сброса фильтрации */}
      <button
        onClick={() => setActiveFilter(null)}
        style={{ fontWeight: activeFilter === null ? 'bold' : 'normal', marginBottom: '10px' }}
      >
        Все вопросы
      </button>
      {/* Передаем массив специализаций и стейты фильтра вниз */}
      <Qualifications 
        title='Специализация'
        items={specializations}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
      {/* Передаем массив навыков и стейты фильтра вниз */}
      <Grade 
        title='Навыки'
        items={skills}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
      <Rank arrays={difficult} title='Уровень сложности' />
      <Rank arrays={reatings} title='Рейтинг' />
      <Rank arrays={status} title='Статус' />
    </div>
  )
}

export default Parameters