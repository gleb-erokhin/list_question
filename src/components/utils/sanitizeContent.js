// src/utils/sanitizeContent.js
import DOMPurify from 'dompurify';
import { marked } from 'marked';

// Настраиваем marked для безопасного рендера переносов и GFM-таблиц/кода
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Белый список разрешенных тегов и атрибутов
const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote',
    'pre', 'code', 'span', 'div', 'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td'
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class'],
  // Запрещаем опасные протоколы в ссылках и картинках (например, javascript:)
  // В объекте PURIFY_CONFIG:
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
  // Явно запрещаем ломающие верстку и опасные теги
  FORBID_TAGS: ['script', 'style', 'iframe', 'canvas', 'object', 'embed', 'form'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style'],
};

/**
 * Определяет, написан ли контент в формате Markdown, а не готового HTML
 */
const isMarkdownContent = (str) => {
  // Если строка начинается с HTML-тега (например, <p>, <div>), считаем её готовым HTML
  const startsWithHtmlTag = /^\s*<[a-z][\s\S]*>/i.test(str);
  if (startsWithHtmlTag) return false;

  // Проверяем наличие характерных конструкций Markdown (блоки кода, заголовки, списки, жирный текст)
  const markdownPatterns = /(^|\n)(#{1,6}\s|```|>\s|\*\s|-\s|\d+\.\s)|\*\*[^*]+\*\*/;
  return markdownPatterns.test(str);
};

/**
 * Безопасно форматирует (HTML или Markdown) и очищает строку перед вставкой в DOM
 */
export const sanitizeAnswerContent = (rawStr) => {
  if (typeof rawStr !== 'string' || !rawStr.trim()) return '';

  // 1. Снимаем только внешние обрамляющие кавычки, если бэкенд прислал JSON-строку в строке
  let processed = rawStr.trim();
  if (
    (processed.startsWith('"') && processed.endsWith('"')) ||
    (processed.startsWith("'") && processed.endsWith("'"))
  ) {
    processed = processed.slice(1, -1);
  }

  // 2. Если это Markdown (как в вопросе 101) — конвертируем в HTML.
  // Если это готовый HTML (как в вопросе 88) — НЕ декодируем сущности через textarea,
  // чтобы &lt;h1&gt; внутри <code> остался текстом!
  if (isMarkdownContent(processed)) {
    processed = marked.parse(processed);
  }

  // 3. Санитизируем HTML через DOMPurify (вырезает XSS, onerror, iframe, canvas)
  return DOMPurify.sanitize(processed, PURIFY_CONFIG);
};
