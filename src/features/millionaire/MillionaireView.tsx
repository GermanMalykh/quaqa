import { useState, useEffect } from 'react'
import { Game } from './Game'
import { MillionaireLoader } from '@/utils/millionaireLoader'
import { Storage } from '@/utils/storage'
import { useMillionaire } from '@/contexts/MillionaireContext'
import { useDialog } from '@/hooks/useDialog'
import Dialog from '@/components/Dialog'
import type { MillionaireQuestion } from '@/types'
import StartScreen from './StartScreen'
import GameScreen from './GameScreen'
import ResultScreen from './ResultScreen'
import LoadingStatus from '@/components/LoadingStatus'
import ErrorStatus from '@/components/ErrorStatus'
import MillionaireFileLoader from './MillionaireFileLoader'

export default function MillionaireView() {
  const { startGame, finishGame, resetGame, setHasQuestions } = useMillionaire()
  const { dialog, showConfirm } = useDialog()
  const [game] = useState(() => new Game())
  const [questions, setQuestions] = useState<MillionaireQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gameState, setGameState] = useState<'start' | 'playing' | 'won' | 'lost' | 'no-questions'>('no-questions')

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Сначала пытаемся загрузить из localStorage
      const savedQuestions = MillionaireLoader.loadFromStorage()
      
      if (savedQuestions && savedQuestions.length > 0) {
        setQuestions(savedQuestions)
        
        // Проверяем историю игр - если игр меньше 3, исключаем использованные вопросы
        const gameHistory = Storage.loadMillionaireGameHistory()
        const excludeIds = gameHistory.length < 3 ? Storage.getUsedQuestionIds() : new Set<number>()
        
        await game.loadQuestions(savedQuestions, excludeIds)
        setGameState('start')
        resetGame() // Сбрасываем состояние игры при загрузке
        setHasQuestions(true) // Устанавливаем, что вопросы загружены
      } else {
        // Если вопросов нет, показываем экран загрузки
        setGameState('no-questions')
        resetGame()
        setHasQuestions(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки вопросов')
      setGameState('no-questions')
    } finally {
      setLoading(false)
    }
  }

  const handleFileLoad = async (file: File) => {
    try {
      setLoading(true)
      setError(null)
      const loadedQuestions = await MillionaireLoader.loadFromFile(file)
      setQuestions(loadedQuestions)
      
      // Проверяем историю игр - если игр меньше 3, исключаем использованные вопросы
      const gameHistory = Storage.loadMillionaireGameHistory()
      const excludeIds = gameHistory.length < 3 ? Storage.getUsedQuestionIds() : new Set<number>()
      
      await game.loadQuestions(loadedQuestions, excludeIds)
      setGameState('start')
      resetGame() // Сбрасываем состояние игры при загрузке файла
      setHasQuestions(true) // Устанавливаем, что вопросы загружены
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки файла')
    } finally {
      setLoading(false)
    }
  }

  const handleStart = async () => {
    // Перезагружаем вопросы перед стартом, чтобы получить свежий набор
    const gameHistory = Storage.loadMillionaireGameHistory()
    const excludeIds = gameHistory.length < 3 ? Storage.getUsedQuestionIds() : new Set<number>()
    await game.loadQuestions(questions, excludeIds)
    
    game.start()
    setGameState('playing')
    startGame()
  }

  const handleGameStateChange = () => {
    const state = game.getState()
    if (state === 'won' || state === 'lost') {
      setGameState(state)
      finishGame()
      
      // Сохраняем использованные вопросы в историю игр
      const usedQuestionIds = game.getSelectedQuestionIds()
      Storage.saveMillionaireGameHistory(usedQuestionIds)
    } else if (state === 'playing') {
      setGameState('playing')
    }
  }

  const handleReset = async () => {
    const confirmed = await showConfirm(
      'Подтверждение',
      'Вы уверены, что хотите начать игру заново? Текущий прогресс будет потерян.'
    )
    if (confirmed) {
      resetGame()
      window.location.reload()
    }
  }

  if (loading) {
    return <LoadingStatus message="Загрузка вопросов..." />
  }

  if (gameState === 'no-questions') {
    return (
      <MillionaireFileLoader 
        onFileLoad={handleFileLoad}
        error={error}
        onRetry={() => {
          setError(null)
          loadQuestions()
        }}
      />
    )
  }

  if (error && gameState !== 'start') {
    return <ErrorStatus message={error} onRetry={loadQuestions} />
  }

  if (gameState === 'start') {
    return <StartScreen onStart={handleStart} />
  }

  if (gameState === 'won' || gameState === 'lost') {
    return (
      <ResultScreen
        game={game}
        isWon={gameState === 'won'}
        onPlayAgain={() => {
          resetGame()
          handleStart()
        }}
      />
    )
  }

  return (
    <>
      <GameScreen game={game} onStateChange={handleGameStateChange} onReset={handleReset} />
      <Dialog
        isOpen={dialog.isOpen}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onCancel={dialog.onCancel}
      />
    </>
  )
}

