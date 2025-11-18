import { useState, useRef, useEffect } from 'react'

function ScrollableTable({ children, className = '', style = {} }) {
  const scrollContainerRef = useRef(null)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    const canScroll = scrollWidth > clientWidth
    const isAtStart = scrollLeft <= 1
    
    // Показываем стрелку вправо только если можно прокручивать и мы в начале
    // После начала прокрутки стрелка исчезает
    setShowRightArrow(canScroll && isAtStart)
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    // Проверяем после небольшой задержки, чтобы контейнер успел отрендериться
    const timeoutId = setTimeout(() => {
      checkScrollPosition()
    }, 100)

    container.addEventListener('scroll', checkScrollPosition)
    window.addEventListener('resize', checkScrollPosition)

    return () => {
      clearTimeout(timeoutId)
      container.removeEventListener('scroll', checkScrollPosition)
      window.removeEventListener('resize', checkScrollPosition)
    }
  }, [children])

  return (
    <div 
      ref={scrollContainerRef}
      className={`scrollable-table-container ${className}`}
      style={{ 
        overflowX: 'auto', 
        marginTop: '20px',
        position: 'relative',
        scrollbarWidth: 'thin',
        scrollbarColor: '#667eea #f1f1f1',
        ...style
      }}
    >
      {showRightArrow && (
        <div 
          className="scroll-indicator scroll-indicator-right"
          style={{
            position: 'absolute',
            right: '5px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#667eea',
            fontSize: '1.5em',
            fontWeight: 'bold',
            pointerEvents: 'none',
            zIndex: 10,
            opacity: 0.7,
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
          }}
        >
          →
        </div>
      )}
      {children}
    </div>
  )
}

export default ScrollableTable

