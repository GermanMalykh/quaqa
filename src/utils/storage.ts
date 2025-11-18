import type { QuestionsByTopic, CheckboxesState } from '../types'

/**
 * Модуль для работы с localStorage
 */
export const Storage = {
  // Ключ для сохранения в localStorage
  STORAGE_KEY: 'questionPracticeData',
  CHECKBOXES_KEY: 'questionPracticeCheckboxes',
  
  /**
   * Сохраняет вопросы в localStorage
   */
  saveQuestions(allQuestionsByTopic: QuestionsByTopic): void {
    try {
      const dataToSave = {
        allQuestionsByTopic,
        timestamp: Date.now()
      }
      console.log('Сохранение в localStorage:', {
        topics: Object.keys(allQuestionsByTopic).length,
        timestamp: dataToSave.timestamp
      })
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave))
      console.log('Данные успешно сохранены в localStorage')
    } catch (error) {
      console.warn('Не удалось сохранить данные в localStorage:', error)
    }
  },
  
  /**
   * Загружает вопросы из localStorage
   */
  loadQuestions(): QuestionsByTopic | null {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY)
      console.log('Попытка загрузки из localStorage:', savedData ? 'данные найдены' : 'данные не найдены')
      if (savedData) {
        const parsed = JSON.parse(savedData) as {
          allQuestionsByTopic?: QuestionsByTopic
          timestamp?: number
        }
        console.log('Распарсенные данные:', parsed)
        // Проверяем, что данные не старше 7 дней
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
        if (parsed.timestamp && parsed.timestamp > sevenDaysAgo && parsed.allQuestionsByTopic) {
          console.log('Данные валидны, возвращаем:', Object.keys(parsed.allQuestionsByTopic).length, 'тем')
          return parsed.allQuestionsByTopic
        } else {
          console.log('Данные устарели или отсутствуют:', {
            hasTimestamp: !!parsed.timestamp,
            isRecent: parsed.timestamp ? parsed.timestamp > sevenDaysAgo : false,
            hasQuestions: !!parsed.allQuestionsByTopic
          })
        }
      }
    } catch (error) {
      console.warn('Не удалось загрузить данные из localStorage:', error)
    }
    return null
  },
  
  /**
   * Сохраняет состояние чекбоксов
   */
  saveCheckboxesState(checkboxesState: CheckboxesState): void {
    try {
      localStorage.setItem(this.CHECKBOXES_KEY, JSON.stringify(checkboxesState))
    } catch (error) {
      console.warn('Не удалось сохранить состояние чекбоксов:', error)
    }
  },
  
  /**
   * Загружает состояние чекбоксов
   */
  loadCheckboxesState(): CheckboxesState {
    try {
      const savedCheckboxesData = localStorage.getItem(this.CHECKBOXES_KEY)
      if (savedCheckboxesData) {
        return JSON.parse(savedCheckboxesData) as CheckboxesState
      }
    } catch (error) {
      console.warn('Не удалось загрузить состояние чекбоксов:', error)
    }
    return {}
  }
}

