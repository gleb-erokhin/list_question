import { useState, useRef, useEffect } from 'react';
import styles from './QuestionAnswerBlock.module.css';
import mainStyles from './../Main/Main.module.css'
import questionPageStyles from './QuestionPage.module.css'

export default function QuestionAnswerBlock({ htmlContent, lineClamp, isLongAnswer = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef(null);

  // Проверяем, превышает ли текст заданный лимит строк
  useEffect(() => {
    if (textRef.current && htmlContent) {
      const hasOverflow = textRef.current.scrollHeight > textRef.current.clientHeight;
      setShowButton(hasOverflow);
    }
  }, [htmlContent, isExpanded]);

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  // Динамически вычисляем max-height на основе line-clamp и высоты строки (1.6)
  const collapsedMaxHeight = `${lineClamp * 1.6}em`;

  return (
    <div className={`${questionPageStyles.questionPage__answers} ${questionPageStyles.questionPage__pading24} ${mainStyles.bcgColorWhite} ${isLongAnswer ? styles.longAnswerSection : styles.shortAnswerSection}`}>
      {isLongAnswer ? <h3>Развернутый ответ</h3> : <h3>Короткий ответ</h3>}

      {/* Контейнер текста с динамическими классами и CSS-переменными */}
      <div
        ref={textRef}
        className={`
          ${styles.textContainer} 
          ${questionPageStyles.questionPage__answersText}
          ${isExpanded ? styles.isExpanded : styles.isCollapsed}
          ${(!isExpanded && showButton) ? styles.hasOverlay : ''}
        `}
        style={{ 
          '--line-clamp-limit': lineClamp,
          '--max-height-limit': collapsedMaxHeight 
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Центрированная кнопка управления */}
      {showButton && (
        <div className={styles.btnToggleContainer}>
          <button onClick={toggleExpand} className={styles.btnToggle}>
            {/* Логика для краткого и полного ответа */}
            {isExpanded 
              ? (isLongAnswer ? 'Свернуть' : 'Свернуть') 
              : (isLongAnswer ? 'Развернуть' : 'Развернуть')
            }
          </button>
        </div>
      )}
    </div>
  );
}
