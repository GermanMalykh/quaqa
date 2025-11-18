// Главный файл приложения
let currentQuestionIndex = 0;
let answeredQuestions = [];

// Функция для обновления выбранных вопросов
function updateSelectedQuestions() {
    const selectedTopics = UIController.getSelectedTopics();
    const result = QuestionManager.updateSelectedQuestions(selectedTopics);
    UIController.updateSelectedTopicsInfo(result.selectedTopicsCount, result.totalQuestions);
}

// Функция для загрузки вопросов из XLSX файла
function loadQuestionsFromXLSX(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    UIController.showLoading();
    
    XLSXLoader.loadFromFile(file)
        .then(result => {
            QuestionManager.init(result.questionsByTopic);
            Storage.saveQuestions(result.questionsByTopic);
            
            // Создаем чекбоксы и обновляем вопросы
            UIController.createTopicCheckboxes(result.questionsByTopic, updateSelectedQuestions);
            updateSelectedQuestions();
            
            // Показываем статистику
            UIController.showLoadingStats(result.stats, Object.keys(result.questionsByTopic).length);
            UIController.showTopicsSelection();
        })
        .catch(error => {
            UIController.showError(error);
            console.error('Ошибка при загрузке XLSX:', error);
        });
}

// Функция для начала практики
function startPractice() {
    if (QuestionManager.getQuestionsCount() === 0) {
        alert('Пожалуйста, сначала загрузите вопросы из XLSX файла и выберите темы!');
        return;
    }
    
    // Обновляем вопросы перед стартом (на случай, если пользователь изменил выбор тем)
    updateSelectedQuestions();
    
    if (QuestionManager.getQuestionsCount() === 0) {
        alert('Выберите хотя бы одну тему для практики!');
        return;
    }
    
    UIController.showPractice();
    
    currentQuestionIndex = 0;
    answeredQuestions = [];
    Timer.reset();
    
    // Запуск общего таймера
    Timer.startMainTimer((seconds) => {
        UIController.updateMainTimer(seconds);
    });
    
    showNextQuestion();
}

// Функция для показа следующего вопроса
function showNextQuestion() {
    const totalQuestions = QuestionManager.getQuestionsCount();
    if (currentQuestionIndex >= totalQuestions) {
        finishPractice();
        return;
    }

    currentQuestionIndex++;
    Timer.stopQuestionTimer();
    
    // Получение случайного вопроса
    const { question } = QuestionManager.getRandomQuestion();
    
    UIController.showQuestion(question, currentQuestionIndex, totalQuestions);
    
    // Запуск таймера вопроса
    Timer.startQuestionTimer((data) => {
        UIController.updateQuestionTimer(data.countdown, data.realTime, data.exceeded);
    });
}

// Функция для переключения ответа
function toggleAnswer() {
    UIController.toggleAnswer();
}

// Функция для переключения объяснения
function toggleExplanation() {
    UIController.toggleExplanation();
}

// Функция для перехода к следующему вопросу
function nextQuestion() {
    // Блокируем кнопку во время перехода
    document.getElementById('nextBtn').disabled = true;
    
    const actualTimeSpent = Timer.getQuestionTimeSpent();
    if (actualTimeSpent > 0) {
        const questionCategory = document.getElementById('questionCategory').textContent;
        const questionText = document.getElementById('questionText').textContent;
        
        answeredQuestions.push({
            number: currentQuestionIndex,
            category: questionCategory,
            question: questionText,
            time: actualTimeSpent
        });
        
        UIController.showQuestionTime(actualTimeSpent);
    }
    
    Timer.stopQuestionTimer();
    
    // Показываем следующий вопрос сразу, без задержки
    document.getElementById('timeInfo').textContent = '';
    showNextQuestion();
}

// Функция для завершения практики
function finishPractice() {
    Timer.stopAll();
    
    const totalTimeSpent = Timer.getTotalTimeSpent();
    const totalQuestions = answeredQuestions.length;
    const avgTime = totalQuestions > 0 ? Math.floor(totalTimeSpent / totalQuestions) : 0;
    
    UIController.showResults(answeredQuestions, totalTimeSpent, avgTime);
}

// Функция для сброса практики
function resetPractice() {
    Timer.reset();
    UIController.resetToInitial();
}

// Инициализация при загрузке страницы
window.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded: начинаем загрузку данных');
    
    // Сначала пытаемся загрузить из localStorage
    const savedData = Storage.loadQuestions();
    console.log('Результат loadFromLocalStorage:', savedData);
    
    if (savedData && Object.keys(savedData).length > 0) {
        console.log('Загружаем данные из localStorage, тем:', Object.keys(savedData).length);
        QuestionManager.init(savedData);
        
        const sheetStats = [];
        Object.keys(savedData).forEach(sheetName => {
            if (savedData[sheetName].length > 0) {
                sheetStats.push({
                    name: sheetName,
                    total: savedData[sheetName].length
                });
            }
        });
        
        if (Object.keys(savedData).length > 0) {
            // Создаем чекбоксы и обновляем вопросы
            UIController.createTopicCheckboxes(savedData, updateSelectedQuestions);
            updateSelectedQuestions();
            
            UIController.showLoadingStats(sheetStats, Object.keys(savedData).length, true);
            UIController.showTopicsSelection();
            return; // Выходим, так как данные уже загружены
        }
    }
    
    // Если в localStorage нет данных, пытаемся загрузить из файла
    // Для GitHub Pages используем относительный путь
    XLSXLoader.loadFromURL('questions.xlsx')
        .then(result => {
            QuestionManager.init(result.questionsByTopic);
            Storage.saveQuestions(result.questionsByTopic);
            
            // Создаем чекбоксы и обновляем вопросы
            UIController.createTopicCheckboxes(result.questionsByTopic, updateSelectedQuestions);
            updateSelectedQuestions();
            
            UIController.showLoadingStats(result.stats, Object.keys(result.questionsByTopic).length);
            UIController.showTopicsSelection();
        })
        .catch(error => {
            console.error('Ошибка при парсинге XLSX:', error);
            // При автоматической загрузке не показываем ошибки, просто сообщаем, что нужно загрузить вручную
            UIController.showInitialState();
        });
});

