import * as React from 'react'

export interface TextInputProps {
  label: string
  name: string
  type: string
  value: any
  errorText?: string
  helpText?: string
  showHelpText?: boolean
  onChange: (name: string, value: any, e: any) => void
  placeHolder?: string
  white?: boolean
}

const TextInput: React.FunctionComponent<TextInputProps> = ({ label, name, type, value, errorText, helpText, showHelpText, onChange, placeHolder
}) => {
  const feedbackColor = errorText ? 'error' : showHelpText && helpText ? 'textMuted' : ''
  const feedback = errorText || (showHelpText &&
    helpText)
  const labelColor = 'primary'
  return (
    <div>
      <div>
        <span className={labelColor}>{label}</span>
        <input
          id={name}
          name={name}
          type={type}
          className='text-input'
          value={value || ''}
          placeholder={placeHolder}
          onChange={(e) => { onChange(name, e.target.value, e) }}
        />
      </div>
      <div>
        {feedback && <h6 style={{ textAlign: 'right' }} className={feedbackColor} >{feedback}</h6>}
      </div>
    </div>
  )
}

export default TextInput
