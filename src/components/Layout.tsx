import { Link, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { memo, ReactNode } from 'react'
import Header from './Header'
import { usePractice } from '../contexts/PracticeContext'

interface LayoutProps {
  children: ReactNode
  onReset?: () => void
  onLoadFile?: () => void
  onClearData?: () => void
  showReset?: boolean
  showLoadFile?: boolean
  hideTitle?: boolean
}

function Layout({ children, onReset, onLoadFile, onClearData, showReset, showLoadFile, hideTitle }: LayoutProps) {
  const location = useLocation()
  const { isPracticeStarted, isPracticeFinished } = usePractice()

  return (
    <div className="container">
      {/* Навигация - вверху страницы, скрыта во время практики и при показе результатов */}
      {!isPracticeStarted && !isPracticeFinished && (
      <nav style={{
        marginTop: '0',
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
          to="/millionaire"
          style={{
            padding: '10px 20px',
            textDecoration: 'none',
            borderRadius: '8px',
            background: location.pathname === '/millionaire' ? '#667eea' : 'white',
            color: location.pathname === '/millionaire' ? 'white' : '#667eea',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            border: '2px solid #667eea'
          }}
        >
          💰 Миллионер
        </Link>
      </nav>
      )}

      <Header 
        onReset={onReset}
        onLoadFile={onLoadFile}
        onClearData={onClearData}
        showReset={showReset}
        showLoadFile={showLoadFile}
        hideTitle={hideTitle}
      />

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
  showLoadFile: PropTypes.bool,
  hideTitle: PropTypes.bool
}

export default memo(Layout)

