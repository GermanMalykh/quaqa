import { useState, useEffect } from 'react'
import { useQuestions } from '../contexts/QuestionsContext'
import type { GameId, GameQuestionConfig } from '../types'

interface GameInfo {
  id: GameId
  name: string
  description: string
}

const GAMES: GameInfo[] = [
  { id: 'practice', name: 'Практика', description: 'Тренировка ответов на вопросы' },
  { id: 'blast', name: 'Blast', description: 'Игра с астероидами' },
  { id: 'millionaire', name: 'Миллионер', description: 'Кто хочет стать миллионером' },
  { id: 'flashcards', name: 'Флэшкарты', description: 'Карточки для запоминания' },
  { id: 'quiz', name: 'Викторина', description: 'Быстрая викторина' },
]

export default function QuestionConfig() {
  const { 
    allQuestionsByTopic, 
    selectedTopics,
    gamesConfig,
    updateGameConfig,
    getGameConfig,
    toggleTopic
  } = useQuestions()

  const [expandedGame, setExpandedGame] = useState<GameId | null>(null)

  const handleSourceChange = (gameId: GameId, source: 'common' | 'separate') => {
    const currentConfig = getGameConfig(gameId)
    const gameTopics = currentConfig?.selectedTopics || selectedTopics
    
    updateGameConfig(gameId, {
      source,
      selectedTopics: source === 'common' ? [] : gameTopics
    })
  }

  const handleTopicToggle = (gameId: GameId, topicName: string, checked: boolean) => {
    const currentConfig = getGameConfig(gameId)
    const currentTopics = currentConfig?.selectedTopics || []
    
    const newTopics = checked
      ? [...currentTopics, topicName]
      : currentTopics.filter(t => t !== topicName)
    
    updateGameConfig(gameId, {
      source: 'separate',
      selectedTopics: newTopics
    })
  }

  const getGameTopics = (gameId: GameId): string[] => {
    const config = getGameConfig(gameId)
    if (!config || config.source === 'common') {
      return selectedTopics
    }
    return config.selectedTopics
  }

  const availableTopics = Object.keys(allQuestionsByTopic)

  if (availableTopics.length === 0) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        color: '#666',
        background: '#f5f5f5',
        borderRadius: '10px',
        margin: '20px 0'
      }}>
        <p>Загрузите XLSX файл с вопросами, чтобы настроить конфигурацию</p>
      </div>
    )
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      padding: '30px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      margin: '20px 0'
    }}>
      <h2 style={{
        marginTop: 0,
        marginBottom: '30px',
        color: '#333',
        fontSize: '1.8em',
        borderBottom: '2px solid #667eea',
        paddingBottom: '15px'
      }}>
        ⚙️ Конфигурация вопросов для игр
      </h2>

      <p style={{
        color: '#666',
        marginBottom: '30px',
        lineHeight: '1.6'
      }}>
        Настройте источники вопросов для каждой игры. Вы можете использовать общие вопросы 
        или загрузить отдельные наборы для каждой игры.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {GAMES.map(game => {
          const config = getGameConfig(game.id)
          const source = config?.source || 'common'
          const gameTopics = getGameTopics(game.id)
          const isExpanded = expandedGame === game.id

          return (
            <div
              key={game.id}
              style={{
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                overflow: 'hidden',
                transition: 'all 0.3s'
              }}
            >
              {/* Заголовок игры */}
              <div
                style={{
                  padding: '20px',
                  background: isExpanded ? '#f8f9ff' : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background 0.2s'
                }}
                onClick={() => setExpandedGame(isExpanded ? null : game.id)}
              >
                <div>
                  <h3 style={{ margin: 0, color: '#333', fontSize: '1.3em' }}>
                    {game.name}
                  </h3>
                  <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9em' }}>
                    {game.description}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{
                    padding: '5px 15px',
                    background: source === 'common' ? '#667eea' : '#4ecdc4',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.85em',
                    fontWeight: 'bold'
                  }}>
                    {source === 'common' ? 'Общие вопросы' : 'Отдельные вопросы'}
                  </span>
                  <span style={{ fontSize: '1.5em', color: '#999' }}>
                    {isExpanded ? '▼' : '▶'}
                  </span>
                </div>
              </div>

              {/* Конфигурация игры */}
              {isExpanded && (
                <div style={{ padding: '20px', background: '#fafafa', borderTop: '1px solid #e0e0e0' }}>
                  {/* Выбор источника */}
                  <div style={{ marginBottom: '25px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '15px',
                      fontWeight: 'bold',
                      color: '#333'
                    }}>
                      Источник вопросов:
                    </label>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        padding: '10px 15px',
                        background: source === 'common' ? '#667eea' : 'white',
                        color: source === 'common' ? 'white' : '#333',
                        borderRadius: '8px',
                        border: `2px solid ${source === 'common' ? '#667eea' : '#ddd'}`,
                        transition: 'all 0.2s'
                      }}>
                        <input
                          type="radio"
                          name={`source-${game.id}`}
                          checked={source === 'common'}
                          onChange={() => handleSourceChange(game.id, 'common')}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>Общие вопросы</span>
                      </label>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        padding: '10px 15px',
                        background: source === 'separate' ? '#4ecdc4' : 'white',
                        color: source === 'separate' ? 'white' : '#333',
                        borderRadius: '8px',
                        border: `2px solid ${source === 'separate' ? '#4ecdc4' : '#ddd'}`,
                        transition: 'all 0.2s'
                      }}>
                        <input
                          type="radio"
                          name={`source-${game.id}`}
                          checked={source === 'separate'}
                          onChange={() => handleSourceChange(game.id, 'separate')}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>Отдельные вопросы</span>
                      </label>
                    </div>
                  </div>

                  {/* Выбор тем (только для отдельных вопросов) */}
                  {source === 'separate' && (
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '15px',
                        fontWeight: 'bold',
                        color: '#333'
                      }}>
                        Выберите темы для этой игры:
                      </label>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '10px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        padding: '10px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}>
                        {availableTopics.map(topic => {
                          const isSelected = gameTopics.includes(topic)
                          const questionCount = allQuestionsByTopic[topic]?.length || 0
                          
                          return (
                            <label
                              key={topic}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px',
                                background: isSelected ? '#e8f5e9' : 'white',
                                border: `2px solid ${isSelected ? '#4caf50' : '#ddd'}`,
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => handleTopicToggle(game.id, topic, e.target.checked)}
                                style={{ cursor: 'pointer' }}
                              />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold', color: '#333' }}>
                                  {topic}
                                </div>
                                <div style={{ fontSize: '0.85em', color: '#666' }}>
                                  {questionCount} вопросов
                                </div>
                              </div>
                            </label>
                          )
                        })}
                      </div>
                      {gameTopics.length === 0 && (
                        <p style={{
                          marginTop: '10px',
                          color: '#ff9800',
                          fontSize: '0.9em',
                          fontStyle: 'italic'
                        }}>
                          ⚠️ Выберите хотя бы одну тему для этой игры
                        </p>
                      )}
                    </div>
                  )}

                  {source === 'common' && (
                    <div style={{
                      padding: '15px',
                      background: '#e3f2fd',
                      borderRadius: '8px',
                      color: '#1976d2'
                    }}>
                      <strong>ℹ️</strong> Используются общие выбранные темы из раздела "Вопросы"
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

