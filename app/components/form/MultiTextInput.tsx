import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import InputLabel from './InputLabel'
import PseudoLink from '../PseudoLink'

export interface MultiTextInputProps {
  label: string
  labelTooltip?: string
  name: string
  value: any
  onArrayChange: (e: React.SyntheticEvent, name: string, value: any) => void
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

  const id = `${name}-tag-input`

  const [stateValue, setStateValue] = React.useState(value)

  React.useEffect(() => {
    // TODO (ramfox): now that we have timestamps from websockets
    // we should keep timestamps of when the last state update was vs the last
    // props update, and only change if the file has updated more recently
    if (JSON.stringify(value) !== JSON.stringify(stateValue)) {
      setStateValue(value)
    }
  }, [value])

  const setTag = (e: React.SyntheticEvent, tagString: string) => {
    const i = document.getElementById(id)
    if (i) i.value = ''
    const newTagList = [...stateValue, tagString]
    onArrayChange(e, name, newTagList)
  }

  const handleKeyDown = (e: any) => {
    if (delimiters.includes(e.keyCode)) {
      e.preventDefault()
      setTag(e, e.target.value.trim())
    }
  }

  const handleBlur = (e: any) => {
    const tagString = e.target.value.trim()
    if (tagString === '') return
    if (e.target.value) {
      setTag(e, tagString)
    }
  }

  const removeItem = (e: React.SyntheticEvent, index: number) => {
    const clonedValue = Object.assign([], stateValue)
    clonedValue.splice(index, 1)
    onArrayChange(e, name, clonedValue)
  }

  return (
    <div className='multi-text-input-container'>
      <InputLabel
        label={label}
        tooltip={labelTooltip}
        tooltipFor={tooltipFor}
      />
      <div className='multi-text-input'>
        { stateValue.map((d: string, i: number) => (
          <div key={i} className='tag' id={`${name}-tag-${i}`}>
            <span className='tag-text'>{d}</span>
            <span className='tag-remove' onClick={(e: React.SyntheticEvent) => { removeItem(e, i) }}>
              <PseudoLink>
                <FontAwesomeIcon icon={faTimes} size={'sm'} color='white'/>
              </PseudoLink>
            </span>
          </div>
        ))}
        <input
          id={id}
          className='input tag-input'
          type='text'
          placeholder={placeHolder}
          defaultValue={''}
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
