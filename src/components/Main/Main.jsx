import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../../apiCondig';
import Parameters from '../Parameters/Parameters'
import Qestions from '../Questions/Questions'
import styles from './Main.module.css'

function Main() {
  const [questions, setQuestions] = useState([]);

  // Метаданные пагинации с сервера
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Стейты фильтров-кнопок, МАССИВ: хранит ID только активных специализаций, например: [1, 2]
  const [activeSpecializations, setActiveSpecializations] = useState([]);  
  const [activeSkills, setActiveSkills] = useState([]); 
  const [activeDifficulties, setActiveDifficulties] = useState([]); // Новый стейт для сложности
  const [activeRatings, setActiveRatings] = useState([]);

  // ПОИСК: Стейт для строки поиска
  const [searchQuery, setSearchQuery] = useState('');

  // Функция для очистки кавычек и декодирования HTML-тегов
  const decodeHtmlString = (htmlStr) => {
    if (typeof htmlStr !== 'string') return '';

    // 1. Убираем кавычки (двойные или одинарные) на краях строки, если они есть
    let cleanStr = htmlStr.replace(/^["']|["']$/g, '');

    // 2. Создаем виртуальный элемент в памяти браузера для парсинга спецсимволов (&lt; -> <)
    if (typeof window !== 'undefined') {
      const txt = document.createElement('textarea');
      txt.innerHTML = cleanStr;
      cleanStr = txt.value;
    }

    return cleanStr;
  };

  // Добавляем [currentPage] в массив зависимостей
  useEffect(() => {
    // Делаем один запрос по твоему принципу склеивания строк
    // Формируем URL. Дописываем параметр поиска (например, &title=Event)
    axios.get(`${API_BASE}questions/public-questions?page=${currentPage}&title=${encodeURIComponent(searchQuery)}`)
      .then(response => {
        console.log('public-questions', response.data.data)
        const rawData = response.data.data || [];
      
        // Пробегаем по массиву и очищаем текстовые свойства каждого вопроса
        const sanitizedData = rawData.map(item => ({
          ...item,
          shortAnswer: decodeHtmlString(item.shortAnswer),
          longAnswer: decodeHtmlString(item.longAnswer)
        }));
        
        // 1. Сохраняем вопросы текущей страницы
        setQuestions(sanitizedData);

        // 2. Вычисляем общее количество страниц на основе данных сервера
        const totalItems = response.data.total || 0;
        const limitPerPage = response.data.limit || 10;
        const calculatedPages = Math.ceil(totalItems / limitPerPage);

        // ОТЛАДКА: Посмотрим, сколько элементов и страниц насчитал код
        console.log('Пагинация с сервера:', { totalItems, limitPerPage, calculatedPages });
        
        setTotalPages(calculatedPages || 1);
      })
      .catch(error => console.error('Ошибка при запросе:', error));
  }, [currentPage, searchQuery]); // Запрос будет уходить каждый раз, когда мы меняем страницу!

  // 1. Собираем уникальные Специализации для компонента Qualifications
  const uniqueSpecs = [];
  const specMap = new Map();
  questions.forEach(q => {
    q.questionSpecializations?.forEach(spec => {
      // console.log('spec', spec)
      if (!specMap.has(spec.id)) {
        specMap.set(spec.id, true);
        uniqueSpecs.push({ id: spec.id, title: spec.title });
      }
    });
  });

  // 2. Собираем уникальные Навыки для компонента Grade
  const uniqueSkills = [];
  const skillMap = new Map();
  questions.forEach(q => {
    q.questionSkills?.forEach(skill => {
      if (!skillMap.has(skill.id)) {
        skillMap.set(skill.id, true);
        uniqueSkills.push({ id: skill.id, title: skill.title });
      }
    });
  });

    // ГЛУБОКАЯ ФИЛЬТРАЦИЯ ВОПРОСОВ
  const filteredQuestions = questions.filter(question => {
    // 1. Проверка по специализациям
    const matchSpecs = activeSpecializations.length === 0 || 
      question.questionSpecializations?.some(s => activeSpecializations.includes(s.id));

    // 2. Проверка по навыкам
    const matchSkills = activeSkills.length === 0 || 
      question.questionSkills?.some(s => activeSkills.includes(s.id));

    // 3. Фильтр по уровню сложности ( complexity )
    const matchDifficulty = activeDifficulties.length === 0 || 
      activeDifficulties.some(range => {
        // Разбираем строку типа '1-3' или ' 4-6' на два числа:мин и макс
        const [min, max] = range.split('-').map(num => parseInt(num.trim(), 10));
        const comp = question.complexity;
        // Проверяем, входит ли сложность вопроса в этот промежуток
        return comp >= min && comp <= max;
      });

    // 4. Фильтр по рейтингу ( rate )
    // Вопрос проходит, если массив пуст ИЛИ его рейтинг есть среди выбранных кнопок
    const matchRating = activeRatings.length === 0 || 
      activeRatings.includes(question.rate);

    // Вопрос проходит, если удовлетворяет ВСЕМ четырем условиям
    return matchSpecs && matchSkills && matchDifficulty && matchRating;
  });

  // console.log('1. Родоначальник uniqueSpecs:', uniqueSpecs);

  return (
    <main className={styles.main}>
      <section className={styles.main__wrapper}>
        {/* 4. Отдаем списку вопросов уже отфильтрованный массив, данные серверной пагинации */}
        <Qestions 
          items={filteredQuestions} 
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
        {/* 5. Передаем списки и управление фильтром в блок параметров */}
        <Parameters 
          specializations={uniqueSpecs}
          skills={uniqueSkills}
          // 1. Специализации
          activeSpecializations={activeSpecializations}
          setActiveSpecializations={(val) => {
            setActiveSpecializations(val);
            setCurrentPage(1); // сбрасываем страницу на 1-ю
          }}
          
          // 2. Навыки
          activeSkills={activeSkills}
          setActiveSkills={(val) => {
            setActiveSkills(val);
            setCurrentPage(1);
          }}
          
          // 3. Уровень сложности
          activeDifficulties={activeDifficulties}
          setActiveDifficulties={(val) => {
            setActiveDifficulties(val);
            setCurrentPage(1);
          }}
          
          // 4. Рейтинг
          activeRatings={activeRatings}
          setActiveRatings={(val) => {
            setActiveRatings(val);
            setCurrentPage(1);
          }}
          // 6. ПОИСК (Прописываем точно так же!)
          searchQuery={searchQuery}
          setSearchQuery={(val) => {
          setSearchQuery(val);
          setCurrentPage(1); // При вводе текста тоже перекидываем пользователя на 1-ю страницу результатов
          }}
        />
      </section>
    </main>
  )
}

export default Main