import param from './../../Parameters/Parameters.module.css'
import spoiler from './../../Spoiler/Spoiler.module.css'


function Levels({ title, question }) {
  // Дополнительная страховка: если вдруг компонент вызвался без вопроса, возвращаем null
  if(!question) return null
  return (
        <div className={param.parameters__types}>
          <h3 className={param.parameters__title}>{title}</h3>
          <div className={`${spoiler.spoiler__levels} ${spoiler.spoiler__levels_padding}`}>
            <div className={spoiler.spoiler__levels_block}>
              <div className={spoiler.spoiler__marker}>Рейтинг: <span>{question.rate ?? '-'}</span></div>
              <div className={spoiler.spoiler__marker}>Сложность: <span>{question.complexity ?? '-'}</span></div>
            </div>
          </div>
        </div>
  )
}

export default Levels