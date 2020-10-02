import * as React from 'react'
import classNames from 'classnames'

export interface CheckboxInputProps {
  label?: string
  name: string
  checked: boolean
  indeterminate?: boolean
  onChange: (name: string, checked: any) => void
  strong?: boolean
  disabled?: boolean
}

const CheckboxInput: React.FunctionComponent<CheckboxInputProps> = (props) => {
  const { label, name, checked, onChange, indeterminate = false, strong = false, disabled = false } = props
  return (
    <div className={classNames('checkbox-input-container', { disabled })}>
      <input
        id={name}
        name={name}
        type='checkbox'
        className='checkbox-input'
        checked={checked}
        onChange={ () => { onChange(name, !checked) }}
        ref={el => el && (el.indeterminate = indeterminate)}
        disabled={disabled}
      />
      { strong ? (<strong>{label}</strong>) : label }
    </div>
  )
}

export default CheckboxInput
