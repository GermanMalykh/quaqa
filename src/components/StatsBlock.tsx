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
    if (questionSeconds <= 10 && questionSeconds >= 0) {
      return 'linear-gradient(135deg, #ee5a6f 0%, #c44569 100%)'
    } else if (questionSeconds <= 30 && questionSeconds >= 0) {
      return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
    } else if (questionSeconds < 0) {
      return 'linear-gradient(135deg, #c44569 0%, #8b2e4f 100%)'
    }
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }, [questionSeconds])

  const displayQuestionTime = useMemo(() => 
    questionSeconds >= 0 
      ? formatTime(questionSeconds)
      : `+${formatTime(Math.abs(questionSeconds))}`,
    [questionSeconds]
  )

  return (
    <div className="stats">
      <div className="stat-box stat-box-total-time">
        <h3>Общее время</h3>
        <div className="value">{formatTime(totalSeconds)}</div>
      </div>
      <div className="stat-box stat-box-question">
        <h3>Вопрос</h3>
        <div className="value">{currentQuestionNumber}/{totalQuestions}</div>
      </div>
      <div className="stat-box stat-box-question-time" style={{ background: questionTimeColor }}>
        <h3>Время на вопрос</h3>
        <div className="value">{displayQuestionTime}</div>
      </div>
    </div>
  )
}

StatsBlock.propTypes = {
  totalSeconds: PropTypes.number.isRequired,
  questionSeconds: PropTypes.number.isRequired
}

export default memo(StatsBlock)

