import { usePractice } from '../../contexts/PracticeContext'
import Results from '../../components/Results'

export default function ResultsView() {
  const { 
    isPracticeFinished, 
    answeredQuestions, 
    practiceStartTime,
    resetPractice 
  } = usePractice()

  if (!isPracticeFinished) {
    return null
  }

  const totalTime = practiceStartTime 
    ? Math.floor((Date.now() - practiceStartTime) / 1000)
    : 0

  return (
    <Results
      answeredQuestions={answeredQuestions}
      totalTime={totalTime}
      onReset={resetPractice}
    />
  )
}

