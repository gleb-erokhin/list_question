import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../../apiCondig';
import Parameters from '../Parameters/Parameters'
import Qestions from '../Questions/Questions'
import styles from './Main.module.css'

function Main() {
  const [questions, setQuestions] = useState([]);
  // Стейт фильтра: { type: 'specialization' | 'skill', id: number } или null
  const [activeFilter, setActiveFilter] = useState(null); 

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
      console.log('spec', spec)
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

  // ВРЕМЕННЫЙ ТЕСТ: искусственно добавляем 6-й и 7-й элементы
  // uniqueSpecs.push({ id: 999, title: 'Тестовый тег 1' });
  // uniqueSpecs.push({ id: 888, title: 'Тестовый тег 2' });

  // 3. Логика фильтрации: отсекаем вопросы, не подходящие под фильтр
  const filteredQuestions = questions.filter(question => {
    if (!activeFilter) return true; // Показать все

    if (activeFilter.type === 'specialization') {
      return question.questionSpecializations?.some(s => s.id === activeFilter.id);
    }
    if (activeFilter.type === 'skill') {
      return question.questionSkills?.some(s => s.id === activeFilter.id);
    }
    return true;
  });

  console.log('1. Родоначальник uniqueSpecs:', uniqueSpecs);

  return (
    <main className={styles.main}>
      <section className={styles.main__wrapper}>
        {/* 4. Отдаем списку вопросов уже отфильтрованный массив */}
        <Qestions items={filteredQuestions} />
        {/* 5. Передаем списки и управление фильтром в блок параметров */}
        <Parameters 
          specializations={uniqueSpecs}
          skills={uniqueSkills}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </section>
    </main>
  )
}

export default Main