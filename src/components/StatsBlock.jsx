import { formatTime } from '../utils/timer'

function StatsBlock({ currentQuestion, totalQuestions, totalTime, questionTime }) {
  const getQuestionTimeColor = () => {
    if (questionTime <= 10 && questionTime >= 0) {
      return 'linear-gradient(135deg, #ee5a6f 0%, #c44569 100%)'
    } else if (questionTime <= 30 && questionTime >= 0) {
      return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
    } else if (questionTime < 0) {
      return 'linear-gradient(135deg, #c44569 0%, #8b2e4f 100%)'
    }
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }

  const displayQuestionTime = questionTime >= 0 
    ? formatTime(questionTime)
    : `+${formatTime(Math.abs(questionTime))}`

  return (
    <div className="stats">
      <div className="stat-box">
        <h3>Вопрос</h3>
        <div className="value">{currentQuestion}/{totalQuestions}</div>
      </div>
      <div className="stat-box">
        <h3>Общее время</h3>
        <div className="value">{formatTime(totalTime)}</div>
      </div>
      <div className="stat-box" style={{ background: getQuestionTimeColor() }}>
        <h3>Время на вопрос</h3>
        <div className="value">{displayQuestionTime}</div>
      </div>
    </div>
  )
}

export default StatsBlock

