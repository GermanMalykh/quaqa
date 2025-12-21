import type { MillionaireQuestion } from '@/types'

export const QuestionSelector = {
  /**
   * Выбирает вопросы для игры "Миллионер":
   * - Первые 5 вопросов — легкие (difficulty: 1)
   * - 6-10 — средние (difficulty: 2)
   * - 11-15 — сложные (difficulty: 3)
   * @param questions - все доступные вопросы
   * @param excludeIds - ID вопросов, которые нужно исключить (для первых 3 игр)
   */
  selectByDifficulty(questions: MillionaireQuestion[], excludeIds: Set<number> = new Set()): MillionaireQuestion[] {
    const questionsByDifficulty: { [key: number]: MillionaireQuestion[] } = {
      1: [], // Легкие
      2: [], // Средние
      3: [], // Сложные
      4: [], // Очень сложные (используем как сложные)
    }

    // Группируем вопросы по сложности, исключая использованные в первых 3 играх
    questions.forEach((q) => {
      // Пропускаем вопросы, которые были использованы в первых 3 играх
      if (excludeIds.size > 0 && excludeIds.has(q.id)) {
        return
      }
      const difficulty = q.difficulty
      if (questionsByDifficulty[difficulty]) {
        questionsByDifficulty[difficulty].push(q)
      }
    })

    // Если нет вопросов сложности 3, используем 4 как сложные
    if (questionsByDifficulty[3].length === 0) {
      questionsByDifficulty[3] = questionsByDifficulty[4]
    }

    const selected: MillionaireQuestion[] = []

    // Функция для случайного выбора вопроса из массива
    const getRandomQuestion = (available: MillionaireQuestion[]): MillionaireQuestion | null => {
      if (available.length === 0) return null
      const randomIndex = Math.floor(Math.random() * available.length)
      return available[randomIndex]
    }

    // Выбираем 5 легких вопросов (difficulty: 1)
    for (let i = 0; i < 5; i++) {
      const question = getRandomQuestion(questionsByDifficulty[1])
      if (question) {
        selected.push(question)
        // Удаляем выбранный вопрос, чтобы не повторяться
        const index = questionsByDifficulty[1].indexOf(question)
        if (index > -1) {
          questionsByDifficulty[1].splice(index, 1)
        }
      } else {
        // Если не хватает легких, берем из средних
        const question = getRandomQuestion(questionsByDifficulty[2])
        if (question) {
          selected.push(question)
          const index = questionsByDifficulty[2].indexOf(question)
          if (index > -1) {
            questionsByDifficulty[2].splice(index, 1)
          }
        }
      }
    }

    // Выбираем 5 средних вопросов (difficulty: 2)
    for (let i = 0; i < 5; i++) {
      const question = getRandomQuestion(questionsByDifficulty[2])
      if (question) {
        selected.push(question)
        const index = questionsByDifficulty[2].indexOf(question)
        if (index > -1) {
          questionsByDifficulty[2].splice(index, 1)
        }
      } else {
        // Если не хватает средних, берем из сложных
        const question = getRandomQuestion(questionsByDifficulty[3])
        if (question) {
          selected.push(question)
          const index = questionsByDifficulty[3].indexOf(question)
          if (index > -1) {
            questionsByDifficulty[3].splice(index, 1)
          }
        }
      }
    }

    // Выбираем 5 сложных вопросов (difficulty: 3)
    for (let i = 0; i < 5; i++) {
      const question = getRandomQuestion(questionsByDifficulty[3])
      if (question) {
        selected.push(question)
        const index = questionsByDifficulty[3].indexOf(question)
        if (index > -1) {
          questionsByDifficulty[3].splice(index, 1)
        }
      } else {
        // Если не хватает сложных, берем из средних
        const question = getRandomQuestion(questionsByDifficulty[2])
        if (question) {
          selected.push(question)
          const index = questionsByDifficulty[2].indexOf(question)
          if (index > -1) {
            questionsByDifficulty[2].splice(index, 1)
          }
        }
      }
    }

    // Если не набрали 15 вопросов, дополняем из всех доступных
    if (selected.length < 15) {
      const allRemaining = [
        ...questionsByDifficulty[1],
        ...questionsByDifficulty[2],
        ...questionsByDifficulty[3],
        ...questionsByDifficulty[4]
      ]
      
      while (selected.length < 15 && allRemaining.length > 0) {
        const randomIndex = Math.floor(Math.random() * allRemaining.length)
        selected.push(allRemaining.splice(randomIndex, 1)[0])
      }
    }

    return selected.length === 15 ? selected : questions.slice(0, 15)
  },
}

