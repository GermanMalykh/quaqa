/**
 * Типы для вопросов
 */
export interface Question {
  category: string
  question: string
  answer: string
  explanation?: string
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
  usedQuestionIndices: number[]
  answeredQuestions: AnsweredQuestion[]
  showAnswer: boolean
  showExplanation: boolean
  practiceStartTime: number | null
  questionStartTime: number | null
  // Actions
  startPractice: (firstQuestion: Question, usedIndices: number[]) => void
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
  // Actions
  loadFromFile: (file: File) => Promise<XLSXLoadResult>
  toggleTopic: (topicName: string, checked: boolean) => void
  clearData: () => void
}

