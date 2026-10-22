// Если запускаем локально (development), шлем напрямую на бэкенд.
// Если это билд на Vercel (production), шлем на относительный путь /api
export const API_BASE = import.meta.env.DEV
  ? 'https://api.yeatwork.ru'
  : '/api';