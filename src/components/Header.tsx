import PropTypes from 'prop-types'
import { memo } from 'react'
import { useLocation } from 'react-router-dom'

interface HeaderProps {
  onReset?: () => void
  onLoadFile?: () => void
  onClearData?: () => void
  showReset?: boolean
  showLoadFile?: boolean
  hideTitle?: boolean
}

function Header({ onReset, onLoadFile, onClearData, showReset, showLoadFile, hideTitle }: HeaderProps) {
  const location = useLocation()
  const isMillionairePage = location.pathname === '/millionaire'
  
  return (
    <div style={{ position: 'relative' }}>
      {/* Кнопки загрузки и сброса - над заголовком для обеих страниц */}
      {showLoadFile && (
        <div className={`header-load-buttons ${isMillionairePage ? 'millionaire-header-load-buttons' : 'practice-header-load-buttons'}`}>
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
      {/* Кнопка "Начать заново" для практики - справа вверху */}
      {!isMillionairePage && showReset && (
        <div className="header-buttons" style={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: '10px', flexDirection: 'column', alignItems: 'flex-end' }}>
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
        </div>
      )}
    </div>
  )
}

Header.propTypes = {
  onReset: PropTypes.func,
  onLoadFile: PropTypes.func,
  onClearData: PropTypes.func,
  showReset: PropTypes.bool,
  showLoadFile: PropTypes.bool,
  hideTitle: PropTypes.bool
}

export default memo(Header)

