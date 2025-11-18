# Архитектура проекта

## Структура проекта

```
src/
├── components/          # Переиспользуемые UI компоненты
│   ├── Dialog.jsx      # Кастомный диалог
│   ├── Header.jsx      # Заголовок приложения
│   ├── QuestionBlock.jsx
│   ├── Results.jsx
│   └── ...
├── contexts/           # React Context для глобального состояния
│   ├── PracticeContext.jsx   # Состояние практики
│   └── QuestionsContext.jsx # Состояние вопросов
├── features/          # Feature-based модули
│   ├── practice/      # Модуль практики
│   │   ├── PracticeView.jsx
│   │   └── ResultsView.jsx
│   └── questions/     # Модуль управления вопросами
│       └── QuestionsSetupView.jsx
├── hooks/             # Кастомные React хуки
│   ├── useDialog.js
│   ├── useTimer.js
│   └── usePracticeFlow.js
└── utils/             # Утилиты и бизнес-логика
    ├── storage.js
    ├── xlsxLoader.js
    ├── questionManager.js
    └── timer.js
```

## Принципы архитектуры

### 1. Context API для состояния
- **PracticeContext** - управляет состоянием практики (текущий вопрос, прогресс, таймеры)
- **QuestionsContext** - управляет вопросами (загрузка, выбор тем, фильтрация)

### 2. Feature-based структура
Каждая фича (practice, questions) изолирована в своей папке:
- Легко добавлять новые модули (flashcards, quiz, study modes)
- Каждый модуль может иметь свои компоненты, хуки, утилиты
- Минимальная связанность между модулями

### 3. Кастомные хуки
- **useDialog** - управление диалогами
- **useTimer** - логика таймеров
- **usePracticeFlow** - бизнес-логика практики

### 4. Разделение ответственности
- **Components** - только UI, без бизнес-логики
- **Contexts** - управление состоянием
- **Hooks** - переиспользуемая логика
- **Utils** - чистые функции, бизнес-логика

## Как добавить новый модуль (например, Flashcards)

1. Создать папку `src/features/flashcards/`
2. Создать компоненты:
   - `FlashcardsView.jsx` - основной компонент
   - `FlashcardCard.jsx` - карточка
3. При необходимости создать контекст:
   - `FlashcardsContext.jsx`
4. Добавить в `App.jsx`:
   ```jsx
   import FlashcardsView from './features/flashcards/FlashcardsView'
   
   // В AppContent добавить роутинг или условный рендеринг
   ```

## Преимущества текущей архитектуры

✅ **Масштабируемость** - легко добавлять новые фичи
✅ **Поддерживаемость** - четкое разделение ответственности
✅ **Тестируемость** - изолированные модули легко тестировать
✅ **Переиспользование** - хуки и компоненты можно использовать везде
✅ **Производительность** - Context API оптимизирует ре-рендеры

## Планы развития

- [x] Добавить PropTypes для валидации пропсов
- [x] Оптимизировать производительность (React.memo, useMemo)
- [x] Добавить Error Boundaries
- [x] Добавить роутинг (React Router) для навигации между модулями
- [x] Добавить TypeScript для типобезопасности (100% миграция - все файлы)
- [x] Оптимизировать бандл (code splitting) - уменьшен с 563KB до 200KB
- [ ] Добавить тесты (Jest + React Testing Library)

