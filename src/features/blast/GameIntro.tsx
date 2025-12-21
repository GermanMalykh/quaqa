interface GameIntroProps {
  onStart: () => void
}

export default function GameIntro({ onStart }: GameIntroProps) {
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
        fontSize: '4em',
        marginBottom: '30px',
        animation: 'pulse 2s infinite'
      }}>
        🚀
      </div>
      
      <h1 style={{
        fontSize: '2.5em',
        marginBottom: '30px',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        Сыграйте в Blast!
      </h1>
      
      <p style={{
        fontSize: '1.2em',
        marginBottom: '40px',
        maxWidth: '600px',
        lineHeight: '1.6',
        opacity: 0.95
      }}>
        Подбирайте определения к правильным терминам. Нажмите или коснитесь правильного астероида, 
        чтобы сбить его со своего корабля, пока время не истекло!
      </p>
      
      <div style={{
        marginBottom: '30px',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)'
      }}>
        <h3 style={{ marginBottom: '15px', fontSize: '1.3em' }}>Правила игры:</h3>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          textAlign: 'left',
          maxWidth: '500px'
        }}>
          <li style={{ marginBottom: '10px' }}>⏱️ На каждый ответ дается 10 секунд</li>
          <li style={{ marginBottom: '10px' }}>✅ Правильный ответ: +2 секунды</li>
          <li style={{ marginBottom: '10px' }}>❌ Неправильный ответ: -2 секунды</li>
          <li style={{ marginBottom: '10px' }}>🎯 После каждого правильного ответа добавляется новый астероид</li>
        </ul>
      </div>
      
      <button
        onClick={onStart}
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
        Играть
      </button>
    </div>
  )
}

