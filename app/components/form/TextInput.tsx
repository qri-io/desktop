import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

export interface TextInputProps {
  label?: string
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
  placeHolder?: string
  white?: boolean
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
    onKeyDown,
    placeHolder
  } = props

  const feedbackColor = errorText ? 'error' : showHelpText && helpText ? 'textMuted' : ''
  const feedback = errorText || (showHelpText &&
    helpText)
  const labelColor = 'primary'
  return (
    <>
      <div className='text-input-container'>
        {label && <><span className={labelColor}>{label}</span>&nbsp;&nbsp;</>}
        {labelTooltip && (
          <span
            data-tip={labelTooltip}
            data-for={'modal-tooltip'}
            className='text-input-tooltip'
          >
            <FontAwesomeIcon icon={faInfoCircle} size='sm'/>
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          maxLength={maxLength}
          className='input'
          value={value || ''}
          placeholder={placeHolder}
          onChange={(e) => { onChange(name, e.target.value) }}
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
