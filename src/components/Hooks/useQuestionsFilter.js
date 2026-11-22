// src/components/Hooks/useQuestionsFilter.js
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { sanitizeAnswerContent } from '../utils/sanitizeContent';

// Хелпер для парсинга списка числовых ID из URL (например, "1,5" ->)
const parseNumberArrayParam = (paramValue) => {
  if (!paramValue) return [];
  return paramValue
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((num) => !Number.isNaN(num) && num > 0);
};

// Хелпер для парсинга строковых массивов из URL (например, "1-3,7-8" -> ['1-3', '7-8'])
const parseStringArrayParam = (paramValue) => {
  if (!paramValue) return [];
  return paramValue
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

export function useQuestionsFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [completedQueryKey, setCompletedQueryKey] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  // Справочники для блока Parameters
  const [uniqueSpecs, setUniqueSpecs] = useState([]);
  const [uniqueSkills, setUniqueSkills] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // 1. ЧИТАЕМ СОСТОЯНИЕ НАПРЯМУЮ ИЗ URL (Единый источник истины)
  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);
  const urlTitle = searchParams.get('title') || '';
  const activeSpecializations = parseNumberArrayParam(searchParams.get('specializationId'));
  const activeSkills = parseNumberArrayParam(searchParams.get('skills'));
  const activeDifficulties = parseStringArrayParam(searchParams.get('difficulty'));
  const activeRatings = parseNumberArrayParam(searchParams.get('rate'));
  const activeStatus = searchParams.get('status') || 'Все';

  // Локальный стейт для мгновенного отклика поля ввода (синхронизируется с URL через дебаунс)
  const [searchQuery, setSearchQuery] = useState(urlTitle);
  const [prevUrlTitle, setPrevUrlTitle] = useState(urlTitle);
  const debounceTimerRef = useRef(null);

  // Синхронизируем локальный инпут, если URL изменился извне (например, кнопкой «Назад» в браузере или сбросом)
  if (urlTitle !== prevUrlTitle) {
    setPrevUrlTitle(urlTitle);
    setSearchQuery(urlTitle);
  }

  // Хелпер обновления query-параметров в URL
  const updateUrlParams = (updaterFn, options = { replace: false }) => {
    setSearchParams(
      (prevParams) => {
        const nextParams = new URLSearchParams(prevParams);
        updaterFn(nextParams);
        return nextParams;
      },
      options
    );
  };

  // 2. Загрузка справочников (1 раз при старте)
  useEffect(() => {
    const controller = new AbortController();

    const fetchDictionaries = async () => {
      try {
        const [specsRes, skillsRes] = await Promise.all([
          axios.get('/api/specializations', { signal: controller.signal }),
          axios.get('/api/skills', { signal: controller.signal }),
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
        if (!axios.isCancel(err) && err.name !== 'CanceledError') {
          console.error('Ошибка загрузки справочников:', err);
        }
      }
    };

    fetchDictionaries();
    return () => controller.abort();
  }, []);

  // 3. Дебаунс записи поискового запроса в URL (400 мс)
  useEffect(() => {
    if (searchQuery === urlTitle) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      updateUrlParams(
        (params) => {
          const trimmed = searchQuery.trim();
          if (trimmed) {
            params.set('title', trimmed);
          } else {
            params.delete('title');
          }
          // При новом поиске сбрасываем страницу на 1
          params.delete('page');
        },
        { replace: true } // replace: true, чтобы ввод текста не засорял историю браузера
      );
    }, 400);

    return () => clearTimeout(debounceTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, urlTitle]);

  // 4. Формируем параметры для API-запроса на основе данных из URL
  const expandedComplexities = activeDifficulties.flatMap((range) => {
    const [min, max] = range.split('-').map((num) => parseInt(num.trim(), 10));
    const result = [];
    for (let i = min; i <= max; i++) {
      result.push(i);
    }
    return result;
  });

  const apiParams = {
    page: currentPage,
    limit: 10,
    ...(urlTitle && { title: urlTitle }),
    ...(activeSpecializations.length > 0 && { specializationId: activeSpecializations.join(',') }),
    ...(activeSkills.length > 0 && { skills: activeSkills.join(',') }),
    ...(expandedComplexities.length > 0 && { complexity: expandedComplexities.join(',') }),
    ...(activeRatings.length > 0 && { rate: activeRatings.join(',') }),
  };

  const currentQueryKey = JSON.stringify({ ...apiParams, retryCount });
  const loading = completedQueryKey !== currentQueryKey;

  // 5. Серверный запрос вопросов
  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    axios
      .get('/api/questions/public-questions', {
        params: apiParams,
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
        if (!isActive || axios.isCancel(err) || err.name === 'CanceledError') return;

        console.error('Ошибка при получении вопросов:', err);
        setQuestions([]);
        setTotalPages(1);
        setError('Не удалось загрузить список вопросов. Проверьте соединение с сервером.');
        setCompletedQueryKey(currentQueryKey);
      });

    return () => {
      isActive = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQueryKey]);

  // Пост-фильтрация по статусу
  const filteredQuestions = questions.filter((question) => {
    if (activeStatus === 'Изученные') return question.isLearned === true;
    if (activeStatus === 'Не изученные') return question.isLearned === false;
    return true;
  });

  // Сеттеры фильтров (поддерживают как прямое значение, так и функциональный коллбэк prev => next)
  const createArrayUrlSetter = (paramKey, currentArray) => (valueOrUpdater) => {
    const nextArray =
      typeof valueOrUpdater === 'function' ? valueOrUpdater(currentArray) : valueOrUpdater;

    updateUrlParams((params) => {
      if (Array.isArray(nextArray) && nextArray.length > 0) {
        params.set(paramKey, nextArray.join(','));
      } else {
        params.delete(paramKey);
      }
      params.delete('page'); // Сбрасываем на 1-ю страницу при смене фильтра
    });
  };

  const setActiveStatus = (nextStatus) => {
    updateUrlParams((params) => {
      if (nextStatus && nextStatus !== 'Все') {
        params.set('status', nextStatus);
      } else {
        params.delete('status');
      }
      params.delete('page');
    });
  };

  // Сеттер пагинации (поддерживает и число, и prev => prev + 1)
  const setCurrentPage = (pageOrUpdater) => {
    const nextPage =
      typeof pageOrUpdater === 'function' ? pageOrUpdater(currentPage) : pageOrUpdater;

    updateUrlParams((params) => {
      if (nextPage > 1) {
        params.set('page', String(nextPage));
      } else {
        params.delete('page'); // Для 1-й страницы держим URL чистым
      }
    });
  };

  const retry = () => {
    setRetryCount((prev) => prev + 1);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  const filterState = {
    specializations: uniqueSpecs,
    skills: uniqueSkills,
    activeSpecializations,
    setActiveSpecializations: createArrayUrlSetter('specializationId', activeSpecializations),
    activeSkills,
    setActiveSkills: createArrayUrlSetter('skills', activeSkills),
    activeDifficulties,
    setActiveDifficulties: createArrayUrlSetter('difficulty', activeDifficulties),
    activeRatings,
    setActiveRatings: createArrayUrlSetter('rate', activeRatings),
    activeStatus,
    setActiveStatus,
    searchQuery,
    setSearchQuery,
  };

  return {
    filteredQuestions,
    loading,
    error,
    retry,
    resetAllFilters,
    currentPage,
    totalPages,
    setCurrentPage,
    filterState,
  };
}

export default useQuestionsFilter;
