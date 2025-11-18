import ScrollableTable from './ScrollableTable'

function FormatExample() {
  return (
    <div id="formatExample" style={{ textAlign: 'center', marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '15px' }}>
      <h3 style={{ color: '#667eea', marginBottom: '20px', fontSize: '1.2em' }}>
        📋 Пример формата файла
      </h3>
      <p style={{ color: '#666', marginBottom: '15px', fontSize: '0.95em' }}>
        Файл должен содержать следующие столбцы:
      </p>
      <ScrollableTable>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95em', minWidth: '600px' }}>
          <thead>
            <tr style={{ background: '#667eea', color: 'white' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', whiteSpace: 'nowrap' }}>Номер</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', whiteSpace: 'nowrap' }}>Вопрос</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', whiteSpace: 'nowrap' }}>Ответ</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', whiteSpace: 'nowrap' }}>Объяснение</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>1</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>Как получить текущий URL в Selenium?</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>driver.getCurrentUrl()</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>Метод getCurrentUrl() возвращает строку с текущим URL страницы</td>
            </tr>
            <tr style={{ background: '#f8f9fa' }}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>2</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>Как получить значение текстового поля?</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>element.getAttribute("value")</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>Метод getAttribute("value") возвращает значение атрибута value</td>
            </tr>
          </tbody>
        </table>
      </ScrollableTable>
      <p style={{ marginTop: '15px', color: '#666', fontSize: '0.9em' }}>
        Примечание: Названия столбцов могут быть на русском или английском языке
      </p>
    </div>
  )
}

export default FormatExample

