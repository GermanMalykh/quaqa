import { usePractice } from '../contexts/PracticeContext'
import { useQuestions } from '../contexts/QuestionsContext'
import PropTypes from 'prop-types'
import { memo, useMemo } from 'react'
import type { Question } from '../types'

interface QuestionBlockProps {
  question: Question
  showAnswer: boolean
  showExplanation: boolean
  onToggleAnswer: () => void
  onToggleExplanation: () => void
  onNext: () => void
}

function QuestionBlock({ 
  question, 
  showAnswer, 
  showExplanation, 
  onToggleAnswer, 
  onToggleExplanation, 
  onNext
}: QuestionBlockProps) {
  const { currentQuestionIndex, questionSeconds } = usePractice()
  const { questions } = useQuestions()
  
  const totalQuestions = questions.length
  const currentIndex = currentQuestionIndex + 1
  const canProceed = useMemo(() => 
    showAnswer || showExplanation || questionSeconds <= 0,
    [showAnswer, showExplanation, questionSeconds]
  )

  return (
    <div id="questionContainer">
      <div className="question-block">
        <div className="question-category">{question.category}</div>
        <div className="question-number">Вопрос {currentIndex} из {totalQuestions}</div>
        <div className="question-text">{question.question}</div>
        
        <div className="answer-section">
          <button className="toggle-button" onClick={onToggleAnswer}>
            Показать ответ
          </button>
          <button className="toggle-button" onClick={onToggleExplanation}>
            Показать объяснение
          </button>
          
          {showAnswer && (
            <div className="hidden-content show">
              <div className="answer-text">{question.answer}</div>
            </div>
          )}
          
          {showExplanation && (
            <div className="hidden-content show">
              <div className="explanation-text">{question.explanation}</div>
            </div>
          )}
        </div>
      </div>

      <div className="controls">
        <button 
          className="btn btn-success" 
          onClick={onNext}
          disabled={!canProceed}
        >
          Далее
        </button>
      </div>
    </div>
  )
}

QuestionBlock.propTypes = {
  question: PropTypes.shape({
    category: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
    explanation: PropTypes.string
  }).isRequired,
  showAnswer: PropTypes.bool.isRequired,
  showExplanation: PropTypes.bool.isRequired,
  onToggleAnswer: PropTypes.func.isRequired,
  onToggleExplanation: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
}

export default memo(QuestionBlock)

