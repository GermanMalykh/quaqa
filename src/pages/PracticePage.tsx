import { lazy, Suspense } from 'react'
import { useQuestions } from '../contexts/QuestionsContext'
import { usePractice } from '../contexts/PracticeContext'

// Code splitting - lazy loading для features
const PracticeView = lazy(() => import('../features/practice/PracticeView'))
const ResultsView = lazy(() => import('../features/practice/ResultsView'))
const QuestionsSetupView = lazy(() => import('../features/questions/QuestionsSetupView'))

function PracticePage() {
  const { 
    loadFromFile
  } = useQuestions()
  
  const { 
    isPracticeStarted, 
    isPracticeFinished
  } = usePractice()

  const handleFileLoad = async (file: File) => {
    try {
      await loadFromFile(file)
    } catch (error) {
      // Ошибка уже обработана в контексте
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

      <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px' }}>Загрузка...</div>}>
        <PracticeView />
        <ResultsView />
        <QuestionsSetupView />
      </Suspense>
    </>
  )
}

export default PracticePage

