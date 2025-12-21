import { useRef } from 'react'
import ErrorStatus from '@/components/ErrorStatus'
import MillionaireFormatExample from '@/components/MillionaireFormatExample'

interface MillionaireFileLoaderProps {
  onFileLoad: (file: File) => Promise<void>
  error: string | null
  onRetry: () => void
}

export default function MillionaireFileLoader({ onFileLoad, error, onRetry }: MillionaireFileLoaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await onFileLoad(file)
      // Сбрасываем input для возможности повторной загрузки того же файла
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      padding: '30px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '20px',
      maxWidth: '1200px',
      margin: '0 auto 20px'
    }}>
        <h2 style={{
          marginTop: 0,
          marginBottom: '20px',
          color: '#333',
          fontSize: '1.8em',
          borderBottom: '2px solid #667eea',
          paddingBottom: '15px'
        }}>
          📋 Загрузка вопросов для игры "Миллионер"
        </h2>

        {error && <ErrorStatus error={error} />}

        <div style={{ marginTop: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <input
              ref={fileInputRef}
              type="file"
              id="millionaireFileInput"
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            <button 
              className="btn btn-primary" 
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: '12px 25px', fontSize: '1em' }}
            >
              📋 Загрузить вопросы из XLSX
            </button>
          </div>
          <MillionaireFormatExample />
        </div>
    </div>
  )
}

