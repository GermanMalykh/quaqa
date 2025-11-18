function Header({ onReset, onLoadFile, showReset, showLoadFile }) {
  return (
    <div style={{ position: 'relative' }}>
      <h1>🎯 Практика вопросов</h1>
      <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: '10px', flexDirection: 'column', alignItems: 'flex-end' }}>
        {showReset && (
          <button
            id="restartBtn"
            onClick={onReset}
            style={{
              padding: '10px 20px',
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9em',
              fontWeight: 'bold',
              boxShadow: '0 3px 10px rgba(255, 107, 107, 0.3)',
              transition: 'all 0.3s',
              whiteSpace: 'nowrap'
            }}
          >
            ↻ Начать заново
          </button>
        )}
        {showLoadFile && (
          <button
            id="loadFileBtnTop"
            onClick={onLoadFile}
            style={{
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9em',
              fontWeight: 'bold',
              boxShadow: '0 3px 10px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s',
              whiteSpace: 'nowrap'
            }}
          >
            📁 Загрузить XLSX
          </button>
        )}
      </div>
    </div>
  )
}

export default Header

