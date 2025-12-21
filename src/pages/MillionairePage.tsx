import { lazy, Suspense } from 'react'

// Code splitting - lazy loading для features
const MillionaireView = lazy(() => import('../features/millionaire/MillionaireView'))

export default function MillionairePage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '1.5em', color: '#667eea' }}>Загрузка...</div>
        </div>
      }
    >
      <MillionaireView />
    </Suspense>
  )
}

