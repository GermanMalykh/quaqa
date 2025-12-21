interface GameStats {
  score: number
  correctAnswers: number
  wrongAnswers: number
}

interface GameOverProps {
  stats: GameStats
  onRestart: () => void
}

export default function GameOver({ stats, onRestart }: GameOverProps) {
  const accuracy = stats.correctAnswers + stats.wrongAnswers > 0
    ? Math.round((stats.correctAnswers / (stats.correctAnswers + stats.wrongAnswers)) * 100)
    : 0

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px',
      color: 'white',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '5em',
        marginBottom: '20px',
        animation: 'bounce 1s infinite'
      }}>
        🎯
      </div>
      
      <h1 style={{
        fontSize: '2.5em',
        marginBottom: '40px',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        Игра окончена!
      </h1>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '40px',
        backdropFilter: 'blur(10px)',
        minWidth: '300px',
        maxWidth: '500px'
      }}>
        <h2 style={{ marginBottom: '25px', fontSize: '1.5em' }}>Статистика</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div style={{
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '2em', marginBottom: '5px' }}>🏆</div>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{stats.score}</div>
            <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Очки</div>
          </div>
          
          <div style={{
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '2em', marginBottom: '5px' }}>✅</div>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{stats.correctAnswers}</div>
            <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Правильных</div>
          </div>
          
          <div style={{
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '2em', marginBottom: '5px' }}>❌</div>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{stats.wrongAnswers}</div>
            <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Неправильных</div>
          </div>
          
          <div style={{
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '2em', marginBottom: '5px' }}>🎯</div>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{accuracy}%</div>
            <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Точность</div>
          </div>
        </div>
      </div>
      
      <button
        onClick={onRestart}
        style={{
          padding: '15px 40px',
          fontSize: '1.3em',
          fontWeight: 'bold',
          background: 'white',
          color: '#667eea',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          transition: 'all 0.3s',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)'
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'
        }}
      >
        Играть снова
      </button>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}

