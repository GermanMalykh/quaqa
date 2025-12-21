import { useState, useEffect } from 'react'
import { Game } from './Game'
import type { MillionaireQuestion, Lifeline } from '@/types'
import type { LifelineResult } from '@/utils/lifelineUtils'
import '@/styles/millionaire/main.scss'

interface GameScreenProps {
  game: Game
  onStateChange: () => void
  onReset?: () => void
}

export default function GameScreen({ game, onStateChange, onReset }: GameScreenProps) {
  const [question, setQuestion] = useState<MillionaireQuestion | null>(null)
  const [progress, setProgress] = useState(game.getProgress())
  const [shuffledAnswers, setShuffledAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answerPhase, setAnswerPhase] = useState<'none' | 'selected' | 'final'>('none')
  const [hiddenAnswers, setHiddenAnswers] = useState<Set<number>>(new Set())
  const [lifelineResult, setLifelineResult] = useState<{
    type: string
    result: LifelineResult
  } | null>(null)

  useEffect(() => {
    updateGameState()
  }, [])

  useEffect(() => {
    // Ждем, пока ответ будет обработан (answerPhase === 'final')
    if (selectedAnswer === null || answerPhase !== 'final') return

    const state = game.getState()
    if (state === 'won' || state === 'lost') {
      const timer = setTimeout(() => {
        onStateChange()
      }, 4000)
      return () => clearTimeout(timer)
    } else if (state === 'answer-selected') {
      // Правильный ответ, но не последний - переходим к следующему вопросу
      const timer = setTimeout(() => {
        game.nextQuestion()
        setSelectedAnswer(null)
        setAnswerPhase('none')
        setHiddenAnswers(new Set())
        setLifelineResult(null)
        updateGameState()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [selectedAnswer, answerPhase, game, onStateChange])

  const updateGameState = () => {
    const currentQuestion = game.getCurrentQuestion()
    const currentProgress = game.getProgress()
    const shuffled = game.getShuffledAnswers()

    setQuestion(currentQuestion)
    setProgress(currentProgress)
    setShuffledAnswers(shuffled)
    
    // Отладка: проверяем наличие explanation
    if (currentQuestion) {
      console.log('Current question:', {
        id: currentQuestion.id,
        text: currentQuestion.text.substring(0, 50) + '...',
        hasExplanation: !!currentQuestion.explanation,
        explanation: currentQuestion.explanation,
        explanationLength: currentQuestion.explanation?.length || 0
      })
    }
  }

  const handleAnswerClick = (displayIndex: number) => {
    if (selectedAnswer !== null) return

    console.log('Answer clicked:', displayIndex)
    setSelectedAnswer(displayIndex)
    setAnswerPhase('selected')
    console.log('Answer phase set to: selected')
    
    // Через 2 секунды показываем итоговую подсветку и обрабатываем ответ
    setTimeout(() => {
      setAnswerPhase('final')
      game.selectAnswer(displayIndex)
      // Переход к следующему вопросу или экрану результатов произойдет через useEffect
    }, 2000)
  }

  const handleLifeline = (lifelineId: string) => {
    if (!game.canUseLifeline(lifelineId)) return

    game.useLifeline(lifelineId)
    const result = game.getLifelineResult(lifelineId)

    setLifelineResult({ type: lifelineId, result })
    updateGameState()

    if (lifelineId === '50-50' && result && 'removeIndices' in result) {
      const newHidden = new Set(hiddenAnswers)
      result.removeIndices.forEach((idx: number) => {
        newHidden.add(idx)
      })
      setHiddenAnswers(newHidden)
    }
  }

  if (!question) return null

  // Призовые уровни для 15 вопросов (отображаем от меньшего к большему - снизу вверх)
  const prizeLevels = [
    100,     // 1 (внизу)
    200,     // 2
    300,     // 3
    500,     // 4
    1000,    // 5 (первая несгораемая сумма)
    2000,    // 6
    4000,    // 7
    8000,    // 8
    15000,   // 9
    15000,   // 10 (вторая несгораемая сумма)
    35000,   // 11
    75000,   // 12
    150000,  // 13
    300000,  // 14
    1000000  // 15 (главный приз, вверху)
  ]
  const currentLevel = progress.currentQuestionIndex

  // Форматируем число для отображения с пробелами для разделения тысяч
  const formatPrize = (prize: number): string => {
    return prize.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  return (
    <div className="millionaire-question-container">
      <div className="millionaire-game-layout">
        {/* Призовые уровни слева */}
        <div className="millionaire-prize-levels">
          {prizeLevels.map((prize, index) => {
            const level = index + 1
            const isActive = level === currentLevel + 1
            const isPassed = level < currentLevel + 1
            const isGuaranteed = level === 5 || level === 10 // Несгораемые суммы

            return (
              <div
                key={level}
                className={`millionaire-prize-item ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''} ${isGuaranteed ? 'guaranteed' : ''} ${!isActive ? 'mobile-hide' : ''}`}
              >
                {formatPrize(prize)} ₽
              </div>
            )
          })}
          {/* Кнопка "Начать заново" в блоке с призовыми суммами */}
          {onReset && (
            <button
              onClick={onReset}
              className="millionaire-reset-btn"
            >
              ↻ Начать заново
            </button>
          )}
        </div>

        {/* Вопрос и ответы справа */}
        <div className="millionaire-question-content">
          {/* Подсказки */}
          <div className="millionaire-lifelines">
            {progress.lifelines.map((lifeline: Lifeline) => {
              const canUse = game.canUseLifeline(lifeline.id)
              const icon =
                lifeline.id === '50-50'
                  ? '50:50'
                  : lifeline.id === 'phone'
                    ? '📞'
                    : '👥'

              return (
                <button
                  key={lifeline.id}
                  onClick={() => handleLifeline(lifeline.id)}
                  disabled={!canUse}
                  className="millionaire-lifeline-btn"
                  data-lifeline={lifeline.id}
                  style={lifeline.used ? { background: '#ccc' } : undefined}
                >
                  {icon}
                </button>
              )
            })}
          </div>

          {/* Результат подсказки */}
          {lifelineResult && (
            <div className={`millionaire-lifeline-result ${lifelineResult ? 'show' : ''}`}>
              {lifelineResult.type === '50-50' && (
                <div>Два неправильных ответа убраны!</div>
              )}
              {lifelineResult.type === 'phone' &&
                lifelineResult.result &&
                'suggestion' in lifelineResult.result && (
                  <div>
                    Ваш друг думает, что правильный ответ: "
                    {String.fromCharCode(65 + shuffledAnswers.indexOf(lifelineResult.result.suggestion))}.
                    {question.answers[lifelineResult.result.suggestion].text}" (уверенность:{' '}
                    {lifelineResult.result.confidence}%)
                  </div>
                )}
              {lifelineResult.type === 'audience' &&
                lifelineResult.result &&
                'percentages' in lifelineResult.result && (
                  <div>
                    Зал проголосовал:
                    {shuffledAnswers.map((originalIdx, displayIdx) => {
                      const letter = String.fromCharCode(65 + displayIdx)
                      const percent = lifelineResult.result && 'percentages' in lifelineResult.result
                        ? lifelineResult.result.percentages[originalIdx]
                        : 0
                      return (
                        <span key={displayIdx} style={{ marginLeft: '10px' }}>
                          {letter}: {percent}%
                        </span>
                      )
                    })}
                  </div>
                )}
            </div>
          )}

          {/* Вопрос */}
          <div>
            <div 
              className="millionaire-question-number" 
              style={{ 
                display: 'flex', 
                justifyContent: question.topic ? 'space-between' : 'center', 
                alignItems: 'center' 
              }}
            >
              {question.topic && (
                <span style={{ color: '#667eea', fontWeight: 'bold' }}>
                  Тема: {question.topic}
                </span>
              )}
              <span>
                Вопрос <strong>{currentLevel + 1}</strong> из 15
              </span>
            </div>
            <div className="millionaire-question-text">{question.text}</div>

            {/* Ответы */}
            <div className="millionaire-answers-container">
          {shuffledAnswers.map((originalIndex, displayIndex) => {
            const answer = question.answers[originalIndex]
            const letter = String.fromCharCode(65 + displayIndex)
            const isHidden = hiddenAnswers.has(originalIndex)
            const isSelected = selectedAnswer === displayIndex
            const isCorrect = answer.isCorrect

            const buttonClasses = [
              'millionaire-answer-btn',
              answerPhase === 'selected' && isSelected ? 'selected' : '',
              answerPhase === 'final' && isSelected && isCorrect ? 'correct' : '',
              answerPhase === 'final' && isSelected && !isCorrect ? 'incorrect' : '',
              answerPhase === 'final' && !isSelected && selectedAnswer !== null && isCorrect ? 'correct' : '',
              isHidden ? 'hidden' : '',
            ]
              .filter(Boolean)
              .join(' ')
            
            // Отладка для выбранной кнопки
            if (isSelected && answerPhase === 'selected') {
              console.log('Button classes:', buttonClasses, 'answerPhase:', answerPhase, 'isSelected:', isSelected)
            }

            return (
              <button
                key={displayIndex}
                onClick={() => handleAnswerClick(displayIndex)}
                disabled={selectedAnswer !== null}
                className={buttonClasses}
              >
                {letter}. {answer.text}
              </button>
            )
          })}
        </div>

        {/* Объяснение ответа */}
        {(() => {
          const shouldShow = answerPhase === 'final' && question.explanation && question.explanation.trim() !== ''
          if (answerPhase === 'final') {
            console.log('Explanation check:', {
              answerPhase,
              hasExplanation: !!question.explanation,
              explanationValue: question.explanation,
              explanationTrimmed: question.explanation?.trim(),
              explanationLength: question.explanation?.length || 0,
              shouldShow
            })
          }
          return shouldShow ? (
            <div className="millionaire-explanation" style={{
              marginTop: '20px',
              padding: '15px',
              background: '#e3f2fd',
              borderRadius: '10px',
              border: '2px solid #667eea',
              fontSize: '1em',
              lineHeight: '1.5',
              color: '#333'
            }}>
              <strong style={{ color: '#667eea', display: 'block', marginBottom: '8px' }}>
                💡 Объяснение:
              </strong>
              {question.explanation}
            </div>
          ) : null
        })()}
          </div>
        </div>
      </div>
    </div>
  )
}
