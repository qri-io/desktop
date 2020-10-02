import React from 'react'
import classNames from 'classnames'

export interface TristateCheckboxInputProps {
  label?: string
  name: string
  value: boolean | 'indeterminate'
  onChange: (name: string, checked: boolean) => void
  strong?: boolean
  disabled?: boolean
}

const TristateCheckboxInput: React.FunctionComponent<TristateCheckboxInputProps> = ({
  label,
  name,
  value,
  onChange,
  strong = false,
  disabled = false
}) => (
  <div className={classNames('checkbox-input-container', 'tristate', { disabled })}>
    <input
      id={name}
      name={name}
      type='checkbox'
      className='checkbox-input'
      checked={(value !== 'indeterminate' && value)}
      onChange={() => { onChange(name, !value) }}
      ref={el => el && (el.indeterminate = (value === 'indeterminate'))}
      disabled={disabled}
    />
    <span className={classNames({ strong })}>{label}</span>
  </div>
)

export default TristateCheckboxInput
