import styles from './../Footer/Footer.module.css'
import { FaFigma, FaTelegramPlane, FaYoutube, FaTiktok, FaGithub   } from "react-icons/fa";

function Social() {
  return (
    <div className={styles.footer__social}>
    <a href='#!' className={styles.social__link}>
      <FaFigma />
    </a>
    <a href='#!' className={styles.social__link}>
      <FaTelegramPlane />
    </a>
    <a href='#!' className={styles.social__link}>
      <FaYoutube />
    </a>
    <a href='#!' className={styles.social__link}>
      <FaTiktok />
    </a>
    <a href='#!' className={styles.social__link}>
      <FaGithub />
    </a>
  </div>
  )
}

export default Social