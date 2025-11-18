import { useState, useEffect, useCallback } from 'react'

export interface UseTimerReturn {
  totalSeconds: number
  questionSeconds: number
  reset: () => void
}

export function useTimer(
  isActive: boolean,
  practiceStartTime: number | null,
  questionStartTime: number | null
): UseTimerReturn {
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [questionSeconds, setQuestionSeconds] = useState(60)

  // Общий таймер практики
  useEffect(() => {
    if (!isActive || !practiceStartTime) {
      setTotalSeconds(0)
      return
    }
    
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - practiceStartTime) / 1000)
      setTotalSeconds(elapsed)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [isActive, practiceStartTime])

  // Таймер вопроса
  useEffect(() => {
    if (!isActive || !questionStartTime) {
      setQuestionSeconds(60)
      return
    }
    
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - questionStartTime) / 1000)
      setQuestionSeconds(60 - elapsed)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [isActive, questionStartTime])

  const reset = useCallback(() => {
    setTotalSeconds(0)
    setQuestionSeconds(60)
  }, [])

  return {
    totalSeconds,
    questionSeconds,
    reset
  }
}

