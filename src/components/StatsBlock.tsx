import { formatTime } from '../utils/timer'
import { usePractice } from '../contexts/PracticeContext'
import { useQuestions } from '../contexts/QuestionsContext'
import PropTypes from 'prop-types'
import { memo, useMemo } from 'react'

interface StatsBlockProps {
  totalSeconds: number
  questionSeconds: number
}

function StatsBlock({ totalSeconds, questionSeconds }: StatsBlockProps) {
  const { currentQuestionIndex } = usePractice()
  const { questions } = useQuestions()
  
  const totalQuestions = questions.length
  const currentQuestionNumber = currentQuestionIndex + 1

  const questionTimeColor = useMemo(() => {
    // Красный цвет только когда превышен лимит (отрицательное значение)
    // Используем тот же цвет, что и кнопка "Начать заново" (#ff6b6b)
    if (questionSeconds < 0) {
      return '#ff6b6b'
    }
    // По умолчанию белый (не задаем цвет, используется из CSS)
    return undefined
  }, [questionSeconds])

  const displayQuestionTime = useMemo(() => 
    questionSeconds >= 0 
      ? formatTime(questionSeconds)
      : `+${formatTime(Math.abs(questionSeconds))}`,
    [questionSeconds]
  )

  return (
    <div className="stats">
      <div className="stat-box">
        <div className="stat-item stat-box-total-time">
          <h3>Общее время</h3>
          <div className="value">{formatTime(totalSeconds)}</div>
        </div>
        <div className="stat-item stat-box-question">
          <h3>Вопрос</h3>
          <div className="value">{currentQuestionNumber}/{totalQuestions}</div>
        </div>
        <div className="stat-item stat-box-question-time">
          <h3>Время на вопрос</h3>
          <div className="value" style={questionTimeColor ? { color: questionTimeColor } : undefined}>{displayQuestionTime}</div>
        </div>
      </div>
    </div>
  )
}

StatsBlock.propTypes = {
  totalSeconds: PropTypes.number.isRequired,
  questionSeconds: PropTypes.number.isRequired
}

export default memo(StatsBlock)

