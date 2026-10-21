import { useState, useEffect, useRef } from 'react';
import { API_BASE } from '../../apiCondig';
import axios from 'axios';

export default function useQuestionsFilter() {
  // 1. Метаданные пагинации с сервера
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 2. Стейты фильтров-кнопок
  const [activeSpecializations, setActiveSpecializations] = useState([]);
  const [activeSkills, setActiveSkills] = useState([]);
  const [activeDifficulties, setActiveDifficulties] = useState([]);
  const [activeRatings, setActiveRatings] = useState([]);

  // 3. Поиск и Дебаунс
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const debounceTimerRef = useRef(null);

  // Функция декодирования HTML-тегов
  const decodeHtmlString = (htmlStr) => {
    if (typeof htmlStr !== 'string') return '';
    let cleanStr = htmlStr.replace(/^["']|["']\$/g, '');
    if (typeof window !== 'undefined') {
      const txt = document.createElement('textarea');
      txt.innerHTML = cleanStr;
      cleanStr = txt.value;
    }
    return cleanStr;
  };

  // 1. ЧИСТЫЙ ДЕБАУНС ПОИСКА (БЕЗ СБРОСА СТРАНИЦЫ ВНУТРИ)
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);
    return () => clearTimeout(debounceTimerRef.current);
  }, [searchQuery]);

  // 2. ЭФФЕКТ ДЛЯ ЗАПРОСОВ К СЕРВЕРУ (Зависит СТРОГО от страницы и дебаунса)
  useEffect(() => {
    axios.get(`${API_BASE}/questions/public-questions?page=${currentPage}&title=${encodeURIComponent(debouncedSearchQuery)}`)
      .then(response => {
        const rawData = response.data.data || [];

        const sanitizedData = rawData.map(item => ({
          ...item,
          shortAnswer: decodeHtmlString(item.shortAnswer),
          longAnswer: decodeHtmlString(item.longAnswer)
        }));

        setQuestions(sanitizedData);

        const totalItems = response.data.total || 0;
        const limitPerPage = response.data.limit || 10;
        const calculatedPages = Math.ceil(totalItems / limitPerPage);

        setTotalPages(calculatedPages || 1);
      })
      .catch(error => console.error('Ошибка при запросе:', error));
  }, [currentPage, debouncedSearchQuery]);

  // 3. СБОРЩИКИ УНИКАЛЬНЫХ КНОПОК ДЛЯ PARAMETERS
  const uniqueSpecs = [];
  const specMap = new Map();
  questions.forEach(q => {
    q.questionSpecializations?.forEach(spec => {
      if (!specMap.has(spec.id)) {
        specMap.set(spec.id, true);
        uniqueSpecs.push({ id: spec.id, title: spec.title });
      }
    });
  });

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

  // 4. ВАША ГЛУБОКАЯ КЛИЕНТСКАЯ ФИЛЬТРАЦИЯ ВОПРОСОВ
  const filteredQuestions = questions.filter(question => {
    const matchSpecs = activeSpecializations.length === 0 ||
      question.questionSpecializations?.some(s => activeSpecializations.includes(s.id));

    const matchSkills = activeSkills.length === 0 ||
      question.questionSkills?.some(s => activeSkills.includes(s.id));

    const matchDifficulty = activeDifficulties.length === 0 ||
      activeDifficulties.some(range => {
        const [min, max] = range.split('-').map(num => parseInt(num.trim(), 10));
        const comp = question.complexity;
        return comp >= min && comp <= max;
      });

    const matchRating = activeRatings.length === 0 ||
      activeRatings.includes(question.rate);

    return matchSpecs && matchSkills && matchDifficulty && matchRating;
  });

  return {
    filteredQuestions,
    currentPage,
    setCurrentPage, // Отдаем чистый, оригинальный сеттер для пагинации
    totalPages,

    // ПРЕДОТВРАЩАЕМ КАСКАДЫ: Сброс страницы происходит ТОЛЬКО в момент явного вызова функций фильтрации пользователем
    filterState: {
      activeSpecializations,
      setActiveSpecializations: (val) => {
        setCurrentPage(1);
        setActiveSpecializations(val);
      },

      activeSkills,
      setActiveSkills: (val) => {
        setCurrentPage(1);
        setActiveSkills(val);
      },

      activeDifficulties,
      setActiveDifficulties: (val) => {
        setCurrentPage(1);
        setActiveDifficulties(val);
      },

      activeRatings,
      setActiveRatings: (val) => {
        setCurrentPage(1);
        setActiveRatings(val);
      },

      specializations: uniqueSpecs,
      skills: uniqueSkills,

      searchQuery,
      setSearchQuery: (val) => {
        // Проверяем: если функция поиска вызвана из инпута (изменение текста), сбрасываем страницу на 1-ю
        setCurrentPage(1);
        setSearchQuery(val);
      }
    }
  };
}