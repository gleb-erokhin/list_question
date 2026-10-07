import styles from './QuestionSkeleton.module.css';

export default function QuestionSkeleton() {
  return (
    <>
      {/* Имитируем заголовок */}
      <div className={`${styles.skeleton} ${styles.title}`} style={{height: '208px'}}/>
      
      {/* Имитируем кнопки слайдера */}
      <div className={`${styles.skeleton} ${styles.slider}`} style={{height: '84px'}}/>
      
      {/* Имитируем короткий ответ (4 строки) */}
      <div className={`${styles.skeleton} ${styles.slider}`} style={{height: '204px'}}/>

      {/* Имитируем полный ответ (более длинный блок) */}
      <div className={`${styles.skeleton} ${styles.slider}`} style={{height: '276px'}}/>

    </>
  );
}
