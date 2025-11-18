# Применённые паттерны проектирования (GoF)

В проекте применены следующие классические паттерны из "Банды Четырёх" (Gang of Four):

## 📦 Порождающие паттерны (Creational Patterns)

### 1. **Singleton (Одиночка)**
**Где применён:** React Context API

**Пример:**
```typescript
// src/contexts/PracticeContext.tsx
const PracticeContext = createContext<PracticeContextValue | null>(null)

export function PracticeProvider({ children }: PracticeProviderProps) {
  // Единственный экземпляр состояния практики
  const [isPracticeStarted, setIsPracticeStarted] = useState(false)
  // ...
}
```

**Обоснование:** Context создаёт единственный источник истины для глобального состояния приложения.

---

### 2. **Factory Method (Фабричный метод)**
**Где применён:** Lazy loading компонентов и создание объектов вопросов

**Пример:**
```typescript
// src/pages/PracticePage.tsx
const PracticeView = lazy(() => import('../features/practice/PracticeView'))
const ResultsView = lazy(() => import('../features/practice/ResultsView'))

// src/utils/questionManager.ts
getRandomQuestion(questions: Question[], usedQuestionIndices: number[]): RandomQuestionResult {
  // Фабричный метод для создания случайного вопроса
  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
  return {
    index: randomIndex,
    question: questions[randomIndex],
    usedIndices: newUsedIndices
  }
}
```

**Обоснование:** Инкапсуляция создания объектов и компонентов.

---

### 3. **Module Pattern (Модуль)**
**Где применён:** Утилиты как модули с экспортом объекта

**Пример:**
```typescript
// src/utils/storage.ts
export const Storage = {
  STORAGE_KEY: 'questionPracticeData',
  saveQuestions(allQuestionsByTopic: QuestionsByTopic): void { /* ... */ },
  loadQuestions(): QuestionsByTopic | null { /* ... */ }
}

// src/utils/questionManager.ts
export const QuestionManager = {
  getRandomItems<T>(array: T[], count: number): T[] { /* ... */ },
  updateSelectedQuestions(/* ... */) { /* ... */ }
}
```

**Обоснование:** Инкапсуляция функциональности в именованные модули.

---

## 🏗️ Структурные паттерны (Structural Patterns)

### 4. **Adapter (Адаптер)**
**Где применён:** XLSXLoader адаптирует данные из Excel

**Пример:**
```typescript
// src/utils/xlsxLoader.ts
export const XLSXLoader = {
  parseSheet(worksheet: XLSX.WorkSheet | undefined, sheetName: string): Question[] {
    // Адаптирует формат Excel в формат приложения
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
    // Преобразование данных...
    return parsedQuestions
  }
}
```

**Обоснование:** Адаптация внешнего формата данных (XLSX) к внутреннему формату приложения (Question[]).

---

### 5. **Facade (Фасад)**
**Где применён:** Кастомные хуки как фасад сложной логики

**Пример:**
```typescript
// src/hooks/useDialog.ts
export function useDialog() {
  // Фасад для управления диалогами
  const showAlert = useCallback((title: string, message: string): Promise<boolean> => {
    // Скрывает сложность управления состоянием диалога
    return new Promise((resolve) => {
      setDialog({ isOpen: true, type: 'alert', title, message, onConfirm: () => resolve(true), onCancel: null })
    })
  }, [])
  
  return { dialog, showAlert, showConfirm, closeDialog }
}

// src/hooks/usePracticeFlow.ts
export function usePracticeFlow(): UsePracticeFlowReturn {
  // Фасад для бизнес-логики практики
  const { startPractice, finishPractice, nextQuestion } = usePractice()
  // Инкапсулирует сложную логику перехода между вопросами
}
```

**Обоснование:** Упрощение сложных подсистем через единый интерфейс.

---

### 6. **Decorator (Декоратор)**
**Где применён:** React.memo для оптимизации компонентов

