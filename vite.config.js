import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Укажите желаемый номер порта
    strictPort: true,
  } // (Опционально) Если порт занят, Vite выдаст ошибку, а не станет искать следующий свободный
})
