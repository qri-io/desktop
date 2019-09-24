import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

export interface TextAreaInputProps {
  label?: string
  labelTooltip?: string
  name: string
  value: any
  maxLength: number
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void | undefined
  onChange: (name: string, value: any) => void
  onBlur?: (name: string, value: any) => void
  placeHolder?: string
  rows?: number
  white?: boolean
  tooltipFor?: string
}

const TextAreaInput: React.FunctionComponent<TextAreaInputProps> = (props) => {
  const {
    label,
    labelTooltip,
    name,
    value,
    maxLength,
    onChange,
    onBlur,
    placeHolder,
    rows = 3,
    tooltipFor
  } = props

  const labelColor = 'primary'
  return (
    <>
      <div className='text-input-container'>
        {label && <><span className={labelColor}>{label}</span>&nbsp;&nbsp;</>}
        {labelTooltip && (
          <span
            data-tip={labelTooltip}
            data-for={tooltipFor || null}
            className='text-input-tooltip'
          >
            <FontAwesomeIcon icon={faInfoCircle} size='sm'/>
          </span>
        )}
        <textarea
          id={name}
          name={name}
          maxLength={maxLength}
          className='input'
          value={value || ''}
          placeholder={placeHolder}
          onChange={(e) => { onChange(name, e.target.value) }}
          onBlur={() => { onBlur && onBlur() }}
          rows={rows}
        />
        {/* placeholder for error text to match spacing with other form inputs */}
        <div style={{ height: 20 }} />
      </div>
    </>
  )
}

export default TextAreaInput
