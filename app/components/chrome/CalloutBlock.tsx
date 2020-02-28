import React from 'react'

export interface CalloutBlockProps {
  text: string
  type: 'info' | 'warning'

  cancelText?: string
  onCancel?: () => void
}

const CalloutBlock: React.FC<CalloutBlockProps> = ({ text, type, cancelText = 'cancel', onCancel }) => (
  <div className={`callout-block ${type}`}>
    {onCancel && <a className='cancel' onClick={onCancel}>{cancelText}</a>}
    <p className='text'>{text}</p>
  </div>
)

export default CalloutBlock
