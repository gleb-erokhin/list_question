import mainStyles from './../../Main/Main.module.css'
import questionPageStyles from '../../QuestionPage/QuestionPage.module.css'
import styles from './../BlockTypes/BlockTypes.module.css'
import guruImg from './../../../assets/img/guruImg.png'
import telegram from './../../../assets/img/Telegram.png'
import youtube from './../../../assets/img/Youtube.png'
import profile from './../../../assets/img/Profile.png'

function Guru() {
  return (
    <div className={`${styles.guru__main} ${mainStyles.bcgColorWhite} ${questionPageStyles.questionPage__pading24}`}>
      <div className={styles.guru__wrapper}>
        <img className={styles.guru__img} src={guruImg} alt="guru image" />
        <div className={styles.guru__inner}>
          <h3 className={styles.guru__title}>Руслан Куянец</h3>
          <p className={styles.guru__subTitle}>Python Guru</p>
        </div>
      </div>
      <p className={styles.guru__about}>
        Guru – это эксперты YeaHub, которые помогают развивать комьюнити.
      </p>
      <div className={styles.guru__social}>
        <a href="#"><img src={telegram} alt="телеграм" /></a>
        <a href="#"><img src={youtube} alt="телеграм" /></a>
        <a href="#"><img src={profile} alt="телеграм" /></a>
      </div>
    </div>
  )
}

export default Guru