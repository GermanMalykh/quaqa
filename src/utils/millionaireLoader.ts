import * as XLSX from 'xlsx'
import { XLSXLoader } from './xlsxLoader'
import { MillionaireQuestionConverter } from './millionaireQuestionConverter'
import { Storage } from './storage'
import type { Question, MillionaireQuestion } from '../types'

/**
 * Модуль для загрузки и обработки вопросов для игры "Миллионер"
 */
export const MillionaireLoader = {
  /**
   * Загружает вопросы из XLSX файла в формате миллионера
   * Формат: id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, topic, level
   */
  loadFromFile(file: File): Promise<MillionaireQuestion[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = function(e: ProgressEvent<FileReader>) {
        try {
          if (!e.target?.result) {
            reject(new Error('Ошибка чтения файла'))
            return
          }
          
          const data = new Uint8Array(e.target.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          
          if (workbook.SheetNames.length === 0) {
            reject(new Error('NO_SHEETS: В файле нет листов'))
            return
          }
          
          // Читаем первый лист
          const worksheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]
          
          if (jsonData.length === 0) {
            reject(new Error('NO_QUESTIONS: Не найдено ни одного вопроса в файле'))
            return
          }
          
          const millionaireQuestions: MillionaireQuestion[] = []
          
          jsonData.forEach((row, index) => {
            const question = String(row.question || row.Вопрос || '').trim()
            const answerA = String(row.answer_a || row['answer_a'] || '').trim()
            const answerB = String(row.answer_b || row['answer_b'] || '').trim()
            const answerC = String(row.answer_c || row['answer_c'] || '').trim()
            const answerD = String(row.answer_d || row['answer_d'] || '').trim()
            const correctAnswer = String(row.correct_answer || row['correct_answer'] || '').toUpperCase().trim()
            const explanation = String(row.explanation || row['explanation'] || row.Explanation || '').trim()
            const topic = String(row.topic || row['topic'] || row.Topic || '').trim()
            
            // Отладка для первого вопроса
            if (index === 0) {
              console.log('Первый вопрос из файла:', {
                rowKeys: Object.keys(row),
                explanationRaw: row.explanation,
                explanationProcessed: explanation,
                explanationLength: explanation.length
              })
            }
            
            if (!question || !answerA || !answerB || !answerC || !answerD || !correctAnswer) {
              return // Пропускаем неполные вопросы
            }
            
            // Определяем индекс правильного ответа
            let correctIndex = 0
            if (correctAnswer === 'A') correctIndex = 0
            else if (correctAnswer === 'B') correctIndex = 1
            else if (correctAnswer === 'C') correctIndex = 2
            else if (correctAnswer === 'D') correctIndex = 3
            else {
              // Если не указан правильно, используем первый
              correctIndex = 0
            }
            
            // Определяем сложность из level
            let difficulty: 1 | 2 | 3 | 4 = 2 // По умолчанию средний
            const level = String(row.level || row.Level || '').toLowerCase().trim()
            if (level === 'easy') difficulty = 1
            else if (level === 'medium') difficulty = 2
            else if (level === 'hard') difficulty = 3
            else {
              // Если level не указан, определяем по позиции или используем средний
              difficulty = 2
            }
            
            // Создаем массив ответов
            const answers = [
              { text: answerA, isCorrect: correctIndex === 0 },
              { text: answerB, isCorrect: correctIndex === 1 },
              { text: answerC, isCorrect: correctIndex === 2 },
              { text: answerD, isCorrect: correctIndex === 3 },
            ]
            
            const questionObj = {
              id: row.id || Date.now() + index,
              text: question,
              answers: answers,
              difficulty: difficulty,
              explanation: explanation && explanation.length > 0 ? explanation : undefined,
              topic: topic && topic.length > 0 ? topic : undefined
            }
            
            // Отладка для первого вопроса
            if (index === 0) {
              console.log('Первый вопрос объект:', {
                hasExplanation: !!questionObj.explanation,
                explanation: questionObj.explanation
              })
            }
            
            millionaireQuestions.push(questionObj)
          })
          
          if (millionaireQuestions.length === 0) {
            reject(new Error('NO_VALID_QUESTIONS: Не найдено ни одного валидного вопроса'))
            return
          }
          
          // Сохраняем в localStorage
          Storage.saveMillionaireQuestions(millionaireQuestions)
          
          resolve(millionaireQuestions)
        } catch (error) {
          reject(error instanceof Error ? error : new Error('Ошибка обработки файла'))
        }
      }
      
      reader.onerror = function() {
        reject(new Error('Ошибка чтения файла'))
      }
      
      reader.readAsArrayBuffer(file)
    })
  },

  /**
   * Загружает вопросы из URL
   */
  loadFromURL(url: string): Promise<MillionaireQuestion[]> {
    return XLSXLoader.loadFromURL(url)
      .then(result => {
        // Собираем все вопросы из всех тем
        const allQuestions: Question[] = []
        Object.values(result.questionsByTopic).forEach(questions => {
          allQuestions.push(...questions)
        })

        if (allQuestions.length === 0) {
          throw new Error('NO_QUESTIONS: Не найдено ни одного вопроса в файле')
        }

        // Конвертируем вопросы в формат миллионера
        const millionaireQuestions = MillionaireQuestionConverter.convertQuestions(
          result.questionsByTopic
        )

        if (millionaireQuestions.length === 0) {
          throw new Error('CONVERSION_ERROR: Не удалось конвертировать вопросы в формат миллионера')
        }

        // Сохраняем в localStorage
        Storage.saveMillionaireQuestions(millionaireQuestions)

        return millionaireQuestions
      })
  },

  /**
   * Загружает вопросы из localStorage
   */
  loadFromStorage(): MillionaireQuestion[] | null {
    return Storage.loadMillionaireQuestions()
  },

  /**
   * Очищает сохраненные вопросы
   */
  clearStorage(): void {
    Storage.clearMillionaireQuestions()
  }
}

