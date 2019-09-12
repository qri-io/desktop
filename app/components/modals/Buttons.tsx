import * as React from 'react'
import Button from '../chrome/Button'

interface ButtonsProps {
  cancelText: string
  submitText: string
  disabled: boolean
  loading: boolean
  onCancel: () => void
  onSubmit: () => void
}

const Buttons: React.FunctionComponent<ButtonsProps> = ({ cancelText, submitText, disabled, loading, onCancel, onSubmit }) =>
  <div className='buttons'>
    {cancelText && onCancel ? <Button id='cancel' text={cancelText} onClick={onCancel} color='muted' /> : <div></div>}
    <Button id='submit' color='primary' text={submitText} onClick={onSubmit} loading={loading} disabled={disabled} />
  </div>

export default Buttons
