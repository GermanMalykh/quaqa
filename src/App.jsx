import { useState, useEffect, useCallback } from 'react'
import { Storage } from './utils/storage'
import { XLSXLoader } from './utils/xlsxLoader'
import { QuestionManager } from './utils/questionManager'
import { formatTime } from './utils/timer'
import StatsBlock from './components/StatsBlock'
import QuestionBlock from './components/QuestionBlock'
import TopicsSelection from './components/TopicsSelection'
import LoadingStatus from './components/LoadingStatus'
import ErrorStatus from './components/ErrorStatus'
import Results from './components/Results'
import FormatExample from './components/FormatExample'
import Header from './components/Header'
import Dialog from './components/Dialog'

function App() {
  const [allQuestionsByTopic, setAllQuestionsByTopic] = useState({})
  const [selectedTopics, setSelectedTopics] = useState([])
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [usedQuestionIndices, setUsedQuestionIndices] = useState([])
  const [answeredQuestions, setAnsweredQuestions] = useState([])
  
  const [showAnswer, setShowAnswer] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [isPracticeStarted, setIsPracticeStarted] = useState(false)
  const [isPracticeFinished, setIsPracticeFinished] = useState(false)
  
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [questionSeconds, setQuestionSeconds] = useState(60)
  const [questionStartTime, setQuestionStartTime] = useState(null)
  const [practiceStartTime, setPracticeStartTime] = useState(null)
  
  const [loadingStatus, setLoadingStatus] = useState({ show: true, message: 'Загрузите XLSX файл с вопросами', isError: false })
  const [error, setError] = useState(null)
  const [sheetStats, setSheetStats] = useState([])
  const [showFormatExample, setShowFormatExample] = useState(true)
  
  // Состояние для диалогов
  const [dialog, setDialog] = useState({
    isOpen: false,
    type: 'alert',
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null
  })

  // Загрузка данных при монтировании
  useEffect(() => {
    const savedData = Storage.loadQuestions()
    if (savedData && Object.keys(savedData).length > 0) {
      setAllQuestionsByTopic(savedData)
      const stats = Object.keys(savedData).map(name => ({
        name,
        total: savedData[name].length
      }))
      setSheetStats(stats)
      setLoadingStatus({ show: true, message: `✅ Загружено из сохраненных данных: ${Object.keys(savedData).length} тем`, isError: false })
      setShowFormatExample(false)
      
      // Восстанавливаем выбранные темы
      const savedCheckboxes = Storage.loadCheckboxesState()
      const topics = Object.keys(savedData)
      const selected = topics.filter(topic => savedCheckboxes[topic] !== undefined ? savedCheckboxes[topic] : topics.indexOf(topic) === 0)
      setSelectedTopics(selected)
    } else {
      // Пытаемся загрузить из файла
      XLSXLoader.loadFromURL('questions.xlsx')
        .then(result => {
          setAllQuestionsByTopic(result.questionsByTopic)
          Storage.saveQuestions(result.questionsByTopic)
          setSheetStats(result.stats)
          setLoadingStatus({ show: true, message: `✅ Автоматически загружено тем: ${Object.keys(result.questionsByTopic).length}`, isError: false })
          setShowFormatExample(false)
          
          const topics = Object.keys(result.questionsByTopic)
          const selected = topics.filter((_, idx) => idx === 0)
          setSelectedTopics(selected)
        })
        .catch(() => {
          setLoadingStatus({ show: true, message: 'Загрузите XLSX файл с вопросами', isError: false })
        })
    }
  }, [])

  // Обновление вопросов при изменении выбранных тем
  useEffect(() => {
    if (Object.keys(allQuestionsByTopic).length > 0) {
      if (selectedTopics.length > 0) {
        const result = QuestionManager.updateSelectedQuestions(allQuestionsByTopic, selectedTopics)
        setQuestions(result.questions)
      } else {
        // Если нет выбранных тем, очищаем вопросы
        setQuestions([])
      }
    }
  }, [selectedTopics, allQuestionsByTopic])

  // Таймер общей практики
  useEffect(() => {
    if (!isPracticeStarted || isPracticeFinished) return
    
    const interval = setInterval(() => {
      setTotalSeconds(prev => prev + 1)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [isPracticeStarted, isPracticeFinished])

  // Таймер вопроса
  useEffect(() => {
    if (!isPracticeStarted || isPracticeFinished || !questionStartTime) return
    
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - questionStartTime) / 1000)
      setQuestionSeconds(60 - elapsed)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [isPracticeStarted, isPracticeFinished, questionStartTime])

  const handleFileLoad = useCallback((file) => {
    setLoadingStatus({ show: true, message: 'Загрузка вопросов...', isError: false })
    setError(null)
    
    XLSXLoader.loadFromFile(file)
      .then(result => {
        setAllQuestionsByTopic(result.questionsByTopic)
        Storage.saveQuestions(result.questionsByTopic)
        setSheetStats(result.stats)
        setLoadingStatus({ show: true, message: `✅ Загружено тем: ${Object.keys(result.questionsByTopic).length}`, isError: false })
        setShowFormatExample(false)
        
        const topics = Object.keys(result.questionsByTopic)
        const selected = topics.filter((_, idx) => idx === 0)
        setSelectedTopics(selected)
      })
      .catch(err => {
        setError(err)
        setLoadingStatus({ show: false, message: '', isError: true })
      })
  }, [])

  const handleTopicToggle = useCallback((topicName, checked) => {
    setSelectedTopics(prev => {
      const newSelected = checked 
        ? [...prev, topicName]
        : prev.filter(t => t !== topicName)
      
      // Сохраняем состояние чекбоксов
      const savedCheckboxes = Storage.loadCheckboxesState()
      savedCheckboxes[topicName] = checked
      Storage.saveCheckboxesState(savedCheckboxes)
      
      return newSelected
    })
  }, [])

  const handleStartPractice = useCallback(() => {
    if (questions.length === 0) {
      setDialog({
        isOpen: true,
        type: 'alert',
        title: 'Внимание',
        message: 'Выберите хотя бы одну тему для практики!',
        onConfirm: () => setDialog(prev => ({ ...prev, isOpen: false }))
      })
      return
    }
    
    setIsPracticeStarted(true)
    setPracticeStartTime(Date.now())
    setTotalSeconds(0)
    setCurrentQuestionIndex(0)
    setAnsweredQuestions([])
    setUsedQuestionIndices([])
    setShowFormatExample(false)
    
    // Показываем первый вопрос
    const result = QuestionManager.getRandomQuestion(questions, [])
    setCurrentQuestion(result.question)
    setUsedQuestionIndices(result.usedIndices)
    setQuestionStartTime(Date.now())
    setQuestionSeconds(60)
    setShowAnswer(false)
    setShowExplanation(false)
  }, [questions])

  const handleNextQuestion = useCallback(() => {
    // Сохраняем время на текущий вопрос
    if (questionStartTime && currentQuestion) {
      const actualTimeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
      setAnsweredQuestions(prev => [...prev, {
        number: currentQuestionIndex + 1,
        category: currentQuestion.category,
        question: currentQuestion.question,
        time: actualTimeSpent
      }])
    }
    
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex >= questions.length) {
      setIsPracticeFinished(true)
      setIsPracticeStarted(false)
      return
    }
    
    setCurrentQuestionIndex(nextIndex)
    const result = QuestionManager.getRandomQuestion(questions, usedQuestionIndices)
    setCurrentQuestion(result.question)
    setUsedQuestionIndices(result.usedIndices)
    setQuestionStartTime(Date.now())
    setQuestionSeconds(60)
    setShowAnswer(false)
    setShowExplanation(false)
  }, [currentQuestionIndex, questions, usedQuestionIndices, questionStartTime, currentQuestion])

  const handleReset = useCallback(() => {
    setIsPracticeStarted(false)
    setIsPracticeFinished(false)
    setCurrentQuestionIndex(0)
    setCurrentQuestion(null)
    setAnsweredQuestions([])
    setUsedQuestionIndices([])
    setTotalSeconds(0)
    setQuestionSeconds(60)
    setQuestionStartTime(null)
    setPracticeStartTime(null)
    setShowAnswer(false)
    setShowExplanation(false)
  }, [])

  const handleToggleAnswer = useCallback(() => {
    setShowAnswer(prev => !prev)
  }, [])

  const handleToggleExplanation = useCallback(() => {
    setShowExplanation(prev => !prev)
  }, [])

  const handleClearData = useCallback(() => {
    setDialog({
      isOpen: true,
      type: 'confirm',
      title: 'Подтверждение',
      message: 'Вы уверены, что хотите очистить все сохраненные данные? Это действие нельзя отменить.',
      onConfirm: () => {
        // Очищаем localStorage
        localStorage.removeItem(Storage.STORAGE_KEY)
        localStorage.removeItem(Storage.CHECKBOXES_KEY)
        
        // Сбрасываем состояние
        setAllQuestionsByTopic({})
        setSelectedTopics([])
        setQuestions([])
        setSheetStats([])
        setError(null)
        setLoadingStatus({ show: true, message: 'Загрузите XLSX файл с вопросами', isError: false })
        setShowFormatExample(true)
        
        // Закрываем диалог подтверждения и показываем сообщение об успешной очистке
        setDialog({
          isOpen: true,
          type: 'alert',
          title: 'Успешно',
          message: 'Данные успешно очищены',
          onConfirm: () => setDialog(prev => ({ ...prev, isOpen: false }))
        })
      },
      onCancel: () => setDialog(prev => ({ ...prev, isOpen: false }))
    })
  }, [])

  return (
    <div className="container">
      <Header 
        onReset={handleReset}
        onLoadFile={() => document.getElementById('xlsxFileInput')?.click()}
        onClearData={handleClearData}
        showReset={isPracticeStarted && !isPracticeFinished}
        showLoadFile={Object.keys(allQuestionsByTopic).length > 0 && !isPracticeStarted && !isPracticeFinished}
      />
      
      <input
        type="file"
        id="xlsxFileInput"
        accept=".xlsx,.xls"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files[0]
          if (file) handleFileLoad(file)
        }}
      />

      {isPracticeStarted && !isPracticeFinished && (
        <>
          <StatsBlock 
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            totalTime={totalSeconds}
            questionTime={questionSeconds}
          />
          {currentQuestion && (
            <QuestionBlock
              question={currentQuestion}
              currentIndex={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              showAnswer={showAnswer}
              showExplanation={showExplanation}
              onToggleAnswer={handleToggleAnswer}
              onToggleExplanation={handleToggleExplanation}
              onNext={handleNextQuestion}
              canProceed={showAnswer || showExplanation || questionSeconds <= 0}
            />
          )}
        </>
      )}

      {!isPracticeStarted && !isPracticeFinished && (
        <>
          {Object.keys(allQuestionsByTopic).length > 0 && (
            <>
              <div className="desktop-load-buttons" style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '20px', marginBottom: '20px' }}>
                <button
                  onClick={() => document.getElementById('xlsxFileInput')?.click()}
                  className="btn btn-primary"
                  style={{ padding: '12px 25px', fontSize: '1em' }}
                >
                  📁 Загрузить XLSX
                </button>
                <button
                  onClick={handleClearData}
                  className="btn"
                  style={{ 
                    padding: '12px 25px', 
                    fontSize: '1em',
                    background: '#6c757d',
                    color: 'white'
                  }}
                >
                  🗑️ Сброс данных
                </button>
              </div>
              <TopicsSelection
                topics={Object.keys(allQuestionsByTopic)}
                selectedTopics={selectedTopics}
                allQuestionsByTopic={allQuestionsByTopic}
                onTopicToggle={handleTopicToggle}
                totalQuestions={questions.length}
              />
            </>
          )}
          
          <div className="controls">
            <button 
              className="btn btn-primary" 
              onClick={handleStartPractice}
              disabled={questions.length === 0}
              style={{ display: questions.length > 0 ? 'inline-block' : 'none' }}
            >
              Начать практику
            </button>
          </div>
        </>
      )}

      {isPracticeFinished && (
        <Results
          answeredQuestions={answeredQuestions}
          totalTime={Math.floor((Date.now() - practiceStartTime) / 1000)}
          onReset={handleReset}
        />
      )}

      {!isPracticeStarted && !isPracticeFinished && (
        <LoadingStatus 
          show={loadingStatus.show && !error}
          message={loadingStatus.message}
          stats={sheetStats}
        />
      )}

      {!isPracticeStarted && !isPracticeFinished && error && <ErrorStatus error={error} />}

      {!isPracticeStarted && !isPracticeFinished && showFormatExample && (
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => document.getElementById('xlsxFileInput')?.click()}
          >
            Загрузить вопросы из XLSX
          </button>
        </div>
      )}

      {!isPracticeStarted && !isPracticeFinished && showFormatExample && <FormatExample />}
      
      <Dialog
        isOpen={dialog.isOpen}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onCancel={dialog.onCancel}
      />
    </div>
  )
}

export default App

