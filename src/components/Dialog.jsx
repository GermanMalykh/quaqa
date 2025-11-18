import './Dialog.css'

function Dialog({ isOpen, type = 'alert', title, message, onConfirm, onCancel }) {
  if (!isOpen) return null

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      if (type === 'alert') {
        handleConfirm()
      } else {
        handleCancel()
      }
    }
  }

  return (
    <div className="dialog-overlay" onClick={handleBackdropClick}>
      <div className="dialog-container">
        {title && <h3 className="dialog-title">{title}</h3>}
        <div className="dialog-message">{message}</div>
        <div className="dialog-buttons">
          <button
            className="dialog-btn dialog-btn-confirm"
            onClick={handleConfirm}
            autoFocus
          >
            {type === 'confirm' ? 'Подтвердить' : 'OK'}
          </button>
          {type === 'confirm' && (
            <button
              className="dialog-btn dialog-btn-cancel"
              onClick={handleCancel}
            >
              Отмена
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dialog

