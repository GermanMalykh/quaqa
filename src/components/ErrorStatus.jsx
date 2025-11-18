function ErrorStatus({ error }) {
  if (!error) return null

  const errorMsg = error.message || String(error)
  let errorHTML = ''

  if (errorMsg.includes('FORMAT_ERROR')) {
    errorHTML = (
      <>
        <h3 style={{ color: '#ee5a6f', marginBottom: '15px' }}>❌ Ошибка формата файла</h3>
        <p style={{ marginBottom: '15px', fontWeight: 'bold' }}>
          {errorMsg.replace('FORMAT_ERROR: ', '')}
        </p>
        <div style={{ textAlign: 'left', background: 'white', padding: '15px', borderRadius: '8px', marginTop: '15px' }}>
          <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Требуемый формат столбцов:</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em' }}>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Номер</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Вопрос</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Ответ</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Объяснение</th>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>1</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>Как получить текущий URL?</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>driver.getCurrentUrl()</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>Метод возвращает URL...</td>
            </tr>
          </table>
          <p style={{ marginTop: '15px', fontSize: '0.9em', color: '#666' }}>
            Примечание: Названия столбцов могут быть на русском или английском языке
          </p>
        </div>
      </>
    )
  } else if (errorMsg.includes('NO_SHEETS')) {
    errorHTML = (
      <>
        <h3 style={{ color: '#ee5a6f', marginBottom: '15px' }}>❌ Ошибка: файл не содержит листов</h3>
        <p style={{ marginBottom: '15px' }}>{errorMsg.replace('NO_SHEETS: ', '')}</p>
      </>
    )
  } else if (errorMsg.includes('NO_QUESTIONS')) {
    errorHTML = (
      <>
        <h3 style={{ color: '#ee5a6f', marginBottom: '15px' }}>❌ Ошибка: не найдено вопросов</h3>
        <p style={{ marginBottom: '15px' }}>{errorMsg.replace('NO_QUESTIONS: ', '')}</p>
        <div style={{ textAlign: 'left', background: 'white', padding: '15px', borderRadius: '8px', marginTop: '15px' }}>
          <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Возможные причины:</p>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Листы пустые (нет данных после заголовка)</li>
            <li>Неправильные названия столбцов</li>
            <li>Данные начинаются не со второй строки</li>
          </ul>
        </div>
      </>
    )
  } else {
    errorHTML = (
      <>
        <h3 style={{ color: '#ee5a6f', marginBottom: '15px' }}>❌ Ошибка загрузки</h3>
        <p>{errorMsg}</p>
      </>
    )
  }

  return (
    <div id="errorStatus" style={{ textAlign: 'center', marginTop: '20px', color: '#ee5a6f' }}>
      <div id="errorMessage" style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '20px', 
        background: '#fff5f5', 
        borderRadius: '10px', 
        borderLeft: '4px solid #ee5a6f' 
      }}>
        {errorHTML}
      </div>
    </div>
  )
}

export default ErrorStatus

