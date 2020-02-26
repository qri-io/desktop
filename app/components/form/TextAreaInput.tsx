import * as React from 'react'

import InputLabel from './InputLabel'

export interface TextAreaInputProps {
  label: string
  labelTooltip?: string
  name: string
  value: any
  maxLength: number
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void | undefined
  onChange?: (name: string, value: any) => void
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void
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
    // onChange,
    onBlur,
    placeHolder,
    rows = 3,
    tooltipFor
  } = props

  return (
    <>
      <div className='text-input-container'>
        <InputLabel
          label={label}
          tooltip={labelTooltip}
          tooltipFor={tooltipFor}
        />
        <textarea
          id={name}
          name={name}
          maxLength={maxLength}
          className='input'
          value={value || ''}
          placeholder={placeHolder}
          // onChange={(e) => { if (onChange) onChange(name, e.target.value) }}
          onBlur={onBlur}
          rows={rows}
        />
        {/* placeholder for error text to match spacing with other form inputs */}
        <div style={{ height: 20 }} />
      </div>
    </>
  )
}

export default TextAreaInput
