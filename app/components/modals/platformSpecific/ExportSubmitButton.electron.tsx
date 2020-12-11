import React from 'react'
import Button from '../../chrome/Button'

interface ExportSubmitButtonProps {
  text: string
  disabled: boolean
  loading: boolean
  onClick: () => void
  download?: string
  downloadName?: string
}

export const ExportSubmitButton: React.FunctionComponent<ExportSubmitButtonProps> = ({ text, disabled, loading, onClick }) => {
  return <Button
    id='submit'
    color='dark'
    text={text}
    onClick={onClick}
    loading={loading}
    disabled={disabled}
  />
}
