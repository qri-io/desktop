import * as React from 'react'

import InputLabel from './InputLabel'

export interface TextInputProps {
  label: string
  labelTooltip?: string
  name: string
  type: string
  value: any
  maxLength: number
  errorText?: string
  helpText?: string
  showHelpText?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void | undefined
  onChange: (name: string, value: any) => void
  onBlur?: () => void
  placeHolder?: string
  white?: boolean
  tooltipFor?: string
}

const TextInput: React.FunctionComponent<TextInputProps> = (props) => {
  const {
    label,
    labelTooltip,
    name,
    type,
    value,
    maxLength,
    errorText,
    helpText,
    showHelpText,
    onChange,
    onBlur,
    onKeyDown,
    placeHolder,
    tooltipFor
  } = props

  const feedbackColor = errorText ? 'error' : showHelpText && helpText ? 'textMuted' : ''
  const feedback = errorText || (showHelpText &&
    helpText)
  return (
    <>
      <div className='text-input-container'>
        <InputLabel
          label={label}
          tooltip={labelTooltip}
          tooltipFor={tooltipFor}
        />
        <input
          id={name}
          name={name}
          type={type}
          maxLength={maxLength}
          className='input'
          value={value || ''}
          placeholder={placeHolder}
          onChange={(e) => { onChange(name, e.target.value) }}
          onBlur={() => { onBlur && onBlur() }}
          onKeyDown={onKeyDown}
        />
        <div style={{ height: 20 }}>
          <h6 style={{ textAlign: 'left', margin: 3 }} className={feedbackColor} >{feedback || ''}</h6>
        </div>
      </div>
    </>
  )
}

export default TextInput
