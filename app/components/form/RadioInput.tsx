import React from 'react'
import classNames from 'classnames'

export interface RadioInputProps {
  name: string
  checked: boolean
  onChange: (name: string, checked: boolean) => void

  label?: string
  strong?: boolean
  disabled?: boolean
}

const RadioInput: React.FC<RadioInputProps> = ({
  label,
  name,
  checked,
  onChange,
  strong = false,
  disabled = false
}) => (
  <div className={classNames('radio-input-container', { disabled })}>
    <input
      id={name}
      name={name}
      type='radio'
      className='radio-input'
      checked={checked}
      onChange={() => { onChange(name, !checked) }}
      disabled={disabled}
    />
    <span className={classNames({ strong })}>{label}</span>
  </div>
)

export default RadioInput
