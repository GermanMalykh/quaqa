import type { Question, QuestionsByTopic, MillionaireQuestion } from '../types'
import { QuestionManager } from './questionManager'

/**
 * Конвертирует вопросы из формата XLSX в формат для игры "Миллионер"
 */
export const MillionaireQuestionConverter = {
  /**
   * Определяет сложность вопроса автоматически
   * - 1: короткие вопросы (до 50 символов)
   * - 2: средние вопросы (50-100 символов)
   * - 3: длинные вопросы (100-150 символов)
   * - 4: очень длинные вопросы (более 150 символов)
   */
  detectDifficulty(question: Question, indexInTopic: number, totalInTopic: number): 1 | 2 | 3 | 4 {
    // Если в XLSX есть колонка "Сложность", она будет использована
    // Здесь определяем автоматически
    const questionLength = question.question.length
    const answerLength = question.answer.length
    
    // Комбинируем длину вопроса и ответа
    const totalLength = questionLength + answerLength
    
    // Также учитываем позицию в теме (первые вопросы обычно проще)
    const positionFactor = indexInTopic / totalInTopic
    
    if (totalLength < 80 || positionFactor < 0.25) {
      return 1 // Легкий
    } else if (totalLength < 150 || positionFactor < 0.5) {
      return 2 // Средний
    } else if (totalLength < 250 || positionFactor < 0.75) {
      return 3 // Сложный
    } else {
      return 4 // Очень сложный
    }
  },

  /**
   * Генерирует неправильные ответы из других вопросов
   */
  generateWrongAnswers(
    correctAnswer: string,
    allQuestions: Question[],
    count: number = 3
  ): string[] {
    const wrongAnswers: string[] = []
    const usedAnswers = new Set<string>([correctAnswer.toLowerCase()])
    
    // Собираем все ответы из других вопросов
    const availableAnswers = allQuestions
      .map(q => q.answer.trim())
      .filter(answer => {
        const normalized = answer.toLowerCase()
        return normalized !== correctAnswer.toLowerCase() && 
               !usedAnswers.has(normalized) &&
               answer.length > 0
      })
    
    // Перемешиваем и берем нужное количество
    const shuffled = QuestionManager.getRandomItems(availableAnswers, count)
    
    // Если не хватает ответов, генерируем варианты
    while (wrongAnswers.length < count && shuffled.length > 0) {
      const answer = shuffled.shift()
      if (answer) {
        wrongAnswers.push(answer)
        usedAnswers.add(answer.toLowerCase())
      }
    }
    
    // Если все еще не хватает, создаем заглушки
    while (wrongAnswers.length < count) {
      wrongAnswers.push(`Вариант ${wrongAnswers.length + 1}`)
    }
    
    return wrongAnswers.slice(0, count)
  },

  /**
   * Конвертирует один вопрос в формат Millionaire
   */
  convertQuestion(
    question: Question,
    allQuestions: Question[],
    indexInTopic: number,
    totalInTopic: number
  ): MillionaireQuestion {
    const correctAnswer = question.answer.trim()
    
    // Используем неправильные ответы из XLSX, если они есть
    const wrongAnswersFromXLSX: string[] = []
    if (question.wrongAnswer1) wrongAnswersFromXLSX.push(question.wrongAnswer1)
    if (question.wrongAnswer2) wrongAnswersFromXLSX.push(question.wrongAnswer2)
    if (question.wrongAnswer3) wrongAnswersFromXLSX.push(question.wrongAnswer3)
    
    // Генерируем неправильные ответы
    const generatedWrongAnswers = wrongAnswersFromXLSX.length >= 3
      ? wrongAnswersFromXLSX.slice(0, 3)
      : this.generateWrongAnswers(correctAnswer, allQuestions, 3)
    
    // Используем сложность из XLSX, если есть, иначе определяем автоматически
    const questionDifficulty = question.difficulty && question.difficulty >= 1 && question.difficulty <= 4
      ? (question.difficulty as 1 | 2 | 3 | 4)
      : this.detectDifficulty(question, indexInTopic, totalInTopic)
    
    // Создаем массив ответов
    const answers = [
      { text: correctAnswer, isCorrect: true },
      ...generatedWrongAnswers.map(text => ({ text, isCorrect: false }))
    ]
    
    // Перемешиваем ответы
    const shuffledAnswers = QuestionManager.getRandomItems(answers, 4)
    
    return {
      id: Date.now() + Math.random(), // Уникальный ID
      text: question.question,
      answers: shuffledAnswers,
      difficulty: questionDifficulty
    }
  },

  /**
   * Конвертирует все вопросы из XLSX в формат Millionaire
   */
  convertQuestions(
    allQuestionsByTopic: QuestionsByTopic,
    selectedTopics?: string[]
  ): MillionaireQuestion[] {
    const allQuestions: Question[] = []
    
    // Собираем все вопросы из выбранных тем (или всех, если не указаны)
    const topicsToUse = selectedTopics && selectedTopics.length > 0
      ? selectedTopics
      : Object.keys(allQuestionsByTopic)
    
    topicsToUse.forEach(topicName => {
      if (allQuestionsByTopic[topicName]) {
        allQuestions.push(...allQuestionsByTopic[topicName])
      }
    })
    
    if (allQuestions.length === 0) {
      return []
    }
    
    // Конвертируем каждый вопрос
    const convertedQuestions: MillionaireQuestion[] = []
    
    Object.entries(allQuestionsByTopic).forEach(([topicName, questions]) => {
      if (selectedTopics && !selectedTopics.includes(topicName)) {
        return // Пропускаем невыбранные темы
      }
      
      questions.forEach((question, index) => {
        const converted = this.convertQuestion(
          question,
          allQuestions,
          index,
          questions.length
        )
        convertedQuestions.push(converted)
      })
    })
    
    return convertedQuestions
  }
}

