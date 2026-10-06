import styles from './QuestionSkeleton.module.css';

export default function QuestionSkeleton() {
  return (
    <>
      {/* Имитируем заголовок */}
      <div className={`${styles.skeleton} ${styles.title}`} />
      
      {/* Имитируем кнопки слайдера */}
      <div className={`${styles.skeleton} ${styles.slider}`} />
      
      {/* Имитируем короткий ответ (4 строки) */}
      <div className={styles.textGroup}>
        <div className={`${styles.skeleton} ${styles.line}`} />
        <div className={`${styles.skeleton} ${styles.line}`} />
        <div className={`${styles.skeleton} ${styles.skeleton} ${styles.lineMedium}`} />
        <div className={`${styles.skeleton} ${styles.lineShort}`} />
      </div>

      {/* Имитируем полный ответ (более длинный блок) */}
      <div className={styles.textGroup}>
        <div className={`${styles.skeleton} ${styles.line}`} style={{ width: '30%', height: '24px', marginBottom: '10px' }} />
        <div className={`${styles.skeleton} ${styles.line}`} />
        <div className={`${styles.skeleton} ${styles.line}`} />
        <div className={`${styles.skeleton} ${styles.line}`} />
        <div className={`${styles.skeleton} ${styles.lineMedium}`} />
        <div className={`${styles.skeleton} ${styles.lineShort}`} />
      </div>
    </>
  );
}
