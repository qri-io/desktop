import * as React from 'react'
import classNames from 'classnames'

export interface CheckboxInputProps {
  name: string
  checked: boolean
  onChange: (name: string, checked: boolean) => void

  label?: string
  strong?: boolean
  disabled?: boolean
}

const CheckboxInput: React.FunctionComponent<CheckboxInputProps> = ({
  label,
  name,
  checked,
  onChange,
  strong = false,
  disabled = false
}) => (
  <div className={classNames('checkbox-input-container', { disabled })}>
    <input
      id={name}
      name={name}
      type='checkbox'
      className='checkbox-input'
      checked={checked}
      onChange={ () => { onChange(name, !checked) }}
      disabled={disabled}
    />
    <span className={classNames({ strong })}>{label}</span>
  </div>
)

export default CheckboxInput
