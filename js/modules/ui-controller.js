// Модуль для управления UI
const UIController = {
    // Создание чекбоксов тем
    createTopicCheckboxes(allQuestionsByTopic, onCheckboxChange) {
        const container = document.getElementById('topicsCheckboxes');
        container.innerHTML = '';
        
        // Получаем список тем из загруженных данных
        const availableTopics = Object.keys(allQuestionsByTopic);
        if (availableTopics.length === 0) {
            return;
        }
        
        // Загружаем сохраненное состояние чекбоксов из localStorage
        const savedCheckboxes = Storage.loadCheckboxesState();
        
        availableTopics.forEach(topicName => {
            const checkboxDiv = document.createElement('div');
            checkboxDiv.style.cssText = 'display: flex; align-items: center; padding: 10px; background: white; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `topic_${topicName}`;
            checkbox.value = topicName;
            // Восстанавливаем состояние из localStorage или выбираем первую тему по умолчанию
            checkbox.checked = savedCheckboxes[topicName] !== undefined ? savedCheckboxes[topicName] : (availableTopics.indexOf(topicName) === 0);
            checkbox.style.cssText = 'width: 20px; height: 20px; margin-right: 10px; cursor: pointer;';
            checkbox.addEventListener('change', function() {
                // Сохраняем состояние чекбоксов
                savedCheckboxes[topicName] = checkbox.checked;
                Storage.saveCheckboxesState(savedCheckboxes);
                if (onCheckboxChange) {
                    onCheckboxChange();
                }
            });
            
            const label = document.createElement('label');
            label.htmlFor = `topic_${topicName}`;
            label.textContent = topicName;
            label.style.cssText = 'cursor: pointer; font-size: 1em; flex: 1;';
            
            const countSpan = document.createElement('span');
            countSpan.id = `count_${topicName}`;
            countSpan.style.cssText = 'color: #667eea; font-weight: bold; margin-left: 10px;';
            countSpan.textContent = '(0)';
            
            checkboxDiv.appendChild(checkbox);
            checkboxDiv.appendChild(label);
            checkboxDiv.appendChild(countSpan);
            container.appendChild(checkboxDiv);
        });
    },
    
    // Обновление информации о выбранных темах
    updateSelectedTopicsInfo(selectedTopicsCount, totalQuestions) {
        const infoElement = document.getElementById('selectedTopicsInfo');
        if (infoElement) {
            infoElement.textContent = `Выбрано тем: ${selectedTopicsCount} | Вопросов будет: ${totalQuestions}`;
        }
        
        // Обновляем счетчик вопросов в stat-box
        const currentQuestionElement = document.getElementById('currentQuestion');
        if (currentQuestionElement) {
            currentQuestionElement.textContent = `0/${totalQuestions}`;
        }
        
        // Обновляем счетчики для каждой темы
        const availableTopics = QuestionManager.getAllTopics();
        availableTopics.forEach(topicName => {
            const checkbox = document.getElementById(`topic_${topicName}`);
            const countSpan = document.getElementById(`count_${topicName}`);
            
            if (countSpan) {
                const count = QuestionManager.getTopicQuestionCount(topicName);
                countSpan.textContent = `(${count})`;
            }
        });
        
        // Активируем кнопку, если есть выбранные темы
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            const shouldEnable = selectedTopicsCount > 0 && totalQuestions > 0;
            startBtn.disabled = !shouldEnable;
            // Показываем кнопку только если есть выбранные темы и вопросы
            if (shouldEnable) {
                startBtn.style.display = 'inline-block';
            }
        }
    },
    
    // Получение выбранных тем
    getSelectedTopics() {
        const selectedTopics = [];
        const availableTopics = QuestionManager.getAllTopics();
        
        availableTopics.forEach(topicName => {
            const checkbox = document.getElementById(`topic_${topicName}`);
            if (checkbox && checkbox.checked) {
                selectedTopics.push(topicName);
            }
        });
        
        return selectedTopics;
    },
    
    // Показ статистики загрузки
    showLoadingStats(sheetStats, totalTopics, isFromStorage = false) {
        let statsHTML = `<p>✅ ${isFromStorage ? 'Загружено из сохраненных данных' : 'Загружено тем'}: ${totalTopics}</p>`;
        statsHTML += '<div style="margin-top: 10px; text-align: left; max-width: 400px; margin-left: auto; margin-right: auto;">';
        sheetStats.forEach(stat => {
            statsHTML += `<p style="margin: 5px 0; font-size: 0.9em;">📋 ${stat.name}: ${stat.total} вопросов</p>`;
        });
        statsHTML += '</div>';
        
        document.getElementById('loadingStatus').style.display = 'block';
        document.getElementById('loadingStatus').style.color = '#28a745';
        document.getElementById('loadingStatus').innerHTML = statsHTML;
    },
    
    // Показ ошибки
    showError(error) {
        document.getElementById('loadingStatus').style.display = 'none';
        document.getElementById('errorStatus').style.display = 'block';
        
        let errorHTML = '';
        const errorMsg = error.message || String(error);
        
        if (errorMsg.includes('FORMAT_ERROR')) {
            // Ошибка формата
            errorHTML = `
                <h3 style="color: #ee5a6f; margin-bottom: 15px;">❌ Ошибка формата файла</h3>
                <p style="margin-bottom: 15px; font-weight: bold;">${errorMsg.replace('FORMAT_ERROR: ', '')}</p>
                <div style="text-align: left; background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                    <p style="margin-bottom: 10px; font-weight: bold;">Требуемый формат столбцов:</p>
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
                        <tr style="background: #f8f9fa;">
                            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Номер</th>
                            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Вопрос</th>
                            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Ответ</th>
                            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Объяснение</th>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;">1</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">Как получить текущий URL?</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">driver.getCurrentUrl()</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">Метод возвращает URL...</td>
                        </tr>
                    </table>
                    <p style="margin-top: 15px; font-size: 0.9em; color: #666;">Примечание: Названия столбцов могут быть на русском или английском языке</p>
                </div>
            `;
        } else if (errorMsg.includes('NO_SHEETS')) {
            // Нет листов
            errorHTML = `
                <h3 style="color: #ee5a6f; margin-bottom: 15px;">❌ Ошибка: файл не содержит листов</h3>
                <p style="margin-bottom: 15px;">${errorMsg.replace('NO_SHEETS: ', '')}</p>
            `;
        } else if (errorMsg.includes('NO_QUESTIONS')) {
            // Нет вопросов
            errorHTML = `
                <h3 style="color: #ee5a6f; margin-bottom: 15px;">❌ Ошибка: не найдено вопросов</h3>
                <p style="margin-bottom: 15px;">${errorMsg.replace('NO_QUESTIONS: ', '')}</p>
                <div style="text-align: left; background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                    <p style="margin-bottom: 10px; font-weight: bold;">Возможные причины:</p>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>Листы пустые (нет данных после заголовка)</li>
                        <li>Неправильные названия столбцов</li>
                        <li>Данные начинаются не со второй строки</li>
                    </ul>
                </div>
            `;
        } else {
            // Другие ошибки
            errorHTML = `
                <h3 style="color: #ee5a6f; margin-bottom: 15px;">❌ Ошибка загрузки</h3>
                <p>${errorMsg}</p>
            `;
        }
        
        document.getElementById('errorMessage').innerHTML = errorHTML;
        document.getElementById('startBtn').disabled = true;
    },
    
    // Показ состояния загрузки
    showLoading(message = 'Загрузка вопросов...') {
        document.getElementById('loadingStatus').style.display = 'block';
        document.getElementById('loadingStatus').innerHTML = `<p>${message}</p>`;
        document.getElementById('errorStatus').style.display = 'none';
        document.getElementById('startBtn').disabled = true;
        document.getElementById('topicsSelection').style.display = 'none';
    },
    
    // Показ выбора тем
    showTopicsSelection() {
        document.getElementById('topicsSelection').style.display = 'block';
        document.getElementById('formatExample').style.display = 'none';
        document.getElementById('loadButtonContainer').style.display = 'none';
        document.getElementById('loadFileBtnTop').style.display = 'block';
    },
    
    // Показ вопроса
    showQuestion(question, currentIndex, totalQuestions) {
        document.getElementById('questionNumber').textContent = `Вопрос ${currentIndex} из ${totalQuestions}`;
        document.getElementById('currentQuestion').textContent = `${currentIndex}/${totalQuestions}`;
        document.getElementById('questionCategory').textContent = question.category;
        document.getElementById('questionText').textContent = question.question;
        document.getElementById('answerText').textContent = question.answer;
        document.getElementById('explanationText').textContent = question.explanation;
        
        // Сброс скрытых блоков
        document.getElementById('answerContent').classList.remove('show');
        document.getElementById('explanationContent').classList.remove('show');
        document.getElementById('nextBtn').disabled = true;
        document.getElementById('timeInfo').textContent = '';
    },
    
    // Обновление таймера вопроса
    updateQuestionTimer(countdown, realTime, exceeded) {
        const questionTimeBox = document.getElementById('questionTime').parentElement;
        const questionTimeElement = document.getElementById('questionTime');
        
        // Показываем обратный отсчет до минуты, затем реальное время
        if (countdown >= 0) {
            questionTimeElement.textContent = Timer.formatTime(countdown);
        } else {
            // После истечения минуты показываем реальное время с префиксом "+"
            questionTimeElement.textContent = `+${Timer.formatTime(realTime - 60)}`;
        }
        
        // Изменение цвета в зависимости от оставшегося времени
        if (countdown <= 10 && countdown >= 0) {
            questionTimeBox.style.background = 'linear-gradient(135deg, #ee5a6f 0%, #c44569 100%)';
        } else if (countdown <= 30 && countdown >= 0) {
            questionTimeBox.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)';
        } else if (countdown < 0) {
            // Красный цвет, если время превышено
            questionTimeBox.style.background = 'linear-gradient(135deg, #c44569 0%, #8b2e4f 100%)';
        } else {
            questionTimeBox.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
        
        if (countdown === 0) {
            document.getElementById('nextBtn').disabled = false;
            document.getElementById('timeInfo').textContent = '⏰ Время вышло! Продолжайте отвечать, время все равно учитывается.';
        }
    },
    
    // Обновление основного таймера
    updateMainTimer(seconds) {
        const formatted = Timer.formatTime(seconds);
        document.getElementById('mainTimer').textContent = formatted;
        document.getElementById('totalTime').textContent = formatted;
    },
    
    // Показ времени на вопрос
    showQuestionTime(actualTimeSpent) {
        const timeMessage = actualTimeSpent > 60 
            ? `⏱️ Время на вопрос: ${Timer.formatTime(actualTimeSpent)} (превышено на ${Timer.formatTime(actualTimeSpent - 60)})`
            : `⏱️ Время на вопрос: ${Timer.formatTime(actualTimeSpent)}`;
        document.getElementById('timeInfo').textContent = timeMessage;
    },
    
    // Переключение ответа
    toggleAnswer() {
        const content = document.getElementById('answerContent');
        content.classList.toggle('show');
        // Активируем кнопку "Далее" после просмотра ответа
        if (content.classList.contains('show')) {
            document.getElementById('nextBtn').disabled = false;
        }
    },
    
    // Переключение объяснения
    toggleExplanation() {
        const content = document.getElementById('explanationContent');
        content.classList.toggle('show');
        // Активируем кнопку "Далее" после просмотра объяснения
        if (content.classList.contains('show')) {
            document.getElementById('nextBtn').disabled = false;
        }
    },
    
    // Показ результатов
    showResults(answeredQuestions, totalTimeSpent, avgTime) {
        document.getElementById('questionContainer').style.display = 'none';
        document.getElementById('results').classList.add('show');
        
        document.getElementById('finalTime').textContent = Timer.formatTime(totalTimeSpent);
        document.getElementById('avgTime').textContent = Timer.formatTime(avgTime);
        
        const tbody = document.getElementById('resultsBody');
        tbody.innerHTML = '';
        
        answeredQuestions.forEach(q => {
            const row = tbody.insertRow();
            row.insertCell(0).textContent = q.number;
            row.insertCell(1).textContent = q.category || 'Без категории';
            row.insertCell(2).textContent = q.question;
            row.insertCell(3).textContent = Timer.formatTime(q.time);
        });
    },
    
    // Показ практики
    showPractice() {
        document.getElementById('startControls').style.display = 'none';
        document.getElementById('questionContainer').style.display = 'block';
        document.getElementById('topicsSelection').style.display = 'none';
        document.getElementById('results').classList.remove('show');
        document.getElementById('loadingStatus').style.display = 'none';
        document.getElementById('errorStatus').style.display = 'none';
        document.getElementById('loadFileBtnTop').style.display = 'none';
        document.getElementById('loadButtonContainer').style.display = 'none';
        
        // Показываем блоки статистики и таймер
        document.getElementById('statsBlock').style.display = 'flex';
        document.getElementById('mainTimer').style.display = 'block';
        document.getElementById('restartBtn').style.display = 'block';
    },
    
    // Сброс к начальному состоянию
    resetToInitial() {
        document.getElementById('results').classList.remove('show');
        document.getElementById('startControls').style.display = 'flex';
        document.getElementById('topicsSelection').style.display = 'block';
        document.getElementById('questionContainer').style.display = 'none';
        document.getElementById('restartBtn').style.display = 'none';
        
        // Показываем кнопку загрузки файла, если файл был загружен ранее
        if (QuestionManager.getAllTopics().length > 0) {
            document.getElementById('loadFileBtnTop').style.display = 'block';
        } else {
            document.getElementById('loadButtonContainer').style.display = 'block';
        }
        
        // Показываем кнопку "Начать практику" если есть вопросы
        const startBtn = document.getElementById('startBtn');
        if (startBtn && QuestionManager.getQuestionsCount() > 0) {
            startBtn.style.display = 'inline-block';
        }
        
        // Скрываем блоки статистики и таймер
        document.getElementById('statsBlock').style.display = 'none';
        document.getElementById('mainTimer').style.display = 'none';
        document.getElementById('mainTimer').textContent = '00:00';
        document.getElementById('mainTimer').className = 'timer';
        document.getElementById('currentQuestion').textContent = '0/0';
        document.getElementById('totalTime').textContent = '00:00';
        document.getElementById('questionTime').textContent = '01:00';
    },
    
    // Показ начального состояния
    showInitialState() {
        document.getElementById('loadingStatus').style.display = 'block';
        document.getElementById('loadingStatus').style.color = '#666';
        document.getElementById('loadingStatus').innerHTML = '<p>Загрузите XLSX файл с вопросами</p>';
        document.getElementById('loadButtonContainer').style.display = 'block';
        document.getElementById('formatExample').style.display = 'block';
    }
};

