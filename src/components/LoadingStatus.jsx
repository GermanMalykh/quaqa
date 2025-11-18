function LoadingStatus({ show, message, stats }) {
  if (!show) return null

  return (
    <div id="loadingStatus" style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
      <p>{message}</p>
      {stats.length > 0 && (
        <div style={{ marginTop: '10px', textAlign: 'left', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
          {stats.map(stat => (
            <p key={stat.name} style={{ margin: '5px 0', fontSize: '0.9em' }}>
              📋 {stat.name}: {stat.total} вопросов
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default LoadingStatus

