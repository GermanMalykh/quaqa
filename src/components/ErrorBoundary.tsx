import { Component, ReactNode, ErrorInfo } from 'react'
import PropTypes from 'prop-types'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
  onReset?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback && this.state.error) {
        return this.props.fallback(this.state.error, this.handleReset)
      }

      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          background: '#fff5f5',
          borderRadius: '15px',
          border: '2px solid #ee5a6f',
          margin: '20px'
        }}>
          <h2 style={{ color: '#ee5a6f', marginBottom: '20px' }}>
            ⚠️ Произошла ошибка
          </h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            {this.state.error?.message || 'Неизвестная ошибка'}
          </p>
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details style={{ 
              textAlign: 'left', 
              marginTop: '20px',
              padding: '15px',
              background: 'white',
              borderRadius: '8px',
              fontSize: '0.9em'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
                Детали ошибки (только в режиме разработки)
              </summary>
              <pre style={{ 
                overflow: 'auto', 
                maxHeight: '300px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button
            onClick={this.handleReset}
            style={{
              marginTop: '20px',
              padding: '12px 30px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: 'bold'
            }}
          >
            Попробовать снова
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.func,
  onReset: PropTypes.func
}

export default ErrorBoundary

