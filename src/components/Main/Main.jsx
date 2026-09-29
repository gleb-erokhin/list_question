import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../../apiCondig';
import Parameters from '../Parameters/Parameters'
import Qestions from '../Questions/Questions'
import styles from './Main.module.css'

function Main() {
  const [questions, setQuestions] = useState([]);
  // Стейт фильтра: { type: 'specialization' | 'skill', id: number } или null
 // ТЕПЕРЬ ЭТО МАССИВ: хранит ID только активных специализаций, например: [1, 2]
  const [activeSpecializations, setActiveSpecializations] = useState([]);  

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

  const filteredQuestions = questions.filter(question => {
    // 1. Если фильтры не выбраны — показываем все 10 вопросов
    if (activeSpecializations.length === 0) return true;

    // 2. Переводим все выбранные в фильтре ID в строки для безопасности ("11")
    const stringActiveIds = activeSpecializations.map(id => id.toString());

    // 3. Проверяем вложенный массив специализаций вопроса
    const hasMatch = question.questionSpecializations?.some(spec => {
      if (!spec || !spec.id) return false;

      // Сравниваем строго как строки, чтобы избежать проблем с типами данных
      return stringActiveIds.includes(spec.id.toString());
    });

    // ВРЕМЕННЫЙ ЛОГ: Показывает логику для каждого вопроса в консоли
    console.log(
      `Вопрос ID: ${question.id}, Ищет совпадение для:`, stringActiveIds, 
      `У вопроса есть ID специализаций:`, question.questionSpecializations?.map(s => s.id?.toString()),
      `Результат проверки:`, hasMatch
    );

    return hasMatch;
  });


  return (
    <main className={styles.main}>
      <section className={styles.main__wrapper}>
        {/* 4. Отдаем списку вопросов уже отфильтрованный массив */}
        <Qestions items={filteredQuestions} />
        {/* 5. Передаем списки и управление фильтром в блок параметров */}
        <Parameters 
          specializations={uniqueSpecs}
          skills={uniqueSkills}
          activeSpecializations={activeSpecializations}
          setActiveSpecializations={setActiveSpecializations}
        />
      </section>
    </main>
  )
}

export default Main