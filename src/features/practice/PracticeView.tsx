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
    toggleExplanation
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

