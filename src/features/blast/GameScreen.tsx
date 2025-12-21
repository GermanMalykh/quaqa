import { useEffect, useState, useRef } from 'react'
import type { Question } from '../../types'
import Asteroid from './Asteroid'

interface AsteroidData {
  id: string
  text: string
  isCorrect: boolean
  x: number
  y: number
  destroyed: boolean
}

interface MovingAsteroid extends AsteroidData {
  vx: number  // скорость по X
  vy: number  // скорость по Y
  radius: number  // радиус для коллизий
}

interface GameScreenProps {
  currentQuestion: Question | null
  asteroids: AsteroidData[]
  timeLeft: number
  score: number
  onShoot: (asteroidId: string) => void
}

export default function GameScreen({
  currentQuestion,
  asteroids,
  timeLeft,
  score,
  onShoot
}: GameScreenProps) {
  const [stars, setStars] = useState<Array<{ x: number; y: number; size: number }>>([])
  const [movingAsteroids, setMovingAsteroids] = useState<MovingAsteroid[]>([])
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Генерация звездного фона
  useEffect(() => {
    const newStars = Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1
    }))
    setStars(newStars)
  }, [])

  // Инициализация движущихся астероидов
  useEffect(() => {
    const activeAsteroids = asteroids.filter(a => !a.destroyed)
    setMovingAsteroids(prev => {
      // Удаляем уничтоженные астероиды
      const existing = prev.filter(a => activeAsteroids.some(active => active.id === a.id))
      const existingIds = new Set(existing.map(a => a.id))
      
      // Добавляем новые астероиды
      const FIXED_SPEED = 0.15 // фиксированная скорость
      const newAsteroids = activeAsteroids
        .filter(a => !existingIds.has(a.id))
        .map(a => {
          // Случайное направление, но фиксированная скорость
          const angle = Math.random() * Math.PI * 2
          return {
            ...a,
            vx: Math.cos(angle) * FIXED_SPEED,
            vy: Math.sin(angle) * FIXED_SPEED,
            radius: 6 // радиус для коллизий в процентах (примерно размер астероида)
          }
        })
      
      // Обновляем существующие астероиды (сохраняем скорости и позиции)
      const updated = existing.map(existingAsteroid => {
        const updatedData = activeAsteroids.find(a => a.id === existingAsteroid.id)
        if (updatedData && !updatedData.destroyed) {
          // Сохраняем физические свойства (скорости, радиус, позицию)
          return { 
            ...existingAsteroid,
            text: updatedData.text,
            isCorrect: updatedData.isCorrect
          }
        }
        return existingAsteroid
      })
      
      return [...updated, ...newAsteroids]
    })
  }, [asteroids])

  // Физика движения и коллизий
  useEffect(() => {
    if (movingAsteroids.length === 0) return

    let isRunning = true

    const updatePhysics = () => {
      if (!isRunning) return

      setMovingAsteroids(prev => {
        if (prev.length === 0) return prev

        const FIXED_SPEED = 0.15 // фиксированная скорость
        
        const updated = prev.map(asteroid => {
          let { x, y, vx, vy } = asteroid
          
          // Нормализуем скорость до фиксированной
          const currentSpeed = Math.sqrt(vx * vx + vy * vy)
          if (currentSpeed > 0) {
            vx = (vx / currentSpeed) * FIXED_SPEED
            vy = (vy / currentSpeed) * FIXED_SPEED
          }
          
          // Обновляем позицию
          x += vx
          y += vy

          // Границы контейнера (5% - 95% по X, 10% - 80% по Y)
          const minX = 5
          const maxX = 95
          const minY = 10
          const maxY = 80

          // Отскок от границ (сохраняем фиксированную скорость)
          if (x <= minX || x >= maxX) {
            vx = -vx
            x = Math.max(minX, Math.min(maxX, x))
          }
          if (y <= minY || y >= maxY) {
            vy = -vy
            y = Math.max(minY, Math.min(maxY, y))
          }

          return { ...asteroid, x, y, vx, vy }
        })

        // Проверка коллизий между астероидами (только разделение, без изменения скорости)
        for (let i = 0; i < updated.length; i++) {
          for (let j = i + 1; j < updated.length; j++) {
            const a1 = updated[i]
            const a2 = updated[j]

            // Расстояние между центрами
            const dx = a2.x - a1.x
            const dy = a2.y - a1.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const minDistance = a1.radius + a2.radius

            if (distance < minDistance && distance > 0) {
              // Нормализованный вектор направления
              const nx = dx / distance
              const ny = dy / distance

              // Просто разделяем объекты, чтобы они не застревали
              const overlap = minDistance - distance
              const separationX = nx * overlap * 0.5
              const separationY = ny * overlap * 0.5

              updated[i].x -= separationX
              updated[i].y -= separationY
              updated[j].x += separationX
              updated[j].y += separationY
              
              // Меняем направление движения при столкновении, но сохраняем фиксированную скорость
              const dot1 = updated[i].vx * nx + updated[i].vy * ny
              const dot2 = updated[j].vx * nx + updated[j].vy * ny
              
              if (dot1 < 0) {
                updated[i].vx -= 2 * dot1 * nx
                updated[i].vy -= 2 * dot1 * ny
              }
              if (dot2 > 0) {
                updated[j].vx -= 2 * dot2 * nx
                updated[j].vy -= 2 * dot2 * ny
              }
              
              // Нормализуем скорости обратно до фиксированной
              const speed1 = Math.sqrt(updated[i].vx * updated[i].vx + updated[i].vy * updated[i].vy)
              const speed2 = Math.sqrt(updated[j].vx * updated[j].vx + updated[j].vy * updated[j].vy)
              
              if (speed1 > 0) {
                updated[i].vx = (updated[i].vx / speed1) * FIXED_SPEED
                updated[i].vy = (updated[i].vy / speed1) * FIXED_SPEED
              }
              if (speed2 > 0) {
                updated[j].vx = (updated[j].vx / speed2) * FIXED_SPEED
                updated[j].vy = (updated[j].vy / speed2) * FIXED_SPEED
              }
            }
          }
        }

        return updated
      })

      animationFrameRef.current = requestAnimationFrame(updatePhysics)
    }

    animationFrameRef.current = requestAnimationFrame(updatePhysics)

    return () => {
      isRunning = false
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [movingAsteroids.length])

  const timeColor = timeLeft <= 3 ? '#ff6b6b' : timeLeft <= 5 ? '#ffa500' : '#4ecdc4'

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '80vh',
      background: 'linear-gradient(180deg, #0a0e27 0%, #1a1f3a 100%)',
      borderRadius: '20px',
      overflow: 'hidden',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {/* Звездный фон */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none'
      }}>
        {stars.map((star, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: 'white',
              borderRadius: '50%',
              opacity: 0.8,
              animation: 'twinkle 3s infinite',
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Верхняя панель */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '15px 20px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            padding: '8px 15px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.1em'
          }}>
            Очки: {score}
          </div>
        </div>

        <div style={{
          padding: '10px 20px',
          background: timeColor,
          borderRadius: '25px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.3em',
          minWidth: '80px',
          textAlign: 'center',
          boxShadow: `0 0 20px ${timeColor}40`,
          animation: timeLeft <= 3 ? 'pulse 1s infinite' : 'none'
        }}>
          {timeLeft}с
        </div>
      </div>

      {/* Вопрос */}
      {currentQuestion && (
        <div style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          marginBottom: '40px',
          padding: '25px',
          background: 'rgba(102, 126, 234, 0.2)',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(102, 126, 234, 0.3)'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '1.5em',
            margin: 0,
            lineHeight: '1.4',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            {currentQuestion.question}
          </h2>
        </div>
      )}

      {/* Игровое поле с астероидами */}
      <div 
        ref={gameAreaRef}
        style={{
          position: 'relative',
          flex: 1,
          minHeight: '400px',
          width: '100%',
          marginTop: '20px',
          overflow: 'hidden'
        }}
      >
        {movingAsteroids
          .filter(a => !a.destroyed)
          .map(asteroid => (
            <Asteroid
              key={asteroid.id}
              id={asteroid.id}
              text={asteroid.text}
              x={asteroid.x}
              y={asteroid.y}
              onShoot={onShoot}
            />
          ))}
      </div>

      {/* Корабль внизу */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%) rotate(-45deg)',
        zIndex: 10,
        fontSize: '3em',
        filter: 'drop-shadow(0 0 10px rgba(76, 205, 196, 0.5))'
      }}>
        🚀
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}

