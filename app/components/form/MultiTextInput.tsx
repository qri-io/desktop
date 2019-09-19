import * as React from 'react'
import PseudoLink from '../PseudoLink'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons'

export interface MultiTextInputProps {
  label?: string
  labelTooltip?: string
  name: string
  value: any
  onArrayChange: (name: string, value: any) => void
  placeHolder?: string
  tooltipFor?: string
}

const KeyCodes = {
  comma: 188,
  enter: 13
}

const delimiters = [ KeyCodes.comma, KeyCodes.enter ]

const MultiTextInput: React.FunctionComponent<MultiTextInputProps> = (props) => {
  const {
    label,
    labelTooltip,
    name,
    value = [],
    onArrayChange,
    placeHolder,
    tooltipFor
  } = props

  const [inputValue, setInputValue] = React.useState('')

  const handleChange = (e: any) => {
    setInputValue(e.target.value)
  }

  const setTag = (tagString: string) => {
    setInputValue('')
    onArrayChange(name, [...value, tagString])
  }

  const handleKeyDown = (e: any) => {
    if (delimiters.includes(e.keyCode)) {
      e.preventDefault()
      setTag(e.target.value.trim())
    }
  }

  const handleBlur = (e: any) => {
    if (e.target.value) {
      setTag(e.target.value.trim())
    }
  }

  const removeItem = (index: number) => {
    const clonedValue = Object.assign([], value)
    clonedValue.splice(index, 1)
    onArrayChange(name, clonedValue)
  }

  const labelColor = 'primary'
  return (
    <div className='multi-text-input-container'>
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
      <div className='multi-text-input'>
        { value.map((d: string, i: number) => (
          <div key={i} className='tag'>
            <span className='tag-text'>{d}</span>
            <span className='tag-remove' onClick={() => { removeItem(i) }}>
              <PseudoLink>
                <FontAwesomeIcon icon={faTimes} size={'sm'}/>
              </PseudoLink>
            </span>
          </div>
        ))}
        <input
          className='input tag-input'
          type='text'
          placeholder={placeHolder}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      </div>
      {/* placeholder for error text to match spacing with other form inputs */}
      <div style={{ height: 20 }} />
    </div>
  )
}

export default MultiTextInput
