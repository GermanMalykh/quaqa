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
    practiceQuestions,
    usedQuestionIndices,
    questionStartTime,
    currentQuestion
  } = usePractice()
  
  const { allQuestionsByTopic, selectedTopics } = useQuestions()

  const start = useCallback(() => {
    if (selectedTopics.length === 0) {
      throw new Error('Выберите хотя бы одну тему для практики!')
    }
    
    // Пересоздаем список вопросов при каждом старте практики,
    // чтобы каждый раз выбирались новые случайные вопросы
    const result = QuestionManager.updateSelectedQuestions(allQuestionsByTopic, selectedTopics)
    const questions = result.questions
    
    if (questions.length === 0) {
      throw new Error('Выберите хотя бы одну тему для практики!')
    }
    
    const randomResult = QuestionManager.getRandomQuestion(questions, [])
    if (randomResult.question) {
      startPractice(randomResult.question, questions, randomResult.usedIndices)
    }
  }, [allQuestionsByTopic, selectedTopics, startPractice])

  const next = useCallback(() => {
    if (!questionStartTime || !currentQuestion) return
    
    const actualTimeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
    const answeredQuestion = {
      number: currentQuestionIndex + 1,
      category: currentQuestion.category,
      question: currentQuestion.question,
      time: actualTimeSpent
    }
    
    // Используем список вопросов, выбранный при старте практики
    const questions = practiceQuestions
    
    // Сохраняем текущий ответ перед проверкой на завершение
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex >= questions.length) {
      // Это последний вопрос - сохраняем ответ и завершаем практику
      addAnsweredQuestion(answeredQuestion)
      finishPractice()
      return
    }
    
    const randomResult = QuestionManager.getRandomQuestion(questions, usedQuestionIndices)
    if (randomResult.question) {
      nextQuestionAction(randomResult.question, randomResult.usedIndices, answeredQuestion)
    }
  }, [
    questionStartTime, 
    currentQuestion, 
    currentQuestionIndex, 
    practiceQuestions,
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

