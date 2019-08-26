import * as React from 'react'

export interface TextInputProps {
  label?: string
  name: string
  type: string
  value: any
  maxLength: number
  errorText?: string
  helpText?: string
  showHelpText?: boolean
  onChange: (name: string, value: any, e: any) => void
  placeHolder?: string
  white?: boolean
}

const TextInput: React.FunctionComponent<TextInputProps> = ({ label, name, type, value, maxLength, errorText, helpText, showHelpText, onChange, placeHolder
}) => {
  const feedbackColor = errorText ? 'error' : showHelpText && helpText ? 'textMuted' : ''
  const feedback = errorText || (showHelpText &&
    helpText)
  const labelColor = 'primary'
  return (
    <>
      <div className='text-input-container'>
        {label && <span className={labelColor}>{label}</span>}
        <input
          id={name}
          name={name}
          type={type}
          maxLength={maxLength}
          className='input'
          value={value || ''}
          placeholder={placeHolder}
          onChange={(e) => { onChange(name, e.target.value, e) }}
        />
      </div>
      <div style={{ height: 20 }}>
        <h6 style={{ textAlign: 'left', margin: 3 }} className={feedbackColor} >{feedback || ''}</h6>
      </div>
    </>
  )
}

export default TextInput
