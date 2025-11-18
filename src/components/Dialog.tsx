import './Dialog.css'
import PropTypes from 'prop-types'
import { memo } from 'react'
import type { DialogType, DialogState } from '../types'

interface DialogProps {
  isOpen: boolean
  type?: DialogType
  title?: string
  message: string
  onConfirm?: (() => void) | null
  onCancel?: (() => void) | null
}

function Dialog({ isOpen, type = 'alert', title, message, onConfirm, onCancel }: DialogProps) {
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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
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

Dialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(['alert', 'confirm']),
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func
}

export default memo(Dialog)

