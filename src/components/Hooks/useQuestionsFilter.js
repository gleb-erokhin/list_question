// src/hooks/useQuestionsFilter.js
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { sanitizeAnswerContent } from '../utils/sanitizeContent';

export function useQuestionsFilter() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  // Храним ключ последнего завершённого запроса вместо синхронного setLoading(true)
  const [completedQueryKey, setCompletedQueryKey] = useState('');

  // Справочники для блока Parameters (не зависят от текущей страницы)
  const [uniqueSpecs, setUniqueSpecs] = useState([]);
  const [uniqueSkills, setUniqueSkills] = useState([]);

  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Активные фильтры
  const [activeSpecializations, setActiveSpecializations] = useState([]);
  const [activeSkills, setActiveSkills] = useState([]);
  const [activeDifficulties, setActiveDifficulties] = useState([]);
  const [activeRatings, setActiveRatings] = useState([]);
  const [activeStatus, setActiveStatus] = useState('Все');

  // Поиск с дебаунсом
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const debounceTimerRef = useRef(null);

  // 1. Загрузка полных справочников специализаций и навыков (1 раз при старте)
  useEffect(() => {
    const fetchDictionaries = async () => {
      try {
        const [specsRes, skillsRes] = await Promise.all([
          axios.get('/api/specializations'),
          axios.get('/api/skills'),
        ]);

        const rawSpecs = Array.isArray(specsRes.data)
          ? specsRes.data
          : specsRes.data?.data || [];

        const rawSkills = Array.isArray(skillsRes.data)
          ? skillsRes.data
          : skillsRes.data?.data || [];

        setUniqueSpecs(rawSpecs);
        setUniqueSkills(rawSkills);
      } catch (err) {
        console.error('Ошибка загрузки справочников:', err);
      }
    };

    fetchDictionaries();
  }, []);

  // 2. Дебаунс поискового запроса (400 мс)
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);

    return () => clearTimeout(debounceTimerRef.current);
  }, [searchQuery]);

  // Вычисляем параметры и уникальный ключ запроса прямо при рендере
  const expandedComplexities = activeDifficulties.flatMap((range) => {
    const [min, max] = range.split('-').map((num) => parseInt(num.trim(), 10));
    const result = [];
    for (let i = min; i <= max; i++) {
      result.push(i);
    }
    return result;
  });

  const queryParams = {
    page: currentPage,
    limit: 10,
    ...(debouncedSearchQuery.trim() && { title: debouncedSearchQuery.trim() }),
    ...(activeSpecializations.length > 0 && { specializationId: activeSpecializations.join(',') }),
    ...(activeSkills.length > 0 && { skills: activeSkills.join(',') }),
    ...(expandedComplexities.length > 0 && { complexity: expandedComplexities.join(',') }),
    ...(activeRatings.length > 0 && { rate: activeRatings.join(',') }),
  };

  const currentQueryKey = JSON.stringify(queryParams);
  // Пока ключ текущего запроса не совпал с завершённым — идёт загрузка (без лишнего ререндера!)
  const loading = completedQueryKey !== currentQueryKey;

  // 3. Серверная фильтрация и пагинация вопросов с двойной защитой от гонки
  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    axios
      .get('/api/questions/public-questions', {
        params: JSON.parse(currentQueryKey),
        signal: controller.signal,
      })
      .then((response) => {
        if (!isActive) return;

        const rawData = response.data?.data || [];
        const sanitizedData = rawData.map((item, index) => ({
          ...item,
          shortAnswer: sanitizeAnswerContent(item.shortAnswer),
          longAnswer: sanitizeAnswerContent(item.longAnswer),
          isLearned: typeof item.isLearned === 'boolean' ? item.isLearned : index % 2 === 0,
        }));

        setQuestions(sanitizedData);
        setError(null);

        const totalItems = response.data?.total || 0;
        const limitPerPage = response.data?.limit || 10;
        setTotalPages(Math.max(1, Math.ceil(totalItems / limitPerPage)));
        setCompletedQueryKey(currentQueryKey);
      })
      .catch((err) => {
        // Игнорируем отмену запроса и устаревшие эффекты
        if (!isActive || axios.isCancel(err) || err.name === 'CanceledError') return;

        console.error('Ошибка при получении вопросов:', err);
        setError('Не удалось загрузить вопросы.');
        setCompletedQueryKey(currentQueryKey);
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [currentQueryKey]);

  // Пост-фильтрация по статусу (пока нет JWT-авторизации)
  const filteredQuestions = questions.filter((question) => {
    if (activeStatus === 'Изученные') return question.isLearned === true;
    if (activeStatus === 'Не изученные') return question.isLearned === false;
    return true;
  });

  // Декоратор для сброса текущей страницы на 1 при изменении любого фильтра
  const createFilterSetter = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  const filterState = {
    specializations: uniqueSpecs,
    skills: uniqueSkills,
    activeSpecializations,
    setActiveSpecializations: createFilterSetter(setActiveSpecializations),
    activeSkills,
    setActiveSkills: createFilterSetter(setActiveSkills),
    activeDifficulties,
    setActiveDifficulties: createFilterSetter(setActiveDifficulties),
    activeRatings,
    setActiveRatings: createFilterSetter(setActiveRatings),
    activeStatus,
    setActiveStatus: createFilterSetter(setActiveStatus),
    searchQuery,
    setSearchQuery: createFilterSetter(setSearchQuery),
  };

  return {
    filteredQuestions,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    filterState,
  };
}
export default useQuestionsFilter;