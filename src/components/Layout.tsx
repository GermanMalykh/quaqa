import { Link, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { memo, ReactNode } from 'react'
import Header from './Header'

interface LayoutProps {
  children: ReactNode
  onReset?: () => void
  onLoadFile?: () => void
  onClearData?: () => void
  showReset?: boolean
  showLoadFile?: boolean
}

function Layout({ children, onReset, onLoadFile, onClearData, showReset, showLoadFile }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="container">
      <Header 
        onReset={onReset}
        onLoadFile={onLoadFile}
        onClearData={onClearData}
        showReset={showReset}
        showLoadFile={showLoadFile}
      />
      
      {/* Навигация - скрыта до реализации модулей */}
      {false && (
        <nav style={{
          marginTop: '20px',
          marginBottom: '20px',
          padding: '15px',
          background: '#f8f9fa',
          borderRadius: '10px',
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link
            to="/"
            style={{
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '8px',
              background: location.pathname === '/' ? '#667eea' : 'white',
              color: location.pathname === '/' ? 'white' : '#667eea',
              fontWeight: 'bold',
              transition: 'all 0.3s',
              border: '2px solid #667eea'
            }}
          >
            🎯 Практика
          </Link>
          <Link
            to="/flashcards"
            style={{
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '8px',
              background: location.pathname === '/flashcards' ? '#667eea' : 'white',
              color: location.pathname === '/flashcards' ? 'white' : '#667eea',
              fontWeight: 'bold',
              transition: 'all 0.3s',
              border: '2px solid #667eea',
              opacity: 0.5,
              cursor: 'not-allowed'
            }}
            onClick={(e) => e.preventDefault()}
            title="Скоро будет доступно"
          >
            📚 Карточки
          </Link>
          <Link
            to="/quiz"
            style={{
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '8px',
              background: location.pathname === '/quiz' ? '#667eea' : 'white',
              color: location.pathname === '/quiz' ? 'white' : '#667eea',
              fontWeight: 'bold',
              transition: 'all 0.3s',
              border: '2px solid #667eea',
              opacity: 0.5,
              cursor: 'not-allowed'
            }}
            onClick={(e) => e.preventDefault()}
            title="Скоро будет доступно"
          >
            🎲 Квиз
          </Link>
        </nav>
      )}

      {children}
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  onReset: PropTypes.func,
  onLoadFile: PropTypes.func,
  onClearData: PropTypes.func,
  showReset: PropTypes.bool,
  showLoadFile: PropTypes.bool
}

export default memo(Layout)

