import { useState, useRef, useEffect } from 'react';
import styles from './QuestionAnswerBlock.module.css';

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
    <div className={isLongAnswer ? styles.longAnswerSection : styles.shortAnswerSection}>
      {isLongAnswer && <h3>Полный разбор вопроса:</h3>}

      {/* Контейнер текста с динамическими классами и CSS-переменными */}
      <div
        ref={textRef}
        className={`
          ${styles.textContainer} 
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
            {isExpanded 
              ? (isLongAnswer ? 'Свернуть разбор полностью' : 'Свернуть краткий ответ') 
              : (isLongAnswer ? 'Развернуть разбор полностью' : 'Развернуть краткий ответ')
            }
          </button>
        </div>
      )}
    </div>
  );
}
