function QuestionBlock({ 
  question, 
  currentIndex, 
  totalQuestions, 
  showAnswer, 
  showExplanation, 
  onToggleAnswer, 
  onToggleExplanation, 
  onNext,
  canProceed 
}) {
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

export default QuestionBlock

