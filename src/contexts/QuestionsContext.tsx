import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Storage } from '../utils/storage'
import { XLSXLoader } from '../utils/xlsxLoader'
import { QuestionManager } from '../utils/questionManager'
import type { 
  QuestionsContextValue, 
  QuestionsByTopic, 
  Question, 
  LoadingStatus, 
  SheetStat,
  XLSXLoadResult
} from '../types'

const QuestionsContext = createContext<QuestionsContextValue | null>(null)

interface QuestionsProviderProps {
  children: ReactNode
}

export function QuestionsProvider({ children }: QuestionsProviderProps) {
  const [allQuestionsByTopic, setAllQuestionsByTopic] = useState<QuestionsByTopic>({})
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>({ 
    show: true, 
    message: 'Загрузите XLSX файл с вопросами', 
    isError: false 
  })
  const [error, setError] = useState<Error | string | null>(null)
  const [sheetStats, setSheetStats] = useState<SheetStat[]>([])
  const [showFormatExample, setShowFormatExample] = useState(true)

  // Загрузка данных при монтировании
  useEffect(() => {
    const savedData = Storage.loadQuestions()
    if (savedData && Object.keys(savedData).length > 0) {
      setAllQuestionsByTopic(savedData)
      const stats: SheetStat[] = Object.keys(savedData).map(name => ({
        name,
        total: savedData[name].length
      }))
      setSheetStats(stats)
      setLoadingStatus({ 
        show: true, 
        message: `✅ Загружено из сохраненных данных: ${Object.keys(savedData).length} тем`, 
        isError: false 
      })
      setShowFormatExample(false)
      
      // Восстанавливаем выбранные темы
      const savedCheckboxes = Storage.loadCheckboxesState()
      const topics = Object.keys(savedData)
      const selected = topics.filter(topic => 
        savedCheckboxes[topic] !== undefined ? savedCheckboxes[topic] : topics.indexOf(topic) === 0
      )
      setSelectedTopics(selected)
    } else {
      // Пытаемся загрузить из файла
      XLSXLoader.loadFromURL('questions.xlsx')
        .then(result => {
          setAllQuestionsByTopic(result.questionsByTopic)
          Storage.saveQuestions(result.questionsByTopic)
          setSheetStats(result.stats)
          setLoadingStatus({ 
            show: true, 
            message: `✅ Автоматически загружено тем: ${Object.keys(result.questionsByTopic).length}`, 
            isError: false 
          })
          setShowFormatExample(false)
          
          const topics = Object.keys(result.questionsByTopic)
          const selected = topics.filter((_, idx) => idx === 0)
          setSelectedTopics(selected)
        })
        .catch(() => {
          setLoadingStatus({ 
            show: true, 
            message: 'Загрузите XLSX файл с вопросами', 
            isError: false 
          })
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
        setQuestions([])
      }
    }
  }, [selectedTopics, allQuestionsByTopic])

  const loadFromFile = useCallback((file: File): Promise<XLSXLoadResult> => {
    setLoadingStatus({ show: true, message: 'Загрузка вопросов...', isError: false })
    setError(null)
    
    return XLSXLoader.loadFromFile(file)
      .then(result => {
        setAllQuestionsByTopic(result.questionsByTopic)
        Storage.saveQuestions(result.questionsByTopic)
        setSheetStats(result.stats)
        setLoadingStatus({ 
          show: true, 
          message: `✅ Загружено тем: ${Object.keys(result.questionsByTopic).length}`, 
          isError: false 
        })
        setShowFormatExample(false)
        
        const topics = Object.keys(result.questionsByTopic)
        const selected = topics.filter((_, idx) => idx === 0)
        setSelectedTopics(selected)
        return result
      })
      .catch(err => {
        setError(err)
        setLoadingStatus({ show: false, message: '', isError: true })
        throw err
      })
  }, [])

  const toggleTopic = useCallback((topicName: string, checked: boolean) => {
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

  const clearData = useCallback(() => {
    localStorage.removeItem(Storage.STORAGE_KEY)
    localStorage.removeItem(Storage.CHECKBOXES_KEY)
    
    setAllQuestionsByTopic({})
    setSelectedTopics([])
    setQuestions([])
    setSheetStats([])
    setError(null)
    setLoadingStatus({ 
      show: true, 
      message: 'Загрузите XLSX файл с вопросами', 
      isError: false 
    })
    setShowFormatExample(true)
  }, [])

  const value: QuestionsContextValue = {
    // State
    allQuestionsByTopic,
    selectedTopics,
    questions,
    loadingStatus,
    error,
    sheetStats,
    showFormatExample,
    // Actions
    loadFromFile,
    toggleTopic,
    clearData,
  }

  return (
    <QuestionsContext.Provider value={value}>
      {children}
    </QuestionsContext.Provider>
  )
}

export function useQuestions(): QuestionsContextValue {
  const context = useContext(QuestionsContext)
  if (!context) {
    throw new Error('useQuestions must be used within QuestionsProvider')
  }
  return context
}