**Пример:**
```typescript
// src/components/Header.tsx
export default memo(Header)

// src/components/StatsBlock.tsx
export default memo(StatsBlock)

// src/components/QuestionBlock.tsx
export default memo(QuestionBlock)
```

**Обоснование:** Динамическое добавление функциональности (мемоизация) к компонентам без изменения их структуры.

---

### 7. **Proxy (Заместитель)**
**Где применён:** React Context как прокси для доступа к состоянию

**Пример:**
```typescript
// src/contexts/PracticeContext.tsx
export function usePractice(): PracticeContextValue {
  const context = useContext(PracticeContext)
  if (!context) {
    throw new Error('usePractice must be used within PracticeProvider')
  }
  return context // Проксирует доступ к состоянию
}
```

**Обоснование:** Контролируемый доступ к объекту состояния через прокси.

---

## 🎯 Поведенческие паттерны (Behavioral Patterns)

### 8. **Observer (Наблюдатель)**
**Где применён:** React Context подписка на изменения состояния

**Пример:**
```typescript
// src/contexts/PracticeContext.tsx
export function PracticeProvider({ children }: PracticeProviderProps) {
  const [isPracticeStarted, setIsPracticeStarted] = useState(false)
  
  return (
    <PracticeContext.Provider value={value}>
      {children} {/* Компоненты автоматически подписываются на изменения */}
    </PracticeContext.Provider>
  )
}

// В любом компоненте:
const { isPracticeStarted } = usePractice() // Автоматическая подписка на изменения
```

**Обоснование:** Уведомление зависимых компонентов об изменениях состояния.

---

### 9. **Strategy (Стратегия)**
**Где применён:** Различные стратегии обработки вопросов

**Пример:**
```typescript
// src/utils/questionManager.ts
export const QuestionManager = {
  getRandomItems<T>(array: T[], count: number): T[] {
    // Стратегия: случайный выбор
    const shuffled = [...array].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(count, shuffled.length))
  },
  
  getRandomQuestion(questions: Question[], usedQuestionIndices: number[]): RandomQuestionResult {
    // Стратегия: выбор случайного вопроса с исключением использованных
    const usedSet = new Set(usedQuestionIndices)
    const availableIndices = questions
      .map((_, i) => i)
      .filter(i => !usedSet.has(i))
    // ...
  }
}
```

**Обоснование:** Инкапсуляция алгоритмов и возможность их взаимозамены.

---

### 10. **Command (Команда)**
**Где применён:** useCallback для инкапсуляции действий

**Пример:**
```typescript
// src/contexts/PracticeContext.tsx
const startPractice = useCallback((firstQuestion: Question, usedIndices: number[]) => {
  // Команда как объект для инкапсуляции действия
  setIsPracticeStarted(true)
  setCurrentQuestion(firstQuestion)
  // ...
}, [])

const nextQuestion = useCallback((nextQuestion: Question, usedIndices: number[], answeredQuestion: AnsweredQuestion) => {
  // Команда для перехода к следующему вопросу
  setCurrentQuestionIndex(prev => prev + 1)
  setAnsweredQuestions(prev => [...prev, answeredQuestion])
  // ...
}, [])
```

**Обоснование:** Инкапсуляция запросов как объектов, позволяющая параметризовать клиентов с различными запросами.

---

### 11. **Template Method (Шаблонный метод)**
**Где применён:** Структура компонентов с общим шаблоном

**Пример:**
```typescript
// Все компоненты следуют одному шаблону:
function Component({ props }: ComponentProps) {
  // 1. Хуки для получения данных
  const { data } = useContext()
  
  // 2. Мемоизация вычислений
  const memoizedValue = useMemo(() => compute(), [deps])
  
  // 3. Рендеринг
  return <div>...</div>
}

// Завершение шаблона
export default memo(Component)
```

**Обоснование:** Определение скелета алгоритма с делегированием некоторых шагов подклассам/компонентам.

