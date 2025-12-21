import { usePractice } from '../../contexts/PracticeContext'
import { usePracticeFlow } from '../../hooks/usePracticeFlow'
import { useTimer } from '../../hooks/useTimer'
import StatsBlock from '../../components/StatsBlock'
import QuestionBlock from '../../components/QuestionBlock'

export default function PracticeView() {
  const { 
    isPracticeStarted, 
    currentQuestion, 
    showAnswer, 
    showExplanation,
    practiceStartTime,
    questionStartTime,
    toggleAnswer,
    toggleExplanation,
    resetPractice
  } = usePractice()
  
  const { totalSeconds, questionSeconds } = useTimer(
    isPracticeStarted, 
    practiceStartTime,
    questionStartTime
  )

  const { next } = usePracticeFlow()

  if (!isPracticeStarted || !currentQuestion) {
    return null
  }

  return (
    <>
      {/* Кнопка "Начать заново" над блоком статистики */}
      <button
        id="restartBtn"
        onClick={resetPractice}
        style={{
          width: '100%',
          padding: '12px 20px',
          background: '#ff6b6b',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1em',
          fontWeight: 'bold',
          boxShadow: '0 3px 10px rgba(255, 107, 107, 0.3)',
          transition: 'all 0.3s',
          marginBottom: '15px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#ff5252'
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 5px 15px rgba(255, 107, 107, 0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#ff6b6b'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 3px 10px rgba(255, 107, 107, 0.3)'
        }}
      >
        ↻ Начать заново
      </button>
      <StatsBlock 
        totalSeconds={totalSeconds}
        questionSeconds={questionSeconds}
      />
      <QuestionBlock
        question={currentQuestion}
        showAnswer={showAnswer}
        showExplanation={showExplanation}
        onToggleAnswer={toggleAnswer}
        onToggleExplanation={toggleExplanation}
        onNext={next}
      />
    </>
  )
}

