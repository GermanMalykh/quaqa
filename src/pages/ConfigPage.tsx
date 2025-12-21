import { useQuestions } from '../contexts/QuestionsContext'
import TopicsSelection from '../components/TopicsSelection'
import FormatExample from '../components/FormatExample'
import ErrorStatus from '../components/ErrorStatus'
import LoadingStatus from '../components/LoadingStatus'

export default function ConfigPage() {
  const {
    allQuestionsByTopic,
    selectedTopics,
    questions,
    showFormatExample,
    error,
    loadingStatus,
    toggleTopic
  } = useQuestions()

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Блок загрузки файлов */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{
          marginTop: 0,
          marginBottom: '20px',
          color: '#333',
          fontSize: '1.8em',
          borderBottom: '2px solid #667eea',
          paddingBottom: '15px'
        }}>
          📋 Загрузка вопросов
        </h2>

        {loadingStatus.show && (
          <LoadingStatus message={loadingStatus.message} />
        )}

        {error && <ErrorStatus error={error} />}

        {Object.keys(allQuestionsByTopic).length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <button
                onClick={() => document.getElementById('xlsxFileInput')?.click()}
                className="btn btn-primary"
                style={{ padding: '12px 25px', fontSize: '1em' }}
              >
                📁 Загрузить XLSX
              </button>
            </div>
            <TopicsSelection
              topics={Object.keys(allQuestionsByTopic)}
              selectedTopics={selectedTopics}
              allQuestionsByTopic={allQuestionsByTopic}
              onTopicToggle={toggleTopic}
              totalQuestions={questions.length}
            />
          </div>
        )}

        {showFormatExample && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <button 
                className="btn btn-primary" 
                onClick={() => document.getElementById('xlsxFileInput')?.click()}
                style={{ padding: '12px 25px', fontSize: '1em' }}
              >
                📋 Загрузить вопросы из XLSX
              </button>
            </div>
            <FormatExample />
          </div>
        )}
      </div>
    </div>
  )
}

