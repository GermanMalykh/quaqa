import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { PracticeProvider } from './contexts/PracticeContext'
import { QuestionsProvider } from './contexts/QuestionsContext'
import { MillionaireProvider } from './contexts/MillionaireContext'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import { useQuestions } from './contexts/QuestionsContext'
import { usePractice } from './contexts/PracticeContext'
import { useMillionaire } from './contexts/MillionaireContext'
import { useDialog } from './hooks/useDialog'
import Dialog from './components/Dialog'
import { MillionaireLoader } from './utils/millionaireLoader'

// Code splitting - lazy loading для страниц
const PracticePage = lazy(() => import('./pages/PracticePage'))
const FlashcardsPage = lazy(() => import('./pages/FlashcardsPage'))
const QuizPage = lazy(() => import('./pages/QuizPage'))
const MillionairePage = lazy(() => import('./pages/MillionairePage'))
const ConfigPage = lazy(() => import('./pages/ConfigPage'))

function AppContent() {
  const { 
    allQuestionsByTopic,
    clearData,
    loadFromFile
  } = useQuestions()
  
  const { 
    isPracticeStarted, 
    isPracticeFinished,
    resetPractice
  } = usePractice()

  const { dialog, showConfirm, showAlert } = useDialog()

  return (
    <BrowserRouter basename={import.meta.env.PROD ? '/quaqa' : '/'}>
      <AppRouterContent 
        allQuestionsByTopic={allQuestionsByTopic}
        clearData={clearData}
        loadFromFile={loadFromFile}
        isPracticeStarted={isPracticeStarted}
        isPracticeFinished={isPracticeFinished}
        resetPractice={resetPractice}
        showConfirm={showConfirm}
        showAlert={showAlert}
        dialog={dialog}
      />
    </BrowserRouter>
  )
}

interface AppRouterContentProps {
  allQuestionsByTopic: any
  clearData: () => void
  loadFromFile: (file: File) => Promise<void>
  isPracticeStarted: boolean
  isPracticeFinished: boolean
  resetPractice: () => void
  showConfirm: (title: string, message: string) => Promise<boolean>
  showAlert: (title: string, message: string) => Promise<void>
  dialog: any
}

function AppRouterContent({
  allQuestionsByTopic,
  clearData,
  loadFromFile,
  isPracticeStarted,
  isPracticeFinished,
  resetPractice,
  showConfirm,
  showAlert,
  dialog
}: AppRouterContentProps) {
  const location = useLocation()
  const isMillionairePage = location.pathname === '/millionaire'
  const { isGameStarted, isGameFinished, resetGame, hasQuestions } = useMillionaire()

  const handleClearData = async () => {
    if (isMillionairePage) {
      // Очистка данных миллионера
      const confirmed = await showConfirm(
        'Подтверждение',
        'Вы уверены, что хотите очистить все сохраненные вопросы для игры "Миллионер"? Это действие нельзя отменить.'
      )
      
      if (confirmed) {
        MillionaireLoader.clearStorage()
        await showAlert('Успешно', 'Данные миллионера успешно очищены')
        // Перезагружаем страницу для обновления состояния
        window.location.reload()
      }
    } else {
      // Очистка данных практики
      const confirmed = await showConfirm(
        'Подтверждение',
        'Вы уверены, что хотите очистить все сохраненные данные? Это действие нельзя отменить.'
      )
      
      if (confirmed) {
        clearData()
        await showAlert('Успешно', 'Данные успешно очищены')
      }
    }
  }

  const handleFileLoad = async (file: File) => {
    if (isMillionairePage) {
      // Загрузка файла для миллионера
      try {
        await MillionaireLoader.loadFromFile(file)
        await showAlert('Успешно', 'Вопросы для миллионера успешно загружены')
        // Перезагружаем страницу для обновления состояния
        window.location.reload()
      } catch (error) {
        await showAlert('Ошибка', error instanceof Error ? error.message : 'Ошибка загрузки файла')
      }
    } else {
      // Загрузка файла для практики
      try {
        await loadFromFile(file)
      } catch (error) {
        // Ошибка уже обработана в контексте
      }
    }
  }

  const handleResetMillionaire = async () => {
    const confirmed = await showConfirm(
      'Подтверждение',
      'Вы уверены, что хотите начать игру заново? Текущий прогресс будет потерян.'
    )
    
    if (confirmed) {
      resetGame()
      // Перезагружаем страницу для сброса состояния игры
      window.location.reload()
    }
  }

  return (
    <>
      <input
        type="file"
        id="xlsxFileInput"
        accept=".xlsx,.xls"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileLoad(file)
        }}
      />
      <input
        type="file"
        id="millionaireFileInput"
        accept=".xlsx,.xls"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileLoad(file)
        }}
      />
      <Layout
        onReset={isMillionairePage ? handleResetMillionaire : resetPractice}
        onLoadFile={() => {
          if (isMillionairePage) {
            document.getElementById('millionaireFileInput')?.click()
          } else {
            document.getElementById('xlsxFileInput')?.click()
          }
        }}
        onClearData={handleClearData}
        showReset={!isMillionairePage && (isPracticeStarted && !isPracticeFinished)}
        showLoadFile={isMillionairePage ? (hasQuestions && !isGameStarted && !isGameFinished) : (Object.keys(allQuestionsByTopic).length > 0 && !isPracticeStarted && !isPracticeFinished)}
        hideTitle={true}
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
            <Route path="/millionaire" element={<MillionairePage />} />
            <Route path="/config" element={<ConfigPage />} />
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
    </>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <QuestionsProvider>
        <PracticeProvider>
          <MillionaireProvider>
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </MillionaireProvider>
        </PracticeProvider>
      </QuestionsProvider>
    </ErrorBoundary>
  )
}

export default App

