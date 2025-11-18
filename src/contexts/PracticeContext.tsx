import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { PracticeContextValue, Question, AnsweredQuestion } from '../types'

const PracticeContext = createContext<PracticeContextValue | null>(null)

interface PracticeProviderProps {
  children: ReactNode
}

export function PracticeProvider({ children }: PracticeProviderProps) {
  const [isPracticeStarted, setIsPracticeStarted] = useState(false)
  const [isPracticeFinished, setIsPracticeFinished] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [usedQuestionIndices, setUsedQuestionIndices] = useState<number[]>([])
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([])
  const [showAnswer, setShowAnswer] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [practiceStartTime, setPracticeStartTime] = useState<number | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null)

  const startPractice = useCallback((firstQuestion: Question, usedIndices: number[]) => {
    setIsPracticeStarted(true)
    setIsPracticeFinished(false)
    setPracticeStartTime(Date.now())
    setCurrentQuestionIndex(0)
    setAnsweredQuestions([])
    setUsedQuestionIndices(usedIndices)
    setCurrentQuestion(firstQuestion)
    setQuestionStartTime(Date.now())
    setShowAnswer(false)
    setShowExplanation(false)
  }, [])

  const finishPractice = useCallback(() => {
    setIsPracticeFinished(true)
    setIsPracticeStarted(false)
  }, [])

  const resetPractice = useCallback(() => {
    setIsPracticeStarted(false)
    setIsPracticeFinished(false)
    setCurrentQuestionIndex(0)
    setCurrentQuestion(null)
    setAnsweredQuestions([])
    setUsedQuestionIndices([])
    setQuestionStartTime(null)
    setPracticeStartTime(null)
    setShowAnswer(false)
    setShowExplanation(false)
  }, [])

  const nextQuestion = useCallback((
    nextQuestion: Question,
    usedIndices: number[],
    answeredQuestion: AnsweredQuestion
  ) => {
    setCurrentQuestionIndex(prev => prev + 1)
    setCurrentQuestion(nextQuestion)
    setUsedQuestionIndices(usedIndices)
    setAnsweredQuestions(prev => [...prev, answeredQuestion])
    setQuestionStartTime(Date.now())
    setShowAnswer(false)
    setShowExplanation(false)
  }, [])

  const addAnsweredQuestion = useCallback((answeredQuestion: AnsweredQuestion) => {
    setAnsweredQuestions(prev => [...prev, answeredQuestion])
  }, [])

  const toggleAnswer = useCallback(() => {
    setShowAnswer(prev => !prev)
  }, [])

  const toggleExplanation = useCallback(() => {
    setShowExplanation(prev => !prev)
  }, [])

  const value: PracticeContextValue = {
    // State
    isPracticeStarted,
    isPracticeFinished,
    currentQuestionIndex,
    currentQuestion,
    usedQuestionIndices,
    answeredQuestions,
    showAnswer,
    showExplanation,
    practiceStartTime,
    questionStartTime,
    // Actions
    startPractice,
    finishPractice,
    resetPractice,
    nextQuestion,
    addAnsweredQuestion,
    toggleAnswer,
    toggleExplanation,
  }

  return (
    <PracticeContext.Provider value={value}>
      {children}
    </PracticeContext.Provider>
  )
}

export function usePractice(): PracticeContextValue {
  const context = useContext(PracticeContext)
  if (!context) {
    throw new Error('usePractice must be used within PracticeProvider')
  }
  return context
}

