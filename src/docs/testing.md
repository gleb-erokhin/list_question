Блок для тестирования скелетона, для настройки css в реальном времени. для активации перейти по пути localhost:3000\skeleton

блок со стилями и импортом компонентов
// 1. ИМПОРТИРУЕМ СКЕЛЕТОН ДЛЯ ТЕСТИРОВАНИЯ
import QuestionSkeleton from './components/Skeleton/QuestionSkeleton';
// 2. ИМПОРТИРУЕМ СТИЛИ СЕТКИ СТРАНИЦЫ (чтобы взять класс заглушки сайдбара)
import pageStyles from './components/Main/Main.module.css'; 
import questionPage from './components/QuestionPage/QuestionPage.module.css';
import Parameters from './components/Parameters/Parameters'

блок основной для роутов, вставить после QuestionPage

{/* 3. ТЕСТОВЫЙ МАРШРУТ: СТРОИМ ТОЧНУЮ КОПИЮ ДВУХБЛОЧНОЙ СЕТКИ СТРАНИЦЫ ЗАГРУЗКИ */}
<Route path='skeleton' element={
  <main className={pageStyles.main || pageStyles.layoutDashboard}>
    <div className={pageStyles.main__wrapper}>
      
      {/* ЛЕВАЯ КОЛОНКА: Здесь рендерится сам тестируемый скелетон ответа */}
      <article className={questionPage.questionPage__inner}>
        <QuestionSkeleton />
      </article>
      
      {/* ПРАВАЯ КОЛОНКА: Заглушка сайдбара параметров, чтобы сетка макета не ломалась */}
      <Parameters />

    </div>
  </main>
} />