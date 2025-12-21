import * as XLSX from 'xlsx'
import type { Question, QuestionsByTopic, SheetStat, XLSXLoadResult } from '../types'

interface ValidationResult {
  valid: boolean
  missing: string[]
}

interface FormatError {
  sheet: string
  missing: string[]
}

/**
 * Модуль для загрузки и парсинга XLSX файлов
 */
export const XLSXLoader = {
  /**
   * Парсит лист Excel и возвращает массив вопросов
   */
  parseSheet(worksheet: XLSX.WorkSheet | undefined, sheetName: string): Question[] {
    if (!worksheet) return []
    
    // Конвертируем лист в JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1, 
      defval: '',
      raw: false 
    }) as unknown[][]
    
    if (jsonData.length < 2) return []
    
    // Ищем индексы столбцов
    const headerRow = jsonData[0] as unknown[]
    const numberIndex = headerRow.findIndex(h => {
      const str = String(h).toLowerCase()
      return str.includes('номер') || str.includes('number') || str.includes('№')
    })
    const questionIndex = headerRow.findIndex(h => {
      const str = String(h).toLowerCase()
      return str.includes('вопрос') || str.includes('question')
    })
    const answerIndex = headerRow.findIndex(h => {
      const str = String(h).toLowerCase()
      return str.includes('ответ') || str.includes('answer')
    })
    const explanationIndex = headerRow.findIndex(h => {
      const str = String(h).toLowerCase()
      return str.includes('объяснение') || str.includes('explanation') || str.includes('под капотом')
    })
    
    // Опциональные колонки для игры "Миллионер"
    const difficultyIndex = headerRow.findIndex(h => {
      const str = String(h).toLowerCase()
      return str.includes('сложность') || str.includes('difficulty') || str.includes('уровень')
    })
    const wrongAnswer1Index = headerRow.findIndex(h => {
      const str = String(h).toLowerCase()
      return str.includes('неправильный') && (str.includes('1') || str.includes('первый'))
    })
    const wrongAnswer2Index = headerRow.findIndex(h => {
      const str = String(h).toLowerCase()
      return str.includes('неправильный') && (str.includes('2') || str.includes('второй'))
    })
    const wrongAnswer3Index = headerRow.findIndex(h => {
      const str = String(h).toLowerCase()
      return str.includes('неправильный') && (str.includes('3') || str.includes('третий'))
    })
    
    if (questionIndex === -1 || answerIndex === -1 || explanationIndex === -1) {
      // Возвращаем пустой массив, ошибка будет обработана на уровне выше
      return []
    }
    
    const parsedQuestions: Question[] = []
    
    // Парсим данные (начинаем со второй строки, так как первая - заголовок)
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i]
      if (!row || row.length === 0) continue
      
      const question = row[questionIndex] ? String(row[questionIndex]).trim() : ''
      const answer = row[answerIndex] ? String(row[answerIndex]).trim() : ''
      const explanation = row[explanationIndex] ? String(row[explanationIndex]).trim() : ''
      
      // Опциональные поля для "Миллионера"
      const difficulty = difficultyIndex !== -1 && row[difficultyIndex]
        ? parseInt(String(row[difficultyIndex]), 10)
        : undefined
      const wrongAnswer1 = wrongAnswer1Index !== -1 && row[wrongAnswer1Index]
        ? String(row[wrongAnswer1Index]).trim()
        : undefined
      const wrongAnswer2 = wrongAnswer2Index !== -1 && row[wrongAnswer2Index]
        ? String(row[wrongAnswer2Index]).trim()
        : undefined
      const wrongAnswer3 = wrongAnswer3Index !== -1 && row[wrongAnswer3Index]
        ? String(row[wrongAnswer3Index]).trim()
        : undefined
      
      // Пропускаем пустые строки
      if (!question && !answer) continue
      
      const questionObj: Question = {
        category: sheetName,
        question: question,
        answer: answer,
        explanation: explanation || undefined
      }
      
      // Добавляем опциональные поля, если они есть
      if (difficulty && !isNaN(difficulty) && difficulty >= 1 && difficulty <= 4) {
        questionObj.difficulty = difficulty
      }
      if (wrongAnswer1) questionObj.wrongAnswer1 = wrongAnswer1
      if (wrongAnswer2) questionObj.wrongAnswer2 = wrongAnswer2
      if (wrongAnswer3) questionObj.wrongAnswer3 = wrongAnswer3
      
      parsedQuestions.push(questionObj)
    }
    
    return parsedQuestions
  },
  
  /**
   * Проверяет формат листа
   */
  validateSheetFormat(worksheet: XLSX.WorkSheet | undefined, sheetName: string): ValidationResult {
    if (!worksheet) return { valid: false, missing: ['Вопрос', 'Ответ', 'Объяснение'] }
    
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', raw: false }) as unknown[][]
    if (jsonData.length < 1) {
      return { valid: false, missing: ['Вопрос', 'Ответ', 'Объяснение'] }
    }
    
    const headerRow = jsonData[0] as unknown[]
    const questionIndex = headerRow.findIndex(h => {
      const str = String(h).toLowerCase()
      return str.includes('вопрос') || str.includes('question')
    })
    const answerIndex = headerRow.findIndex(h => {
      const str = String(h).toLowerCase()
      return str.includes('ответ') || str.includes('answer')
    })
    const explanationIndex = headerRow.findIndex(h => {
      const str = String(h).toLowerCase()
      return str.includes('объяснение') || str.includes('explanation') || str.includes('под капотом')
    })
    
    if (questionIndex === -1 || answerIndex === -1 || explanationIndex === -1) {
      const missingColumns: string[] = []
      if (questionIndex === -1) missingColumns.push('Вопрос')
      if (answerIndex === -1) missingColumns.push('Ответ')
      if (explanationIndex === -1) missingColumns.push('Объяснение')
      return { valid: false, missing: missingColumns }
    }
    
    return { valid: true, missing: [] }
  },
  
  /**
   * Загружает вопросы из файла
   */
  loadFromFile(file: File): Promise<XLSXLoadResult> {
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
          
          const allQuestionsByTopic: QuestionsByTopic = {}
          const sheetStats: SheetStat[] = []
          const formatErrors: FormatError[] = []
          
          // Получаем все листы из файла
          const allSheetNames = workbook.SheetNames
          if (allSheetNames.length === 0) {
            reject(new Error('NO_SHEETS: В файле нет листов. Файл должен содержать хотя бы один лист с вопросами.'))
            return
          }
          
          // Обрабатываем каждый лист из файла
          allSheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName]
            if (!worksheet) {
              console.warn(`Лист "${sheetName}" не найден в файле`)
              return
            }
            
            const sheetQuestions = XLSXLoader.parseSheet(worksheet, sheetName)
            
            // Проверяем формат листа
            if (sheetQuestions.length === 0) {
              const validation = XLSXLoader.validateSheetFormat(worksheet, sheetName)
              if (!validation.valid) {
                formatErrors.push({ sheet: sheetName, missing: validation.missing })
              }
            }
            
            if (sheetQuestions.length > 0) {
              // Сохраняем все вопросы по теме (название листа = название темы)
              allQuestionsByTopic[sheetName] = sheetQuestions
              sheetStats.push({
                name: sheetName,
                total: sheetQuestions.length
              })
            }
          })
          
          // Если есть ошибки формата, показываем их
          if (formatErrors.length > 0 && Object.keys(allQuestionsByTopic).length === 0) {
            const errorSheet = formatErrors[0]
            reject(new Error(`FORMAT_ERROR: Лист "${errorSheet.sheet}": отсутствуют обязательные столбцы: ${errorSheet.missing.join(', ')}`))
            return
          }
          
          // Проверяем, есть ли хотя бы один лист с вопросами
          const foundSheets = Object.keys(allQuestionsByTopic)
          if (foundSheets.length === 0) {
            reject(new Error('NO_QUESTIONS: Не найдено ни одного вопроса в загруженных листах. Проверьте, что в листах есть данные и правильные названия столбцов (Вопрос, Ответ, Объяснение).'))
            return
          }
          
          resolve({
            questionsByTopic: allQuestionsByTopic,
            stats: sheetStats
          })
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = function() {
        reject(new Error('Ошибка чтения файла'))
      }
      
      reader.readAsArrayBuffer(file)
    })
  },
  
  /**
   * Загружает вопросы из URL (для автоматической загрузки questions.xlsx)
   */
  loadFromURL(url: string): Promise<XLSXLoadResult> {
    return fetch(url)
      .then(response => {
        if (response.ok) {
          return response.arrayBuffer()
        }
        throw new Error('Файл questions.xlsx не найден')
      })
      .then(data => {
        const workbook = XLSX.read(data, { type: 'array' })
        
        const allQuestionsByTopic: QuestionsByTopic = {}
        const sheetStats: SheetStat[] = []
        const formatErrors: FormatError[] = []
        
        // Получаем все листы из файла
        const allSheetNames = workbook.SheetNames
        if (allSheetNames.length === 0) {
          throw new Error('NO_SHEETS: В файле нет листов. Файл должен содержать хотя бы один лист с вопросами.')
        }
        
        // Обрабатываем каждый лист из файла
        allSheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName]
          if (!worksheet) {
            console.warn(`Лист "${sheetName}" не найден в файле`)
            return
          }
          
          const sheetQuestions = XLSXLoader.parseSheet(worksheet, sheetName)
          
          // Проверяем формат листа
          if (sheetQuestions.length === 0) {
            const validation = XLSXLoader.validateSheetFormat(worksheet, sheetName)
            if (!validation.valid) {
              formatErrors.push({ sheet: sheetName, missing: validation.missing })
            }
          }
          
          if (sheetQuestions.length > 0) {
            // Сохраняем все вопросы по теме (название листа = название темы)
            allQuestionsByTopic[sheetName] = sheetQuestions
            sheetStats.push({
              name: sheetName,
              total: sheetQuestions.length
            })
          }
        })
        
        // Если есть ошибки формата, показываем их
        if (formatErrors.length > 0 && Object.keys(allQuestionsByTopic).length === 0) {
          const errorSheet = formatErrors[0]
          throw new Error(`FORMAT_ERROR: Лист "${errorSheet.sheet}": отсутствуют обязательные столбцы: ${errorSheet.missing.join(', ')}`)
        }
        
        // Проверяем, есть ли хотя бы один лист с вопросами
        const foundSheets = Object.keys(allQuestionsByTopic)
        if (foundSheets.length === 0) {
          throw new Error('NO_QUESTIONS: Не найдено ни одного вопроса в загруженных листах. Проверьте, что в листах есть данные и правильные названия столбцов (Вопрос, Ответ, Объяснение).')
        }
        
        return {
          questionsByTopic: allQuestionsByTopic,
          stats: sheetStats
        }
      })
  }
}

