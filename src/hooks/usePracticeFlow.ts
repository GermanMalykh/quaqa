import { useCallback } from 'react'
import { usePractice } from '../contexts/PracticeContext'
import { useQuestions } from '../contexts/QuestionsContext'
import { QuestionManager } from '../utils/questionManager'
import type { Question } from '../types'

export interface UsePracticeFlowReturn {
  start: () => void
  next: () => void
}

export function usePracticeFlow(): UsePracticeFlowReturn {
  const { 
    startPractice, 
    finishPractice, 
    nextQuestion: nextQuestionAction,
    addAnsweredQuestion,
    currentQuestionIndex,
    usedQuestionIndices,
    questionStartTime,
    currentQuestion
  } = usePractice()
  
  const { questions } = useQuestions()

  const start = useCallback(() => {
    if (questions.length === 0) {
      throw new Error('Выберите хотя бы одну тему для практики!')
    }
    
    const result = QuestionManager.getRandomQuestion(questions, [])
    if (result.question) {
      startPractice(result.question, result.usedIndices)
    }
  }, [questions, startPractice])

  const next = useCallback(() => {
    if (!questionStartTime || !currentQuestion) return
    
    const actualTimeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
    const answeredQuestion = {
      number: currentQuestionIndex + 1,
      category: currentQuestion.category,
      question: currentQuestion.question,
      time: actualTimeSpent
    }
    
    // Сохраняем текущий ответ перед проверкой на завершение
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex >= questions.length) {
      // Это последний вопрос - сохраняем ответ и завершаем практику
      addAnsweredQuestion(answeredQuestion)
      finishPractice()
      return
    }
    
    const result = QuestionManager.getRandomQuestion(questions, usedQuestionIndices)
    if (result.question) {
      nextQuestionAction(result.question, result.usedIndices, answeredQuestion)
    }
  }, [
    questionStartTime, 
    currentQuestion, 
    currentQuestionIndex, 
    questions, 
    usedQuestionIndices,
    finishPractice,
    nextQuestionAction,
    addAnsweredQuestion
  ])

  return {
    start,
    next
  }
}

