import * as React from 'react'
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

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

  const labelColor = 'primary'

  const control = (base: React.CSSProperties) => ({
    ...base,
    border: '1',
    boxShadow: '0',
    '&:hover': {
      borderColor: '#0061a682'
    }
  })

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
        <Select
          className='react-select'
          value={value}
          onChange={onChange}
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
