import '@/styles/millionaire/main.scss'

export default function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="millionaire-start-content">
      <h2>💰 Кто хочет стать QA инженером?</h2>
      <p>Проверьте свои знания в области тестирования программного обеспечения</p>
      <button onClick={onStart} className="millionaire-btn millionaire-btn-primary">
        Начать игру
      </button>
    </div>
  )
}

