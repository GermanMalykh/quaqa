// Модуль для работы с localStorage
const Storage = {
    // Ключ для сохранения в localStorage
    STORAGE_KEY: 'questionPracticeData',
    CHECKBOXES_KEY: 'questionPracticeCheckboxes',
    
    // Функция для сохранения данных в localStorage
    saveQuestions(allQuestionsByTopic) {
        try {
            const dataToSave = {
                allQuestionsByTopic: allQuestionsByTopic,
                timestamp: Date.now()
            };
            console.log('Сохранение в localStorage:', {
                topics: Object.keys(allQuestionsByTopic).length,
                timestamp: dataToSave.timestamp
            });
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
            console.log('Данные успешно сохранены в localStorage');
        } catch (error) {
            console.warn('Не удалось сохранить данные в localStorage:', error);
        }
    },
    
    // Функция для загрузки данных из localStorage
    loadQuestions() {
        try {
            const savedData = localStorage.getItem(this.STORAGE_KEY);
            console.log('Попытка загрузки из localStorage:', savedData ? 'данные найдены' : 'данные не найдены');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                console.log('Распарсенные данные:', parsed);
                // Проверяем, что данные не старше 7 дней
                const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
                if (parsed.timestamp && parsed.timestamp > sevenDaysAgo && parsed.allQuestionsByTopic) {
                    console.log('Данные валидны, возвращаем:', Object.keys(parsed.allQuestionsByTopic).length, 'тем');
                    return parsed.allQuestionsByTopic;
                } else {
                    console.log('Данные устарели или отсутствуют:', {
                        hasTimestamp: !!parsed.timestamp,
                        isRecent: parsed.timestamp ? parsed.timestamp > sevenDaysAgo : false,
                        hasQuestions: !!parsed.allQuestionsByTopic
                    });
                }
            }
        } catch (error) {
            console.warn('Не удалось загрузить данные из localStorage:', error);
        }
        return null;
    },
    
    // Сохранение состояния чекбоксов
    saveCheckboxesState(checkboxesState) {
        try {
            localStorage.setItem(this.CHECKBOXES_KEY, JSON.stringify(checkboxesState));
        } catch (error) {
            console.warn('Не удалось сохранить состояние чекбоксов:', error);
        }
    },
    
    // Загрузка состояния чекбоксов
    loadCheckboxesState() {
        try {
            const savedCheckboxesData = localStorage.getItem(this.CHECKBOXES_KEY);
            if (savedCheckboxesData) {
                return JSON.parse(savedCheckboxesData);
            }
        } catch (error) {
            console.warn('Не удалось загрузить состояние чекбоксов:', error);
        }
        return {};
    }
};

