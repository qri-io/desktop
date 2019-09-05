import * as React from 'react'

export interface CheckboxInputProps {
  label?: string
  name: string
  checked: boolean
  onChange: (name: string, checked: any) => void
}

const CheckboxInput: React.FunctionComponent<CheckboxInputProps> = ({ label, name, checked, onChange }) => {
  const labelColor = 'primary'
  return (
    <>
      <div className='checkbox-input-container'>
        <input
          id={name}
          name={name}
          type='checkbox'
          className='checkbox-input'
          checked={checked}
          onChange={ () => { onChange(name, !checked) }}
        />
        {label && <span className={labelColor}>{label}</span>}
      </div>
    </>
  )
}

export default CheckboxInput
