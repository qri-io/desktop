import * as React from 'react'
import classNames from 'classnames'
import { ISelectOption } from '../../models/forms'

export interface SelectInputProps {
  label?: string
  name: string
  options: ISelectOption[]
  error?: string
  value: any
  helpText?: string
  showHelpText?: boolean
  allowEmpty?: boolean
  onChange: (name: string, value: any, e: any) => void
}

const SelectInput: React.FunctionComponent<SelectInputProps> = ({ label, name, options, error, value, helpText, showHelpText, allowEmpty = false, onChange }) => {
  const feedback = error || (showHelpText && helpText)
  const feedbackStyle = classNames({ 'error': error, 'textMuted': showHelpText && helpText })
  return (
    <div>
      <div>
        {label && <span className='primary'>{label}</span>}
        <select
          id={name}
          name={name}
          className='input'
          value={value}
          onChange={(e) => { onChange(name, e.target.value, e) }}
        >
          {allowEmpty && <option value='' />}
          {options.map((opt: ISelectOption, i: number) => {
            return (<option key={i} value={opt.value}>{opt.name}</option>)
          }
          )}
        </select>
      </div>
      <div style={{ height: 20 }}>
        <h6 style={{ textAlign: 'left', margin: 3 }} className={feedbackStyle} >{feedback || ''}</h6>
      </div>
    </div>
  )
}

export default SelectInput
