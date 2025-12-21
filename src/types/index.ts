/**
 * Типы для вопросов
 */
export interface Question {
  category: string
  question: string
  answer: string
  explanation?: string
  // Опциональные поля для игры "Миллионер"
  difficulty?: number // 1-4
  wrongAnswer1?: string
  wrongAnswer2?: string
  wrongAnswer3?: string
}

/**
 * Структура вопросов по темам
 */
export type QuestionsByTopic = Record<string, Question[]>

/**
 * Статистика листа
 */
export interface SheetStat {
  name: string
  total: number
}

/**
 * Результат загрузки XLSX
 */
export interface XLSXLoadResult {
  questionsByTopic: QuestionsByTopic
  stats: SheetStat[]
}

/**
 * Ответ на вопрос в практике
 */
export interface AnsweredQuestion {
  number: number
  category: string
  question: string
  time: number
}

/**
 * Состояние загрузки
 */
export interface LoadingStatus {
  show: boolean
  message: string
  isError: boolean
}

/**
 * Состояние чекбоксов
 */
export type CheckboxesState = Record<string, boolean>

/**
 * Тип диалога
 */
export type DialogType = 'alert' | 'confirm'

/**
 * Состояние диалога
 */
export interface DialogState {
  isOpen: boolean
  type: DialogType
  title: string
  message: string
  onConfirm: (() => void) | null
  onCancel: (() => void) | null
}

/**
 * Контекст практики
 */
export interface PracticeContextValue {
  // State
  isPracticeStarted: boolean
  isPracticeFinished: boolean
  currentQuestionIndex: number
  currentQuestion: Question | null
  practiceQuestions: Question[]
  usedQuestionIndices: number[]
  answeredQuestions: AnsweredQuestion[]
  showAnswer: boolean
  showExplanation: boolean
  practiceStartTime: number | null
  questionStartTime: number | null
  // Actions
  startPractice: (firstQuestion: Question, questions: Question[], usedIndices: number[]) => void
  finishPractice: () => void
  resetPractice: () => void
  nextQuestion: (nextQuestion: Question, usedIndices: number[], answeredQuestion: AnsweredQuestion) => void
  addAnsweredQuestion: (answeredQuestion: AnsweredQuestion) => void
  toggleAnswer: () => void
  toggleExplanation: () => void
}

/**
 * Контекст вопросов
 */
export interface QuestionsContextValue {
  // State
  allQuestionsByTopic: QuestionsByTopic
  selectedTopics: string[]
  questions: Question[]
  loadingStatus: LoadingStatus
  error: Error | string | null
  sheetStats: SheetStat[]
  showFormatExample: boolean
  gamesConfig: GamesQuestionConfig
  // Actions
  loadFromFile: (file: File) => Promise<XLSXLoadResult>
  toggleTopic: (topicName: string, checked: boolean) => void
  clearData: () => void
  updateGameConfig: (gameId: GameId, config: GameQuestionConfig) => void
  getGameConfig: (gameId: GameId) => GameQuestionConfig | null
  getGameTopics: (gameId: GameId) => string[]
}

/**
 * ============================================
 * ТИПЫ ДЛЯ ИГРЫ "Кто хочет стать миллионером"
 * ============================================
 */

export interface MillionaireAnswer {
  text: string
  isCorrect: boolean
}

export interface MillionaireQuestion {
  id: number
  text: string
  answers: MillionaireAnswer[]
  difficulty: 1 | 2 | 3 | 4
  explanation?: string
  topic?: string
}

export interface Lifeline {
  id: string
  name: string
  used: boolean
}

export type MillionaireGameState = 'start' | 'playing' | 'question' | 'answer-selected' | 'won' | 'lost'

export interface MillionaireGameProgress {
  currentQuestionIndex: number
  score: number
  lifelines: Lifeline[]
  selectedAnswer: number | null
}

/**
 * ============================================
 * ТИПЫ ДЛЯ КОНФИГУРАЦИИ ИГР
 * ============================================
 */

export type GameId = 'practice' | 'blast' | 'millionaire' | 'flashcards' | 'quiz'

export type QuestionSource = 'common' | 'separate'

export interface GameQuestionConfig {
  source: QuestionSource // 'common' - общие вопросы, 'separate' - отдельные
  selectedTopics: string[] // Выбранные темы для этой игры
}

export interface GamesQuestionConfig {
  [gameId: string]: GameQuestionConfig
}

