import { useQuestions } from '../../contexts/QuestionsContext'
import { usePractice } from '../../contexts/PracticeContext'
import { usePracticeFlow } from '../../hooks/usePracticeFlow'
import { useDialog } from '../../hooks/useDialog'
import TopicsSelection from '../../components/TopicsSelection'
import FormatExample from '../../components/FormatExample'
import ErrorStatus from '../../components/ErrorStatus'
import Dialog from '../../components/Dialog'

export default function QuestionsSetupView() {
  const {
    allQuestionsByTopic,
    selectedTopics,
    questions,
    showFormatExample,
    error,
    toggleTopic,
    clearData
  } = useQuestions()

  const { isPracticeStarted, isPracticeFinished } = usePractice()
  const { start } = usePracticeFlow()
  const { dialog, showConfirm, showAlert } = useDialog()

  const handleStartPractice = () => {
    if (questions.length === 0) {
      // Диалог будет показан через App.jsx
      return
    }
    
    try {
      start()
    } catch (error) {
      // Ошибка будет обработана в App.jsx
      console.error('Error starting practice:', error)
    }
  }

  const handleClearData = async () => {
    const confirmed = await showConfirm(
      'Подтверждение',
      'Вы уверены, что хотите очистить все сохраненные данные? Это действие нельзя отменить.'
    )
    
    if (confirmed) {
      clearData()
      await showAlert('Успешно', 'Данные успешно очищены')
    }
  }

  if (isPracticeStarted || isPracticeFinished) {
    return null
  }

  return (
    <>
      {Object.keys(allQuestionsByTopic).length > 0 && (
        <>
          <div className="desktop-load-buttons" style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '20px', marginBottom: '20px' }}>
            <button
              onClick={() => document.getElementById('xlsxFileInput')?.click()}
              className="btn btn-primary"
              style={{ padding: '12px 25px', fontSize: '1em' }}
            >
              📁 Загрузить XLSX
            </button>
            <button
              onClick={handleClearData}
              className="btn"
              style={{ 
                padding: '12px 25px', 
                fontSize: '1em',
                background: '#6c757d',
                color: 'white'
              }}
            >
              🗑️ Сброс данных
            </button>
          </div>
          <TopicsSelection
            topics={Object.keys(allQuestionsByTopic)}
            selectedTopics={selectedTopics}
            allQuestionsByTopic={allQuestionsByTopic}
            onTopicToggle={toggleTopic}
            totalQuestions={questions.length}
          />
        </>
      )}
      
      <div className="controls">
        <button 
          className="btn btn-primary" 
          onClick={handleStartPractice}
          disabled={questions.length === 0}
          style={{ display: questions.length > 0 ? 'inline-block' : 'none' }}
        >
          Начать практику
        </button>
      </div>

      {showFormatExample && (
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => document.getElementById('xlsxFileInput')?.click()}
          >
            Загрузить вопросы из XLSX
          </button>
        </div>
      )}

      {error && <ErrorStatus error={error} />}

      {showFormatExample && <FormatExample />}

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

