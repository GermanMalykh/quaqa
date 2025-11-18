function FormatExample() {
  return (
    <div id="formatExample" style={{ 
      marginTop: '30px', 
      padding: '20px', 
      background: '#f8f9fa', 
      borderRadius: '15px', 
      maxWidth: '900px', 
      marginLeft: 'auto', 
      marginRight: 'auto' 
    }}>
      <h3 style={{ textAlign: 'center', color: '#667eea', marginBottom: '20px' }}>
        📋 Формат файла с вопросами
      </h3>
      <div style={{ textAlign: 'left', background: 'white', padding: '20px', borderRadius: '10px' }}>
        <p style={{ marginBottom: '15px', fontWeight: 'bold' }}>
          Файл может содержать любое количество листов. Каждый лист будет отдельной темой.
        </p>
        <p style={{ marginBottom: '15px', fontSize: '0.9em', color: '#666' }}>
          Например: "Selenium", "Java", "Тестирование", "Вопросы по API" и т.д. Название листа = название темы.
        </p>
        
        <p style={{ marginBottom: '15px', fontWeight: 'bold' }}>На каждом листе должны быть следующие столбцы:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95em', marginBottom: '15px' }}>
          <thead>
            <tr style={{ background: '#667eea', color: 'white' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Номер</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Вопрос</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Ответ</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Объяснение</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>1</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Как получить текущий URL в Selenium?</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>driver.getCurrentUrl()</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Метод getCurrentUrl() возвращает строку с текущим URL страницы</td>
            </tr>
            <tr style={{ background: '#f8f9fa' }}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>2</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Как получить значение текстового поля?</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>element.getAttribute("value")</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Метод getAttribute("value") возвращает значение атрибута value</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
          <strong>Примечание:</strong> Названия столбцов могут быть на русском или английском языке (Question, Answer, Explanation). 
          Первая строка должна содержать заголовки столбцов, данные начинаются со второй строки.
        </p>
      </div>
    </div>
  )
}

export default FormatExample

