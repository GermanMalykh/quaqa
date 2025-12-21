import { lazy, Suspense } from 'react'
import { useQuestions } from '../contexts/QuestionsContext'

// Code splitting - lazy loading для features
const BlastView = lazy(() => import('../features/blast/BlastView'))

function BlastPage() {
  const { 
    loadFromFile
  } = useQuestions()

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
        <BlastView />
      </Suspense>
    </>
  )
}

export default BlastPage

