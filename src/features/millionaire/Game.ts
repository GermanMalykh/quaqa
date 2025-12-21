import type {
  MillionaireQuestion,
  Lifeline,
  MillionaireGameState,
  MillionaireGameProgress,
} from '@/types'
import { QuestionSelector } from '@/utils/questionSelector'
import { ArrayUtils } from '@/utils/arrayUtils'
import { LifelineUtils, type LifelineResult } from '@/utils/lifelineUtils'

export class Game {
  private questions: MillionaireQuestion[] = []
  private currentQuestionIndex: number = 0
  private score: number = 0
  private lifelines: Lifeline[]
  private selectedAnswer: number | null = null
  private state: MillionaireGameState = 'start'
  private shuffledAnswers: number[] = []
  private questionsData: MillionaireQuestion[] = []

  // Призовые суммы для каждого уровня (15 вопросов)
  private readonly prizeLevels = [
    0,        // Старт
    100,      // 1
    200,      // 2
    300,      // 3
    500,      // 4
    1000,     // 5 (первая несгораемая сумма)
    2000,     // 6
    4000,     // 7
    8000,     // 8
    15000,    // 9
    15000,    // 10 (вторая несгораемая сумма)
    35000,    // 11
    75000,    // 12
    150000,   // 13
    300000,   // 14
    1000000   // 15 (главный приз - миллион!)
  ]

  constructor() {
    this.lifelines = [
      { id: '50-50', name: '50:50', used: false },
      { id: 'phone', name: 'Звонок другу', used: false },
      { id: 'audience', name: 'Помощь зала', used: false },
    ]
  }

  async loadQuestions(questionsData: MillionaireQuestion[], excludeIds: Set<number> = new Set()): Promise<void> {
    this.questionsData = questionsData
    this.questions = QuestionSelector.selectByDifficulty(this.questionsData, excludeIds)
  }

  getSelectedQuestionIds(): number[] {
    return this.questions.map(q => q.id)
  }

  start(): void {
    this.state = 'playing'
    this.currentQuestionIndex = 0
    this.score = 0
    this.selectedAnswer = null
    this.lifelines.forEach((l) => (l.used = false))
    this.shuffleAnswers()
  }

  getCurrentQuestion(): MillionaireQuestion | null {
    return this.questions[this.currentQuestionIndex] || null
  }

  getProgress(): MillionaireGameProgress {
    return {
      currentQuestionIndex: this.currentQuestionIndex,
      score: this.score,
      lifelines: [...this.lifelines],
      selectedAnswer: this.selectedAnswer,
    }
  }

  getState(): MillionaireGameState {
    return this.state
  }

  getPrize(): number {
    return this.prizeLevels[this.currentQuestionIndex]
  }

  getShuffledAnswers(): number[] {
    return [...this.shuffledAnswers]
  }

  private shuffleAnswers(): void {
    const question = this.getCurrentQuestion()
    if (!question) return

    this.shuffledAnswers = ArrayUtils.shuffle([0, 1, 2, 3])
  }

  selectAnswer(answerIndex: number): boolean {
    const question = this.getCurrentQuestion()
    if (!question || this.state !== 'playing') return false

    const originalIndex = this.shuffledAnswers[answerIndex]
    this.selectedAnswer = originalIndex
    this.state = 'answer-selected'

    const isCorrect = question.answers[originalIndex].isCorrect

    if (isCorrect) {
      this.score = this.prizeLevels[this.currentQuestionIndex + 1]

      if (this.currentQuestionIndex === 14) {
        // 15-й вопрос (индекс 14) - победа! Миллион!
        this.state = 'won'
      } else {
        // Переход к следующему вопросу будет обработан в компоненте
        // Не меняем состояние здесь, чтобы компонент мог отреагировать
      }
    } else {
      // Неправильный ответ - проигрыш
      // Если ответили неправильно на 5-м вопросе или раньше - получаем 0
      // Если на 6-9 - получаем 1000 (первая несгораемая сумма)
      // Если на 10-14 - получаем 15000 (вторая несгораемая сумма)
      if (this.currentQuestionIndex < 5) {
        // Неправильный ответ на вопросах 1-5 - получаем 0
        this.score = 0
      } else if (this.currentQuestionIndex < 10) {
        // Неправильный ответ на вопросах 6-9 - получаем 1000 (первая несгораемая сумма)
        this.score = 1000
      } else {
        // Неправильный ответ на вопросах 10-14 - получаем 15000 (вторая несгораемая сумма)
        this.score = 15000
      }
      
      this.state = 'lost'
    }

    return isCorrect
  }

  useLifeline(lifelineId: string): boolean {
    const lifeline = this.lifelines.find((l) => l.id === lifelineId)
    if (!lifeline || lifeline.used || this.state !== 'playing') {
      return false
    }

    lifeline.used = true
    return true
  }

  getLifelineResult(lifelineId: string): LifelineResult {
    const question = this.getCurrentQuestion()
    if (!question) return null

    switch (lifelineId) {
      case '50-50':
        return LifelineUtils.generate5050(question)
      case 'phone':
        return LifelineUtils.generatePhone(question)
      case 'audience':
        return LifelineUtils.generateAudience(question)
      default:
        return null
    }
  }

  canUseLifeline(lifelineId: string): boolean {
    const lifeline = this.lifelines.find((l) => l.id === lifelineId)
    return lifeline !== undefined && !lifeline.used && this.state === 'playing'
  }

  nextQuestion(): void {
    this.currentQuestionIndex++
    this.selectedAnswer = null
    this.shuffleAnswers()
    this.state = 'playing'
  }
}

