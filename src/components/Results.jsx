import { formatTime } from '../utils/timer'
import ScrollableTable from './ScrollableTable'

function Results({ answeredQuestions, totalTime, onReset }) {
  const avgTime = answeredQuestions.length > 0 
    ? Math.floor(totalTime / answeredQuestions.length) 
    : 0

  return (
    <div className="results show">
      <h2>🎉 Результаты</h2>
      <p>Общее время: <strong>{formatTime(totalTime)}</strong></p>
      <p>Среднее время на вопрос: <strong>{formatTime(avgTime)}</strong></p>
      <ScrollableTable>
        <table className="results-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Категория</th>
              <th>Вопрос</th>
              <th>Время</th>
            </tr>
          </thead>
          <tbody>
            {answeredQuestions.map((q, idx) => (
              <tr key={idx}>
                <td>{q.number}</td>
                <td>{q.category || 'Без категории'}</td>
                <td>{q.question}</td>
                <td>{formatTime(q.time)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollableTable>
      <button className="btn btn-primary" onClick={onReset} style={{ marginTop: '20px' }}>
        Начать заново
      </button>
    </div>
  )
}

export default Results

