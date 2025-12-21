import { lazy, Suspense } from 'react'
import { useQuestions } from '../contexts/QuestionsContext'
import { usePractice } from '../contexts/PracticeContext'
import { usePracticeFlow } from '../hooks/usePracticeFlow'
import TopicsSelection from '../components/TopicsSelection'
import FormatExample from '../components/FormatExample'
import ErrorStatus from '../components/ErrorStatus'
import LoadingStatus from '../components/LoadingStatus'

// Code splitting - lazy loading для features
const PracticeView = lazy(() => import('../features/practice/PracticeView'))
const ResultsView = lazy(() => import('../features/practice/ResultsView'))

function PracticePage() {
  const { 
    allQuestionsByTopic,
    selectedTopics,
    questions,
    showFormatExample,
    error,
    loadingStatus,
    toggleTopic
  } = useQuestions()
  
  const { isPracticeStarted, isPracticeFinished } = usePractice()
  const { start } = usePracticeFlow()

  const handleStartPractice = () => {
    if (questions.length === 0) {
      alert('Загрузите XLSX файл с вопросами и выберите темы')
      return
    }
    
    try {
      start()
    } catch (error) {
      console.error('Error starting practice:', error)
    }
  }

  return (
    <>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px' }}>Загрузка...</div>}>
        {!isPracticeStarted && !isPracticeFinished && (
          <>
            {/* Блок загрузки файлов - показываем только если нет вопросов */}
            {Object.keys(allQuestionsByTopic).length === 0 && (
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '30px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginBottom: '20px',
                maxWidth: '1200px',
                margin: '0 auto 20px'
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
            )}

            {/* Блок выбора тем и кнопка начала - показываем только если вопросы загружены */}
            {Object.keys(allQuestionsByTopic).length > 0 && (
              <div className="practice-start-content" style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '2em', marginBottom: '20px', color: '#667eea' }}>
                  🎯 Практика вопросов
                </h2>
                <TopicsSelection
                  topics={Object.keys(allQuestionsByTopic)}
                  selectedTopics={selectedTopics}
                  allQuestionsByTopic={allQuestionsByTopic}
                  onTopicToggle={toggleTopic}
                  totalQuestions={questions.length}
                />
                {/* Кнопка начала практики */}
                {questions.length > 0 && (
                  <button 
                    className="btn btn-primary" 
                    onClick={handleStartPractice}
                    style={{ 
                      padding: '15px 40px', 
                      fontSize: '1.2em',
                      display: 'block',
                      margin: '20px auto 0'
                    }}
                  >
                    Начать практику
                  </button>
                )}
              </div>
            )}
          </>
        )}
        <PracticeView />
        <ResultsView />
      </Suspense>
    </>
  )
}

export default PracticePage

