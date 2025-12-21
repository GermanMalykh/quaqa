import { useState } from 'react'

interface AsteroidProps {
  id: string
  text: string
  x: number
  y: number
  onShoot: (id: string) => void
}

export default function Asteroid({ id, text, x, y, onShoot }: AsteroidProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    onShoot(id)
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: isHovered ? 'translate(-50%, -50%) scale(1.1)' : 'translate(-50%, -50%) scale(1)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-out',
        zIndex: 5,
        willChange: 'transform'
      }}
    >
      <div style={{
        padding: '15px 20px',
        background: isHovered 
          ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
          : 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
        borderRadius: '20px',
        border: `3px solid ${isHovered ? '#ff6b6b' : '#4ecdc4'}`,
        boxShadow: isHovered
          ? '0 0 20px rgba(255, 107, 107, 0.6), 0 5px 15px rgba(0,0,0,0.3)'
          : '0 5px 15px rgba(0,0,0,0.3)',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1em',
        textAlign: 'center',
        minWidth: '120px',
        maxWidth: '200px',
        wordWrap: 'break-word',
        transition: 'all 0.3s'
      }}>
        {text}
      </div>
    </div>
  )
}

