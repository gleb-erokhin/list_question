import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../../apiCondig';
import Parameters from '../Parameters/Parameters'
import Qestions from '../Questions/Questions'
import styles from './Main.module.css'

function Main() {
  const [questions, setQuestions] = useState([]);
  // Стейт фильтра: { type: 'specialization' | 'skill', id: number } или null
 // МАССИВ: хранит ID только активных специализаций, например: [1, 2]
  const [activeSpecializations, setActiveSpecializations] = useState([]);  
  const [activeSkills, setActiveSkills] = useState([]); 
  const [activeDifficulties, setActiveDifficulties] = useState([]); // Новый стейт для сложности
  const [activeRatings, setActiveRatings] = useState([]);

  useEffect(() => {
    // Делаем один запрос по твоему принципу склеивания строк
    axios.get(API_BASE + 'questions/public-questions')
      .then(response => {
        console.log('public-questions', response.data.data)
        setQuestions(response.data.data || []);
      })
      .catch(error => console.error('Ошибка при запросе:', error));
  }, []);

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
        {/* 4. Отдаем списку вопросов уже отфильтрованный массив */}
        <Qestions items={filteredQuestions} />
        {/* 5. Передаем списки и управление фильтром в блок параметров */}
        <Parameters 
          specializations={uniqueSpecs}
          activeSpecializations={activeSpecializations}
          setActiveSpecializations={setActiveSpecializations}

          skills={uniqueSkills}
          activeSkills={activeSkills}
          setActiveSkills={setActiveSkills}

          activeDifficulties={activeDifficulties}
          setActiveDifficulties={setActiveDifficulties}

          activeRatings={activeRatings}
          setActiveRatings={setActiveRatings}
        />
      </section>
    </main>
  )
}

export default Main