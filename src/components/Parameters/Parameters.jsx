import Grade from './BlockTypes/Grade'
import Qualifications from './BlockTypes/Qualifications'
import Rank from './BlockTypes/Rank'
import styles from './Parameters.module.css'
import Search from './Search'

function Parameters() {
  // const spec = ['UI/UX designe', 'Frontend developer', 'Backed developer', 'Fullstack', 'Figma']
  const reatings = [1, 2, 3, 4, 5]
  const difficult = ['1-3',' 4-6', '7-8', '9-10']
  const status = ['Изученные', 'Не изученные', 'Все']

  return (
    <div className={styles.parameters}>
      <Search />
      <Qualifications title='Специализация' />
      <Grade title='Навыки' />
      <Rank arrays={difficult} title='Уровень сложности' />
      <Rank arrays={reatings} title='Рейтинг' />
      <Rank arrays={status} title='Статус' />
    </div>
  )
}

export default Parameters