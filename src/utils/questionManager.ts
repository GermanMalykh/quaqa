import type { Question, QuestionsByTopic } from '../types'

/**
 * Результат обновления выбранных вопросов
 */
export interface UpdateQuestionsResult {
  questions: Question[]
  totalQuestions: number
  selectedTopicsCount: number
}

/**
 * Результат получения случайного вопроса
 */
export interface RandomQuestionResult {
  index: number
  question: Question | null
  usedIndices: number[]
}

/**
 * Модуль для управления вопросами
 */
export const QuestionManager = {
  /**
   * Получает случайные элементы из массива
   */
  getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(count, shuffled.length))
  },
  
  /**
   * Обновляет выбранные вопросы на основе выбранных тем
   */
  updateSelectedQuestions(
    allQuestionsByTopic: QuestionsByTopic,
    selectedTopics: string[]
  ): UpdateQuestionsResult {
    const allQuestions: Question[] = []
    
    selectedTopics.forEach(topicName => {
      if (allQuestionsByTopic[topicName]) {
        // Выбираем 10 случайных вопросов из выбранной темы
        const selectedQuestions = this.getRandomItems(allQuestionsByTopic[topicName], 10)
        allQuestions.push(...selectedQuestions)
      }
    })
    
    return {
      questions: allQuestions,
      totalQuestions: allQuestions.length,
      selectedTopicsCount: selectedTopics.length
    }
  },
  
  /**
   * Получает случайный вопрос
   */
  getRandomQuestion(
    questions: Question[],
    usedQuestionIndices: number[]
  ): RandomQuestionResult {
    if (usedQuestionIndices.length >= questions.length) {
      return { index: -1, question: null, usedIndices: [] }
    }
    
    // Оптимизированный выбор случайного вопроса с использованием Set для быстрой проверки
    const usedSet = new Set(usedQuestionIndices)
    const availableIndices: number[] = []
    
    for (let i = 0; i < questions.length; i++) {
      if (!usedSet.has(i)) {
        availableIndices.push(i)
      }
    }
    
    // Выбираем случайный индекс из доступных
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
    const newUsedIndices = [...usedQuestionIndices, randomIndex]
    
    return {
      index: randomIndex,
      question: questions[randomIndex],
      usedIndices: newUsedIndices
    }
  },
  
  /**
   * Получает количество вопросов в теме
   */
  getTopicQuestionCount(allQuestionsByTopic: QuestionsByTopic, topicName: string): number {
    return allQuestionsByTopic[topicName] ? allQuestionsByTopic[topicName].length : 0
  }
}

