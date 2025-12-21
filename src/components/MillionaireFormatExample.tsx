import ScrollableTable from './ScrollableTable'

function MillionaireFormatExample() {
  return (
    <div id="formatExample" style={{ textAlign: 'center', marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '15px' }}>
      <h3 style={{ color: '#667eea', marginBottom: '20px', fontSize: '1.2em' }}>
        📋 Пример формата файла
      </h3>
      <p style={{ color: '#666', marginBottom: '15px', fontSize: '0.95em' }}>
        Файл должен содержать следующие столбцы:
      </p>
      <ScrollableTable>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95em', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: '#667eea', color: 'white' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', whiteSpace: 'nowrap' }}>id</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', whiteSpace: 'nowrap' }}>question</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', whiteSpace: 'nowrap' }}>answer_a</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', whiteSpace: 'nowrap' }}>answer_b</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', whiteSpace: 'nowrap' }}>answer_c</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', whiteSpace: 'nowrap' }}>answer_d</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', whiteSpace: 'nowrap' }}>correct_answer</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', whiteSpace: 'nowrap' }}>explanation</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', whiteSpace: 'nowrap' }}>topic</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', whiteSpace: 'nowrap' }}>level</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>1</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>Как получить текущий URL в Selenium?</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>driver.getCurrentUrl()</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>driver.getTitle()</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>driver.getPageSource()</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>driver.navigate()</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>A</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>Метод getCurrentUrl() возвращает строку с текущим URL страницы</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>Selenium</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>easy</td>
            </tr>
            <tr style={{ background: '#f8f9fa' }}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>2</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>Как получить значение текстового поля?</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>element.getAttribute("value")</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>element.getText()</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>element.getTagName()</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>element.getSize()</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>A</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>Метод getAttribute("value") возвращает значение атрибута value</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>Selenium</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', wordBreak: 'break-word' }}>medium</td>
            </tr>
          </tbody>
        </table>
      </ScrollableTable>
      <p style={{ marginTop: '15px', color: '#666', fontSize: '0.9em' }}>
        Примечание: 
        <br />
        • <strong>correct_answer</strong> должен быть A, B, C или D
        <br />
        • <strong>level</strong> может быть: easy, medium или hard (опционально)
        <br />
        • <strong>topic</strong> - название темы (опционально)
      </p>
    </div>
  )
}

export default MillionaireFormatExample

