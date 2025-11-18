import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { PracticeProvider } from './contexts/PracticeContext'
import { QuestionsProvider } from './contexts/QuestionsContext'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import { useQuestions } from './contexts/QuestionsContext'
import { usePractice } from './contexts/PracticeContext'
import { useDialog } from './hooks/useDialog'
import Dialog from './components/Dialog'

// Code splitting - lazy loading для страниц
const PracticePage = lazy(() => import('./pages/PracticePage'))
const FlashcardsPage = lazy(() => import('./pages/FlashcardsPage'))
const QuizPage = lazy(() => import('./pages/QuizPage'))

function AppContent() {
  const { 
    allQuestionsByTopic,
    clearData
  } = useQuestions()
  
  const { 
    isPracticeStarted, 
    isPracticeFinished,
    resetPractice
  } = usePractice()

  const { dialog, showConfirm, showAlert } = useDialog()

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

  return (
    <BrowserRouter basename={import.meta.env.PROD ? '/quaqa' : '/'}>
      <Layout
        onReset={resetPractice}
        onLoadFile={() => document.getElementById('xlsxFileInput')?.click()}
        onClearData={handleClearData}
        showReset={isPracticeStarted && !isPracticeFinished}
        showLoadFile={Object.keys(allQuestionsByTopic).length > 0 && !isPracticeStarted && !isPracticeFinished}
      >
        <Suspense fallback={
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '1.5em', color: '#667eea' }}>Загрузка...</div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<PracticePage />} />
            <Route path="/flashcards" element={<FlashcardsPage />} />
            <Route path="/quiz" element={<QuizPage />} />
          </Routes>
        </Suspense>
      </Layout>
      <Dialog
        isOpen={dialog.isOpen}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onCancel={dialog.onCancel}
      />
    </BrowserRouter>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <QuestionsProvider>
        <PracticeProvider>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </PracticeProvider>
      </QuestionsProvider>
    </ErrorBoundary>
  )
}

export default App

