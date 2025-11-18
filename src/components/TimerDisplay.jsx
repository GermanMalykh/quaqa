function TimerDisplay({ seconds }) {
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <div className="timer" id="mainTimer">
      {formatTime(seconds)}
    </div>
  )
}

export default TimerDisplay

