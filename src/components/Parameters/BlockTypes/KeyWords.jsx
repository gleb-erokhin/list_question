import param from './../../Parameters/Parameters.module.css'
import blockTypes from './../BlockTypes/BlockTypes.module.css'

function KeyWords({ title, question}) {
  if(!question) return null

  return (
    <div className={param.parameters__types}>
      <h3 className={param.parameters__title}>{title}</h3>
      <ul className={blockTypes.blockTypes__list}>
        {
          question.keywords.map((value, index) => {
            return (
              <li 
                className={blockTypes.blockTypes__listItem}
                key={index}>
                {`#${value}`}
              </li>
            )
          })
        }
      </ul>
      <div className={blockTypes.blockTypes__author}>
        <p>Автор:<span>{` ${question.createdBy.username}`}</span></p>
      </div>
    </div>
  )
}

export default KeyWords