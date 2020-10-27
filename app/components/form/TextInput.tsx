import React from 'react'

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
  onChange?: (e: React.ChangeEvent) => void | undefined
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
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

  const [stateValue, setStateValue] = React.useState(value)

  React.useEffect(() => {
    if (value !== stateValue) setStateValue(value)
  }, [value])

  const feedbackColor = errorText ? 'error' : showHelpText && helpText ? 'textMuted' : ''
  const feedback = errorText || (showHelpText &&
    helpText)

  const handleOnChange = (e: React.ChangeEvent) => {
    if (onChange) onChange(e)
    else setStateValue(e.target.value)
  }

  return (
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
        value={stateValue || ''}
        placeholder={placeHolder}
        onChange={handleOnChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
      <div>
        <h6 style={{ textAlign: 'left', margin: 3 }} className={feedbackColor} >{feedback || ''}</h6>
      </div>
    </div>
  )
}

export default TextInput
