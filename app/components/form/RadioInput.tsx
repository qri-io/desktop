import * as React from 'react'
import classNames from 'classnames'

export interface RadioInputProps {
  label?: string
  name: string
  checked: boolean
  onChange: (name: string, checked: any) => void
  strong?: boolean
  disabled?: boolean
}

const RadioInput: React.FunctionComponent<RadioInputProps> = (props) => {
  const { label, name, checked, onChange, strong = false, disabled = false } = props

  return (
    <>
      <div className={classNames('radio-input-container', { disabled })}>
        <input
          id={name}
          name={name}
          type='radio'
          className='radio-input'
          checked={checked}
          onChange={ () => { onChange(name, !checked) }}
          disabled={disabled}
        />
        { strong && (
          <strong>{label}</strong>
        )}
        {!strong && label}
      </div>
    </>
  )
}

export default RadioInput
