function Header({ onReset, onLoadFile, onClearData, showReset, showLoadFile }) {
  return (
    <div style={{ position: 'relative' }}>
      <h1>🎯 Практика вопросов</h1>
      <div className="header-buttons" style={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: '10px', flexDirection: 'column', alignItems: 'flex-end' }}>
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
          <div className="header-load-buttons" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
            <button
              id="clearDataBtn"
              onClick={onClearData}
              style={{
                padding: '10px 20px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9em',
                fontWeight: 'bold',
                boxShadow: '0 3px 10px rgba(108, 117, 125, 0.3)',
                transition: 'all 0.3s',
                whiteSpace: 'nowrap'
              }}
            >
              🗑️ Сброс данных
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header

