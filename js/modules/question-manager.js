// Модуль для управления вопросами
const QuestionManager = {
    // База вопросов (загружается из XLSX)
    questions: [],
    // Хранилище всех вопросов по темам
    allQuestionsByTopic: {},
    // Динамический список тем (формируется из листов файла)
    topicNames: [],
    // Использованные индексы вопросов
    usedQuestionIndices: [],
    
    // Инициализация
    init(allQuestionsByTopic) {
        this.allQuestionsByTopic = allQuestionsByTopic || {};
        this.topicNames = Object.keys(this.allQuestionsByTopic);
        this.questions = [];
        this.usedQuestionIndices = [];
    },
    
    // Функция для получения случайных элементов из массива
    getRandomItems(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, shuffled.length));
    },
    
    // Обновление выбранных вопросов на основе чекбоксов
    updateSelectedQuestions(selectedTopics) {
        const allQuestions = [];
        
        selectedTopics.forEach(topicName => {
            if (this.allQuestionsByTopic[topicName]) {
                // Выбираем 10 случайных вопросов из выбранной темы
                const selectedQuestions = this.getRandomItems(this.allQuestionsByTopic[topicName], 10);
                allQuestions.push(...selectedQuestions);
            }
        });
        
        this.questions = allQuestions;
        this.usedQuestionIndices = [];
        
        return {
            totalQuestions: allQuestions.length,
            selectedTopicsCount: selectedTopics.length
        };
    },
    
    // Получение случайного вопроса
    getRandomQuestion() {
        if (this.usedQuestionIndices.length >= this.questions.length) {
            this.usedQuestionIndices = [];
        }
        
        // Оптимизированный выбор случайного вопроса с использованием Set для быстрой проверки
        const usedSet = new Set(this.usedQuestionIndices);
        const availableIndices = [];
        
        for (let i = 0; i < this.questions.length; i++) {
            if (!usedSet.has(i)) {
                availableIndices.push(i);
            }
        }
        
        // Выбираем случайный индекс из доступных
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        this.usedQuestionIndices.push(randomIndex);
        
        return { index: randomIndex, question: this.questions[randomIndex] };
    },
    
    // Получение всех тем
    getAllTopics() {
        return Object.keys(this.allQuestionsByTopic);
    },
    
    // Получение количества вопросов в теме
    getTopicQuestionCount(topicName) {
        return this.allQuestionsByTopic[topicName] ? this.allQuestionsByTopic[topicName].length : 0;
    },
    
    // Получение текущего количества вопросов
    getQuestionsCount() {
        return this.questions.length;
    }
};

