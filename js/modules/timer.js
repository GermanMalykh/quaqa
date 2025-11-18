// Модуль для работы с таймерами
const Timer = {
    mainTimerInterval: null,
    questionTimerInterval: null,
    totalSeconds: 0,
    questionSeconds: 60,
    startTime: null,
    questionStartTime: null,
    
    // Форматирование времени
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    },
    
    // Запуск основного таймера
    startMainTimer(onTick) {
        this.totalSeconds = 0;
        this.startTime = Date.now();
        
        if (this.mainTimerInterval) {
            clearInterval(this.mainTimerInterval);
        }
        
        this.mainTimerInterval = setInterval(() => {
            this.totalSeconds++;
            if (onTick) {
                onTick(this.totalSeconds);
            }
        }, 1000);
    },
    
    // Остановка основного таймера
    stopMainTimer() {
        if (this.mainTimerInterval) {
            clearInterval(this.mainTimerInterval);
            this.mainTimerInterval = null;
        }
    },
    
    // Запуск таймера вопроса
    startQuestionTimer(onTick) {
        this.questionSeconds = 60;
        this.questionStartTime = Date.now();
        
        if (this.questionTimerInterval) {
            clearInterval(this.questionTimerInterval);
        }
        
        this.questionTimerInterval = setInterval(() => {
            this.questionSeconds--;
            
            // Вычисляем реальное время, потраченное на вопрос
            const realTimeSpent = Math.floor((Date.now() - this.questionStartTime) / 1000);
            
            if (onTick) {
                onTick({
                    countdown: this.questionSeconds,
                    realTime: realTimeSpent,
                    exceeded: this.questionSeconds < 0
                });
            }
        }, 1000);
    },
    
    // Остановка таймера вопроса
    stopQuestionTimer() {
        if (this.questionTimerInterval) {
            clearInterval(this.questionTimerInterval);
            this.questionTimerInterval = null;
        }
    },
    
    // Получение реального времени, потраченного на вопрос
    getQuestionTimeSpent() {
        if (!this.questionStartTime) return 0;
        return Math.floor((Date.now() - this.questionStartTime) / 1000);
    },
    
    // Получение общего времени
    getTotalTimeSpent() {
        if (!this.startTime) return 0;
        return Math.floor((Date.now() - this.startTime) / 1000);
    },
    
    // Остановка всех таймеров
    stopAll() {
        this.stopMainTimer();
        this.stopQuestionTimer();
    },
    
    // Сброс
    reset() {
        this.stopAll();
        this.totalSeconds = 0;
        this.questionSeconds = 60;
        this.startTime = null;
        this.questionStartTime = null;
    }
};

