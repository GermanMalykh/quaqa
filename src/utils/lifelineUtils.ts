import type { MillionaireQuestion } from '@/types'

export interface Lifeline5050Result {
  removeIndices: number[]
}

export interface LifelinePhoneResult {
  suggestion: number
  confidence: number
}

export interface LifelineAudienceResult {
  percentages: number[]
}

export type LifelineResult =
  | Lifeline5050Result
  | LifelinePhoneResult
  | LifelineAudienceResult
  | null

export const LifelineUtils = {
  /**
   * Генерирует результат для подсказки 50:50
   */
  generate5050(question: MillionaireQuestion): Lifeline5050Result {
    const correctIndex = question.answers.findIndex((a) => a.isCorrect)
    const wrongAnswers: number[] = []

    question.answers.forEach((a, i) => {
      if (!a.isCorrect && i !== correctIndex) {
        wrongAnswers.push(i)
      }
    })

    // Случайно выбираем 2 неправильных для удаления
    const shuffled = [...wrongAnswers].sort(() => 0.5 - Math.random())
    const toRemove = shuffled.slice(0, 2)

    return { removeIndices: toRemove }
  },

  /**
   * Генерирует результат для подсказки "Звонок другу"
   */
  generatePhone(question: MillionaireQuestion): LifelinePhoneResult {
    const correctIdx = question.answers.findIndex((a) => a.isCorrect)
    return {
      suggestion: correctIdx,
      confidence: Math.floor(Math.random() * 20) + 70, // 70-90% уверенности
    }
  },

  /**
   * Генерирует результат для подсказки "Помощь зала"
   */
  generateAudience(question: MillionaireQuestion): LifelineAudienceResult {
    const correct = question.answers.findIndex((a) => a.isCorrect)
    const percentages = [0, 0, 0, 0]

    // Правильный ответ получает 60-80%
    percentages[correct] = Math.floor(Math.random() * 20) + 60
    let remaining = 100 - percentages[correct]

    // Остальные ответы делят оставшиеся проценты
    for (let i = 0; i < 4; i++) {
      if (i !== correct) {
        const percent = Math.floor((Math.random() * remaining) / 3)
        percentages[i] = percent
        remaining -= percent
      }
    }

    // Остаток добавляем к правильному
    percentages[correct] += remaining

    return { percentages }
  },
}

