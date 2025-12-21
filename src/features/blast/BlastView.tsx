import { useState, useEffect, useCallback, useRef } from 'react'
import { useQuestions } from '../../contexts/QuestionsContext'
import { QuestionManager } from '../../utils/questionManager'
import type { Question } from '../../types'
import GameIntro from './GameIntro'
import GameScreen from './GameScreen'
import GameOver from './GameOver'

interface Asteroid {
  id: string
  text: string
  isCorrect: boolean
  x: number
  y: number
  destroyed: boolean
}

interface GameStats {
  score: number
  correctAnswers: number
  wrongAnswers: number
}

export default function BlastView() {
  const { questions, allQuestionsByTopic, selectedTopics, getGameTopics } = useQuestions()
  const gameTopics = getGameTopics('blast')
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameOver'>('intro')
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [asteroids, setAsteroids] = useState<Asteroid[]>([])
  const [timeLeft, setTimeLeft] = useState(10)
  const [usedQuestionIndices, setUsedQuestionIndices] = useState<number[]>([])
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0
  })
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const gameQuestionsRef = useRef<Question[]>([])

  // Подготовка вопросов для игры из localStorage
  useEffect(() => {
    if (Object.keys(allQuestionsByTopic).length > 0) {
      // Используем темы из конфигурации игры
      if (gameTopics.length > 0) {
        const result = QuestionManager.updateSelectedQuestions(allQuestionsByTopic, gameTopics)
        gameQuestionsRef.current = result.questions
      } else {
        // Если темы не выбраны, используем все доступные темы
        const allTopics = Object.keys(allQuestionsByTopic)
        const result = QuestionManager.updateSelectedQuestions(allQuestionsByTopic, allTopics)
        gameQuestionsRef.current = result.questions
      }
    } else if (questions.length > 0) {
      // Fallback на questions из контекста
      gameQuestionsRef.current = questions
    }
  }, [questions, allQuestionsByTopic, gameTopics])

  // Таймер игры
  useEffect(() => {
    if (gameState !== 'playing') {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }

    // Очищаем предыдущий таймер, если он есть
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          // Время вышло - игра окончена
          setGameState('gameOver')
          return 0
        }
        return Math.max(0, prev - 1)
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [gameState])

  // Начало игры
  const startGame = useCallback(() => {
    if (gameQuestionsRef.current.length === 0) {
      alert('Загрузите вопросы для игры!')
      return
    }

    setGameState('playing')
    setGameStats({ score: 0, correctAnswers: 0, wrongAnswers: 0 })
    setUsedQuestionIndices([])
    setAsteroids([])
    setCurrentQuestion(null)
    
    // Инициализируем первый вопрос
    setTimeout(() => {
      const result = QuestionManager.getRandomQuestion(
        gameQuestionsRef.current,
        []
      )

      if (!result.question) {
        alert('Нет доступных вопросов для игры!')
        setGameState('intro')
        return
      }

      setCurrentQuestion(result.question)
      setUsedQuestionIndices(result.usedIndices)

      // Создаем начальные астероиды (2-3 штуки)
      const correctAnswer = result.question.answer
      const wrongAnswers: string[] = []
      
      gameQuestionsRef.current.forEach((q, idx) => {
        if (idx !== result.index && q.answer !== correctAnswer && wrongAnswers.length < 2) {
          wrongAnswers.push(q.answer)
        }
      })

      while (wrongAnswers.length < 2) {
        wrongAnswers.push(`Ответ ${wrongAnswers.length + 1}`)
      }

      const allAnswers = [correctAnswer, ...wrongAnswers]
      const shuffled = QuestionManager.getRandomItems(allAnswers, allAnswers.length)

      const initialAsteroids: Asteroid[] = shuffled.map((answer, i) => ({
        id: `asteroid-init-${i}`,
        text: answer,
        isCorrect: answer === correctAnswer,
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
        destroyed: false
      }))

      setAsteroids(initialAsteroids)
      setTimeLeft(10)
    }, 100)
  }, [])

  // Обработка выстрела
  const handleShoot = useCallback((asteroidId: string) => {
    setAsteroids(prev => {
      const asteroid = prev.find(a => a.id === asteroidId)
      if (!asteroid || asteroid.destroyed) return prev

      // Помечаем астероид как уничтоженный
      const updated = prev.map(a => 
        a.id === asteroidId ? { ...a, destroyed: true } : a
      )

      if (asteroid.isCorrect) {
        // Правильный ответ
        setGameStats(prevStats => ({
          score: prevStats.score + 1,
          correctAnswers: prevStats.correctAnswers + 1,
          wrongAnswers: prevStats.wrongAnswers
        }))
        // Добавляем время за правильный ответ
        setTimeLeft(prevTime => prevTime + 3)

        // Добавляем новый астероид и переходим к следующему вопросу
        setTimeout(() => {
          setUsedQuestionIndices(prevIndices => {
            // Получаем следующий вопрос
            const nextResult = QuestionManager.getRandomQuestion(
              gameQuestionsRef.current,
              prevIndices
            )

            if (nextResult.question) {
              // Обновляем вопрос
              setCurrentQuestion(nextResult.question)

              // Создаем новые астероиды для нового вопроса (включая правильный ответ)
              const correctAnswer = nextResult.question.answer
              const wrongAnswers: string[] = []
              
              gameQuestionsRef.current.forEach((q, idx) => {
                if (idx !== nextResult.index && q.answer !== correctAnswer && wrongAnswers.length < 2) {
                  wrongAnswers.push(q.answer)
                }
              })

              // Если не хватает неправильных ответов, добавляем заглушки
              while (wrongAnswers.length < 2) {
                wrongAnswers.push(`Ответ ${wrongAnswers.length + 1}`)
              }

              // Создаем массив всех ответов (правильный + неправильные)
              const allAnswers = [correctAnswer, ...wrongAnswers]
              const shuffled = QuestionManager.getRandomItems(allAnswers, allAnswers.length)

              // Создаем новые астероиды для нового вопроса
              const newAsteroids: Asteroid[] = shuffled.map((answer, i) => ({
                id: `asteroid-${Date.now()}-${i}`,
                text: answer,
                isCorrect: answer === correctAnswer,
                x: Math.random() * 80 + 10,
                y: Math.random() * 60 + 20,
                destroyed: false
              }))

              // Заменяем все астероиды новыми (включая правильный ответ)
              setAsteroids(newAsteroids)
              
              return nextResult.usedIndices
            } else {
              // Вопросы закончились
              setGameState('gameOver')
              return prevIndices
            }
          })
        }, 500)

        return updated
      } else {
        // Неправильный ответ
        setGameStats(prevStats => ({
          score: prevStats.score,
          correctAnswers: prevStats.correctAnswers,
          wrongAnswers: prevStats.wrongAnswers + 1
        }))
        // Уменьшаем время на 1 секунду вместо 2, чтобы не было резких скачков
        setTimeLeft(prevTime => Math.max(0, prevTime - 1))
        return updated
      }
    })
  }, [])

  // Перезапуск игры
  const restartGame = useCallback(() => {
    setGameState('intro')
    setCurrentQuestion(null)
    setAsteroids([])
    setTimeLeft(10)
    setUsedQuestionIndices([])
    setGameStats({ score: 0, correctAnswers: 0, wrongAnswers: 0 })
  }, [])

  if (gameState === 'intro') {
    return <GameIntro onStart={startGame} />
  }

  if (gameState === 'gameOver') {
    return (
      <GameOver
        stats={gameStats}
        onRestart={restartGame}
      />
    )
  }

  return (
    <GameScreen
      currentQuestion={currentQuestion}
      asteroids={asteroids}
      timeLeft={timeLeft}
      score={gameStats.score}
      onShoot={handleShoot}
    />
  )
}