---

### 12. **Memento (Хранитель)**
**Где применён:** Сохранение состояния в localStorage

**Пример:**
```typescript
// src/utils/storage.ts
export const Storage = {
  saveQuestions(allQuestionsByTopic: QuestionsByTopic): void {
    // Сохранение снимка состояния (Memento)
    const dataToSave = {
      allQuestionsByTopic,
      timestamp: Date.now()
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave))
  },
  
  loadQuestions(): QuestionsByTopic | null {
    // Восстановление состояния из снимка
    const savedData = localStorage.getItem(this.STORAGE_KEY)
    if (savedData) {
      const parsed = JSON.parse(savedData)
      return parsed.allQuestionsByTopic
    }
    return null
  }
}
```

**Обоснование:** Сохранение и восстановление внутреннего состояния объекта без нарушения инкапсуляции.

---

### 13. **State (Состояние)**
**Где применён:** ErrorBoundary управляет состояниями ошибок

**Пример:**
```typescript
// src/components/ErrorBoundary.tsx
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = { hasError: false, error: null, errorInfo: null }
  
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Переход в состояние ошибки
    return { hasError: true, error }
  }
  
  render() {
    if (this.state.hasError) {
      // Рендеринг в состоянии ошибки
      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />
    }
    // Нормальное состояние
    return this.props.children
  }
}
```

**Обоснование:** Изменение поведения объекта при изменении его внутреннего состояния.

---

### 14. **Iterator (Итератор)**
**Где применён:** Работа с массивами вопросов

**Пример:**
```typescript
// src/utils/questionManager.ts
getRandomQuestion(questions: Question[], usedQuestionIndices: number[]): RandomQuestionResult {
  // Итерация по массиву с использованием Set для оптимизации
  const usedSet = new Set(usedQuestionIndices)
  const availableIndices: number[] = []
  
  for (let i = 0; i < questions.length; i++) {
    if (!usedSet.has(i)) {
      availableIndices.push(i)
    }
  }
  // ...
}

// src/components/Results.tsx
{answeredQuestions.map((q, idx) => (
  // Итерация по массиву ответов
  <tr key={idx}>...</tr>
))}
```

**Обоснование:** Последовательный доступ к элементам агрегата без раскрытия его внутреннего представления.

---

## 📊 Итого

### Применённые паттерны GoF:

#### Порождающие (3):
1. ✅ Singleton
2. ✅ Factory Method
3. ✅ Module Pattern

#### Структурные (4):
4. ✅ Adapter
5. ✅ Facade
6. ✅ Decorator
7. ✅ Proxy

#### Поведенческие (7):
8. ✅ Observer
9. ✅ Strategy
10. ✅ Command
11. ✅ Template Method
12. ✅ Memento
13. ✅ State
14. ✅ Iterator

**Всего применено: 14 из 23 классических паттернов GoF** (если считать Module Pattern как отдельный паттерн, хотя он более относится к JavaScript/ES6 модулям)

---

## 💡 React-специфичные паттерны

Помимо классических GoF паттернов, в проекте также используются React-специфичные паттерны:

- **Provider Pattern** - для управления глобальным состоянием
- **HOC (Higher-Order Component)** - React.memo как HOC
- **Render Props** - неявно через children в Provider
- **Custom Hooks Pattern** - инкапсуляция логики в хуки

---

## 🎯 Выводы

Проект демонстрирует зрелое понимание паттернов проектирования:

1. **Масштабируемость** - использование Factory, Strategy, Module Pattern
2. **Поддерживаемость** - Facade, Template Method, Command
3. **Производительность** - Decorator (memo), Observer (Context)
4. **Надёжность** - State (ErrorBoundary), Memento (localStorage)
5. **Гибкость** - Adapter, Strategy, Factory Method

Применение паттернов способствует созданию чистого, тестируемого и расширяемого кода.

