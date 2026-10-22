// Если запускаем локально (development), шлем напрямую на бэкенд.
// Если это билд на Vercel (production), шлем на относительный путь /api
// export const API_BASE = import.meta.env.DEV
//   ? 'https://api.yeatwork.ru'
//   : '/api';

// В режиме разработки используем прямой URL. 
// На Vercel пропускаем через прокси, который уберет ошибку CORS в браузере.
export const API_BASE = import.meta.env.DEV
  ? 'https://api.yeatwork.ru'
  : 'https://api.allorigins.win/raw?url=https://api.yeatwork.ru';