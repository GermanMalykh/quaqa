// Модуль для загрузки и парсинга XLSX файлов
const XLSXLoader = {
    // Функция для парсинга листа Excel
    parseSheet(worksheet, sheetName) {
        if (!worksheet) return [];
        
        // Конвертируем лист в JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
            header: 1, 
            defval: '',
            raw: false 
        });
        
        if (jsonData.length < 2) return [];
        
        // Ищем индексы столбцов
        const headerRow = jsonData[0];
        const numberIndex = headerRow.findIndex(h => 
            String(h).toLowerCase().includes('номер') || 
            String(h).toLowerCase().includes('number') ||
            String(h).toLowerCase().includes('№')
        );
        const questionIndex = headerRow.findIndex(h => 
            String(h).toLowerCase().includes('вопрос') || 
            String(h).toLowerCase().includes('question')
        );
        const answerIndex = headerRow.findIndex(h => 
            String(h).toLowerCase().includes('ответ') || 
            String(h).toLowerCase().includes('answer')
        );
        const explanationIndex = headerRow.findIndex(h => 
            String(h).toLowerCase().includes('объяснение') || 
            String(h).toLowerCase().includes('explanation') ||
            String(h).toLowerCase().includes('под капотом')
        );
        
        if (questionIndex === -1 || answerIndex === -1 || explanationIndex === -1) {
            // Возвращаем пустой массив, ошибка будет обработана на уровне выше
            return [];
        }
        
        const parsedQuestions = [];
        
        // Парсим данные (начинаем со второй строки, так как первая - заголовок)
        for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (!row || row.length === 0) continue;
            
            const question = row[questionIndex] ? String(row[questionIndex]).trim() : '';
            const answer = row[answerIndex] ? String(row[answerIndex]).trim() : '';
            const explanation = row[explanationIndex] ? String(row[explanationIndex]).trim() : '';
            
            // Пропускаем пустые строки
            if (!question && !answer) continue;
            
            parsedQuestions.push({
                category: sheetName,
                question: question,
                answer: answer,
                explanation: explanation
            });
        }
        
        return parsedQuestions;
    },
    
    // Проверка формата листа
    validateSheetFormat(worksheet, sheetName) {
        if (!worksheet) return { valid: false, missing: ['Вопрос', 'Ответ', 'Объяснение'] };
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', raw: false });
        if (jsonData.length < 1) {
            return { valid: false, missing: ['Вопрос', 'Ответ', 'Объяснение'] };
        }
        
        const headerRow = jsonData[0];
        const questionIndex = headerRow.findIndex(h => 
            String(h).toLowerCase().includes('вопрос') || 
            String(h).toLowerCase().includes('question')
        );
        const answerIndex = headerRow.findIndex(h => 
            String(h).toLowerCase().includes('ответ') || 
            String(h).toLowerCase().includes('answer')
        );
        const explanationIndex = headerRow.findIndex(h => 
            String(h).toLowerCase().includes('объяснение') || 
            String(h).toLowerCase().includes('explanation') ||
            String(h).toLowerCase().includes('под капотом')
        );
        
        if (questionIndex === -1 || answerIndex === -1 || explanationIndex === -1) {
            const missingColumns = [];
            if (questionIndex === -1) missingColumns.push('Вопрос');
            if (answerIndex === -1) missingColumns.push('Ответ');
            if (explanationIndex === -1) missingColumns.push('Объяснение');
            return { valid: false, missing: missingColumns };
        }
        
        return { valid: true, missing: [] };
    },
    
    // Загрузка вопросов из файла
    loadFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    
                    const allQuestionsByTopic = {};
                    const sheetStats = [];
                    const formatErrors = [];
                    
                    // Получаем все листы из файла
                    const allSheetNames = workbook.SheetNames;
                    if (allSheetNames.length === 0) {
                        reject(new Error('NO_SHEETS: В файле нет листов. Файл должен содержать хотя бы один лист с вопросами.'));
                        return;
                    }
                    
                    // Обрабатываем каждый лист из файла
                    allSheetNames.forEach(sheetName => {
                        const worksheet = workbook.Sheets[sheetName];
                        if (!worksheet) {
                            console.warn(`Лист "${sheetName}" не найден в файле`);
                            return;
                        }
                        
                        const sheetQuestions = XLSXLoader.parseSheet(worksheet, sheetName);
                        
                        // Проверяем формат листа
                        if (sheetQuestions.length === 0) {
                            const validation = XLSXLoader.validateSheetFormat(worksheet, sheetName);
                            if (!validation.valid) {
                                formatErrors.push({ sheet: sheetName, missing: validation.missing });
                            }
                        }
                        
                        if (sheetQuestions.length > 0) {
                            // Сохраняем все вопросы по теме (название листа = название темы)
                            allQuestionsByTopic[sheetName] = sheetQuestions;
                            sheetStats.push({
                                name: sheetName,
                                total: sheetQuestions.length
                            });
                        }
                    });
                    
                    // Если есть ошибки формата, показываем их
                    if (formatErrors.length > 0 && Object.keys(allQuestionsByTopic).length === 0) {
                        const errorSheet = formatErrors[0];
                        reject(new Error(`FORMAT_ERROR: Лист "${errorSheet.sheet}": отсутствуют обязательные столбцы: ${errorSheet.missing.join(', ')}`));
                        return;
                    }
                    
                    // Проверяем, есть ли хотя бы один лист с вопросами
                    const foundSheets = Object.keys(allQuestionsByTopic);
                    if (foundSheets.length === 0) {
                        reject(new Error('NO_QUESTIONS: Не найдено ни одного вопроса в загруженных листах. Проверьте, что в листах есть данные и правильные названия столбцов (Вопрос, Ответ, Объяснение).'));
                        return;
                    }
                    
                    resolve({
                        questionsByTopic: allQuestionsByTopic,
                        stats: sheetStats
                    });
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = function() {
                reject(new Error('Ошибка чтения файла'));
            };
            
            reader.readAsArrayBuffer(file);
        });
    },
    
    // Загрузка из URL (для автоматической загрузки questions.xlsx)
    loadFromURL(url) {
        return fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.arrayBuffer();
                }
                throw new Error('Файл questions.xlsx не найден');
            })
            .then(data => {
                const workbook = XLSX.read(data, { type: 'array' });
                
                const allQuestionsByTopic = {};
                const sheetStats = [];
                const formatErrors = [];
                
                // Получаем все листы из файла
                const allSheetNames = workbook.SheetNames;
                if (allSheetNames.length === 0) {
                    throw new Error('NO_SHEETS: В файле нет листов. Файл должен содержать хотя бы один лист с вопросами.');
                }
                
                // Обрабатываем каждый лист из файла
                allSheetNames.forEach(sheetName => {
                    const worksheet = workbook.Sheets[sheetName];
                    if (!worksheet) {
                        console.warn(`Лист "${sheetName}" не найден в файле`);
                        return;
                    }
                    
                        const sheetQuestions = XLSXLoader.parseSheet(worksheet, sheetName);
                        
                        // Проверяем формат листа
                        if (sheetQuestions.length === 0) {
                            const validation = XLSXLoader.validateSheetFormat(worksheet, sheetName);
                            if (!validation.valid) {
                                formatErrors.push({ sheet: sheetName, missing: validation.missing });
                            }
                        }
                    
                    if (sheetQuestions.length > 0) {
                        // Сохраняем все вопросы по теме (название листа = название темы)
                        allQuestionsByTopic[sheetName] = sheetQuestions;
                        sheetStats.push({
                            name: sheetName,
                            total: sheetQuestions.length
                        });
                    }
                });
                
                // Если есть ошибки формата, показываем их
                if (formatErrors.length > 0 && Object.keys(allQuestionsByTopic).length === 0) {
                    const errorSheet = formatErrors[0];
                    throw new Error(`FORMAT_ERROR: Лист "${errorSheet.sheet}": отсутствуют обязательные столбцы: ${errorSheet.missing.join(', ')}`);
                }
                
                // Проверяем, есть ли хотя бы один лист с вопросами
                const foundSheets = Object.keys(allQuestionsByTopic);
                if (foundSheets.length === 0) {
                    throw new Error('NO_QUESTIONS: Не найдено ни одного вопроса в загруженных листах. Проверьте, что в листах есть данные и правильные названия столбцов (Вопрос, Ответ, Объяснение).');
                }
                
                return {
                    questionsByTopic: allQuestionsByTopic,
                    stats: sheetStats
                };
            });
    }
};

