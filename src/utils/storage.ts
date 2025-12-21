import type { QuestionsByTopic, CheckboxesState, GamesQuestionConfig, MillionaireQuestion } from '../types'

/**
 * Модуль для работы с localStorage
 */
export const Storage = {
  // Ключ для сохранения в localStorage
  STORAGE_KEY: 'questionPracticeData',
  CHECKBOXES_KEY: 'questionPracticeCheckboxes',
  GAMES_CONFIG_KEY: 'gamesQuestionConfig',
  MILLIONAIRE_KEY: 'millionaireQuestionsData',
  MILLIONAIRE_GAME_HISTORY_KEY: 'millionaireGameHistory',
  
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
  },

  /**
   * Сохраняет конфигурацию вопросов для игр
   */
  saveGamesConfig(config: GamesQuestionConfig): void {
    try {
      localStorage.setItem(this.GAMES_CONFIG_KEY, JSON.stringify(config))
    } catch (error) {
      console.warn('Не удалось сохранить конфигурацию игр:', error)
    }
  },

  /**
   * Загружает конфигурацию вопросов для игр
   */
  loadGamesConfig(): GamesQuestionConfig | null {
    try {
      const savedConfig = localStorage.getItem(this.GAMES_CONFIG_KEY)
      if (savedConfig) {
        return JSON.parse(savedConfig) as GamesQuestionConfig
      }
    } catch (error) {
      console.warn('Не удалось загрузить конфигурацию игр:', error)
    }
    return null
  },

  /**
   * Сохраняет вопросы для игры "Миллионер" в localStorage
   */
  saveMillionaireQuestions(questions: MillionaireQuestion[]): void {
    try {
      const dataToSave = {
        questions,
        timestamp: Date.now()
      }
      console.log('Сохранение вопросов миллионера в localStorage:', {
        count: questions.length,
        timestamp: dataToSave.timestamp
      })
      localStorage.setItem(this.MILLIONAIRE_KEY, JSON.stringify(dataToSave))
      console.log('Данные миллионера успешно сохранены в localStorage')
    } catch (error) {
      console.warn('Не удалось сохранить данные миллионера в localStorage:', error)
    }
  },

  /**
   * Загружает вопросы для игры "Миллионер" из localStorage
   */
  loadMillionaireQuestions(): MillionaireQuestion[] | null {
    try {
      const savedData = localStorage.getItem(this.MILLIONAIRE_KEY)
      console.log('Попытка загрузки вопросов миллионера из localStorage:', savedData ? 'данные найдены' : 'данные не найдены')
      if (savedData) {
        const parsed = JSON.parse(savedData) as {
          questions?: MillionaireQuestion[]
          timestamp?: number
        }
        console.log('Распарсенные данные миллионера:', parsed)
        // Проверяем, что данные не старше 7 дней
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
        if (parsed.timestamp && parsed.timestamp > sevenDaysAgo && parsed.questions) {
          console.log('Данные миллионера валидны, возвращаем:', parsed.questions.length, 'вопросов')
          return parsed.questions
        } else {
          console.log('Данные миллионера устарели или отсутствуют:', {
            hasTimestamp: !!parsed.timestamp,
            isRecent: parsed.timestamp ? parsed.timestamp > sevenDaysAgo : false,
            hasQuestions: !!parsed.questions
          })
        }
      }
    } catch (error) {
      console.warn('Не удалось загрузить данные миллионера из localStorage:', error)
    }
    return null
  },

  /**
   * Очищает данные миллионера из localStorage
   */
  clearMillionaireQuestions(): void {
    try {
      localStorage.removeItem(this.MILLIONAIRE_KEY)
      console.log('Данные миллионера очищены из localStorage')
    } catch (error) {
      console.warn('Не удалось очистить данные миллионера:', error)
    }
  },

  /**
   * Сохраняет историю использованных вопросов в первых 3 играх
   */
  saveMillionaireGameHistory(questionIds: number[]): void {
    try {
      const history = this.loadMillionaireGameHistory()
      history.push(questionIds)
      // Храним только последние 3 игры
      const recentHistory = history.slice(-3)
      localStorage.setItem(this.MILLIONAIRE_GAME_HISTORY_KEY, JSON.stringify(recentHistory))
      console.log('История игр миллионера сохранена:', recentHistory.length, 'игр')
    } catch (error) {
      console.warn('Не удалось сохранить историю игр миллионера:', error)
    }
  },

  /**
   * Загружает историю использованных вопросов в первых 3 играх
   */
  loadMillionaireGameHistory(): number[][] {
    try {
      const saved = localStorage.getItem(this.MILLIONAIRE_GAME_HISTORY_KEY)
      if (saved) {
        return JSON.parse(saved) as number[][]
      }
    } catch (error) {
      console.warn('Не удалось загрузить историю игр миллионера:', error)
    }
    return []
  },

  /**
   * Получает все использованные вопросы из первых 3 игр
   */
  getUsedQuestionIds(): Set<number> {
    const history = this.loadMillionaireGameHistory()
    const usedIds = new Set<number>()
    history.forEach(gameQuestions => {
      gameQuestions.forEach(id => usedIds.add(id))
    })
    return usedIds
  },

  /**
   * Очищает историю игр
   */
  clearMillionaireGameHistory(): void {
    try {
      localStorage.removeItem(this.MILLIONAIRE_GAME_HISTORY_KEY)
      console.log('История игр миллионера очищена')
    } catch (error) {
      console.warn('Не удалось очистить историю игр миллионера:', error)
    }
  }
}

