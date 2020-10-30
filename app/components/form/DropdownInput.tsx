import React from 'react'
import Select from 'react-select'

import InputLabel from './InputLabel'

interface Option {
  label: string
  value: string
}

export interface TextInputProps {
  label?: string
  labelTooltip?: string
  name: string
  options: Option[]
  value: Option | null
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void | undefined
  onChange: (selectedOption: Option) => void
  placeHolder?: string
  tooltipFor?: string
}

const TextInput: React.FunctionComponent<TextInputProps> = (props) => {
  const {
    label,
    labelTooltip,
    value,
    onChange,
    options,
    placeHolder,
    tooltipFor
  } = props

  const control = (base: React.CSSProperties) => ({
    ...base,
    border: '1',
    boxShadow: '0',
    '&:hover': {
      borderColor: '#0061a682'
    }
  })

  const [stateValue, setStateValue] = React.useState(value)

  React.useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(stateValue)) setStateValue(stateValue)
  }, [value])

  const handleOnChange = (value: any) => {
    setStateValue(value)
    onChange(value)
  }

  return (
    <>
      <div className='text-input-container'>
        <InputLabel
          label={label}
          tooltip={labelTooltip}
          tooltipFor={tooltipFor}
        />
        <Select
          className='react-select'
          value={stateValue}
          onChange={handleOnChange}
          options={options}
          placeholder={placeHolder}
          styles={{ control }}
          isClearable
        />
        {/* placeholder for error text to match spacing with other form inputs */}
        <div style={{ height: 20 }} />
      </div>
    </>
  )
}

export default TextInput
