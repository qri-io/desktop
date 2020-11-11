import React from 'react'
import Button from '../../chrome/Button'

interface ExportSubmitButtonProps {
  text: string
  disabled: boolean
  loading: boolean
  onSubmit: () => void
  download?: string
  downloadName?: string
}

export const ExportSubmitButton: React.FunctionComponent<ExportSubmitButtonProps> = ({ text, disabled, loading, onSubmit }) =>
  <Button
    id='submit'
    color='dark'
    text={text}
    onClick={onSubmit}
    loading={loading}
    disabled={disabled}
  />