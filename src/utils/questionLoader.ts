import type { MillionaireQuestion } from '@/types'
import { MillionaireQuestionConverter } from './millionaireQuestionConverter'
import { Storage } from './storage'

export const QuestionLoader = {
  /**
   * Загружает вопросы для игры "Миллионер" из XLSX (через localStorage)
   * или из JSON файла (fallback)
   */
  async loadQuestions(): Promise<MillionaireQuestion[]> {
    // Пытаемся загрузить из XLSX (через localStorage)
    const savedData = Storage.loadQuestions()
    
    if (savedData && Object.keys(savedData).length > 0) {
      // Конвертируем вопросы из XLSX формата в формат Millionaire
      const convertedQuestions = MillionaireQuestionConverter.convertQuestions(savedData)
      
      if (convertedQuestions.length > 0) {
        return convertedQuestions
      }
    }
    
    // Fallback: загружаем из JSON файла (для обратной совместимости)
    try {
      const basePath = import.meta.env.BASE_URL || '/'
      const questionsPath = `${basePath}questions.json`
      const response = await fetch(questionsPath)
      if (response.ok) {
        return (await response.json()) as MillionaireQuestion[]
      }
    } catch (error) {
      console.warn('Не удалось загрузить questions.json:', error)
    }
    
    // Если ничего не загрузилось, возвращаем пустой массив
    throw new Error('Нет доступных вопросов. Загрузите XLSX файл с вопросами в разделе "Вопросы".')
  },
  
  /**
   * Загружает вопросы из конкретных тем
   */
  async loadQuestionsFromTopics(selectedTopics: string[]): Promise<MillionaireQuestion[]> {
    const savedData = Storage.loadQuestions()
    
    if (!savedData || Object.keys(savedData).length === 0) {
      throw new Error('Нет загруженных вопросов. Загрузите XLSX файл с вопросами.')
    }
    
    if (selectedTopics.length === 0) {
      // Если темы не указаны, используем все доступные
      return this.loadQuestions()
    }
    
    // Конвертируем вопросы только из выбранных тем
    const convertedQuestions = MillionaireQuestionConverter.convertQuestions(savedData, selectedTopics)
    
    if (convertedQuestions.length === 0) {
      throw new Error('Нет вопросов в выбранных темах.')
    }
    
    return convertedQuestions
  }
}

