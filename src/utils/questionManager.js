// Модуль для управления вопросами
export const QuestionManager = {
    // Функция для получения случайных элементов из массива
    getRandomItems(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, shuffled.length));
    },
    
    // Обновление выбранных вопросов на основе выбранных тем
    updateSelectedQuestions(allQuestionsByTopic, selectedTopics) {
        const allQuestions = [];
        
        selectedTopics.forEach(topicName => {
            if (allQuestionsByTopic[topicName]) {
                // Выбираем 10 случайных вопросов из выбранной темы
                const selectedQuestions = this.getRandomItems(allQuestionsByTopic[topicName], 10);
                allQuestions.push(...selectedQuestions);
            }
        });
        
        return {
            questions: allQuestions,
            totalQuestions: allQuestions.length,
            selectedTopicsCount: selectedTopics.length
        };
    },
    
    // Получение случайного вопроса
    getRandomQuestion(questions, usedQuestionIndices) {
        if (usedQuestionIndices.length >= questions.length) {
            return { index: -1, question: null, usedIndices: [] };
        }
        
        // Оптимизированный выбор случайного вопроса с использованием Set для быстрой проверки
        const usedSet = new Set(usedQuestionIndices);
        const availableIndices = [];
        
        for (let i = 0; i < questions.length; i++) {
            if (!usedSet.has(i)) {
                availableIndices.push(i);
            }
        }
        
        // Выбираем случайный индекс из доступных
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        const newUsedIndices = [...usedQuestionIndices, randomIndex];
        
        return { index: randomIndex, question: questions[randomIndex], usedIndices: newUsedIndices };
    },
    
    // Получение количества вопросов в теме
    getTopicQuestionCount(allQuestionsByTopic, topicName) {
        return allQuestionsByTopic[topicName] ? allQuestionsByTopic[topicName].length : 0;
    }
};

