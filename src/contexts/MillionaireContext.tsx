import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { MillionaireLoader } from '@/utils/millionaireLoader'

interface MillionaireContextValue {
  isGameStarted: boolean
  isGameFinished: boolean
  hasQuestions: boolean
  startGame: () => void
  finishGame: () => void
  resetGame: () => void
  setHasQuestions: (has: boolean) => void
}

const MillionaireContext = createContext<MillionaireContextValue | null>(null)

interface MillionaireProviderProps {
  children: ReactNode
}

export function MillionaireProvider({ children }: MillionaireProviderProps) {
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [isGameFinished, setIsGameFinished] = useState(false)
  const [hasQuestions, setHasQuestions] = useState(false)

  // Проверяем наличие вопросов при инициализации
  useEffect(() => {
    const questions = MillionaireLoader.loadFromStorage()
    setHasQuestions(questions !== null && questions.length > 0)
  }, [])

  const startGame = useCallback(() => {
    setIsGameStarted(true)
    setIsGameFinished(false)
  }, [])

  const finishGame = useCallback(() => {
    setIsGameFinished(true)
    setIsGameStarted(false)
  }, [])

  const resetGame = useCallback(() => {
    setIsGameStarted(false)
    setIsGameFinished(false)
  }, [])

  const value: MillionaireContextValue = {
    isGameStarted,
    isGameFinished,
    hasQuestions,
    startGame,
    finishGame,
    resetGame,
    setHasQuestions,
  }

  return (
    <MillionaireContext.Provider value={value}>
      {children}
    </MillionaireContext.Provider>
  )
}

export function useMillionaire(): MillionaireContextValue {
  const context = useContext(MillionaireContext)
  if (!context) {
    throw new Error('useMillionaire must be used within MillionaireProvider')
  }
  return context
}

