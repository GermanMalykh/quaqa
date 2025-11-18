import { QuestionManager } from '../utils/questionManager'

function TopicsSelection({ topics, selectedTopics, allQuestionsByTopic, onTopicToggle, totalQuestions }) {
  return (
    <div id="topicsSelection" style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '15px' }}>
      <h3 style={{ textAlign: 'center', color: '#667eea', marginBottom: '20px', fontSize: '1.2em' }}>
        Выберите темы для практики
      </h3>
      <div id="topicsCheckboxes" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px', 
        maxWidth: '800px', 
        margin: '0 auto' 
      }}>
        {topics.map(topicName => (
          <div key={topicName} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '10px', 
            background: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
          }}>
            <input
              type="checkbox"
              id={`topic_${topicName}`}
              checked={selectedTopics.includes(topicName)}
              onChange={(e) => onTopicToggle(topicName, e.target.checked)}
              style={{ width: '20px', height: '20px', marginRight: '10px', cursor: 'pointer' }}
            />
            <label 
              htmlFor={`topic_${topicName}`}
              style={{ cursor: 'pointer', fontSize: '1em', flex: 1 }}
            >
              {topicName}
            </label>
            <span style={{ color: '#667eea', fontWeight: 'bold', marginLeft: '10px' }}>
              ({QuestionManager.getTopicQuestionCount(allQuestionsByTopic, topicName)})
            </span>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        <p id="selectedTopicsInfo">
          Выбрано тем: {selectedTopics.length} | Вопросов будет: {totalQuestions}
        </p>
      </div>
    </div>
  )
}

export default TopicsSelection

