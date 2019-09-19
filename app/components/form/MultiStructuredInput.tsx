import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faPlus } from '@fortawesome/free-solid-svg-icons'

import Row from './MultiStructuredInputRow'
import { User, Citation } from '../../models/dataset'
import PseudoLink from '../PseudoLink'

export interface MultiStructuredInputProps {
  label?: string
  labelTooltip?: string
  name: 'citations' | 'contributors'
  value: User[] | Citation[] | undefined
  onChange: (name: string, value: any) => void
  onArrayChange: (name: string, value: any) => void
  onBlur?: () => void
  placeHolder: string
  tooltipFor?: string
}

export const isUserArray = (array: any): array is User[] => {
  return array[0].id !== undefined
}

const MultiStructuredInput: React.FunctionComponent<MultiStructuredInputProps> = (props) => {
  const {
    label,
    name,
    labelTooltip,
    value,
    onChange,
    onBlur,
    onArrayChange,
    tooltipFor,
    placeHolder
  } = props

  const emptyObjects = {
    citations: {
      name: '',
      url: '',
      email: ''
    },
    contributors: {
      id: '',
      name: '',
      email: ''
    }
  }

  // handles changes, overwrites a user
  const handleChange = (index: number, item: User | Citation) => {
    if (value) {
      const clonedArray: User[] | Citation[] = Object.assign([], value)
      const clonedItem: User | Citation = Object.assign({}, item)
      if (item) {
        clonedArray[index] = clonedItem
        onChange(name, clonedArray)
      } else {
        // if item comes back null, remove item from array
        clonedArray.splice(index, 1)
        onArrayChange(name, clonedArray)
      }
    }
  }

  const labelColor = 'primary'

  const addItem = () => {
    const clonedArray: User[] | Citation[] = Object.assign([], value)
    if (value) {
      // add an empty object
      if (isUserArray(clonedArray)) {
        clonedArray.push(emptyObjects['contributors'])
      } else {
        clonedArray.push(emptyObjects['citations'])
      }
      // send the new array up to the parent
      onChange(name, clonedArray)
    } else {
      // push a new array with an empty object
      onChange(name, [emptyObjects[name]])
    }
  }

  const headerRowValues = Object.keys(emptyObjects[name])

  const getRows = () => {
    if (value) {
      if (isUserArray(value)) {
        return value.map((item: User, i) => (
          <Row key={i} name={name} item={item} index={i} onChange={handleChange} onBlur={() => { onBlur && onBlur() }} />
        ))
      } else {
        return value.map((item: Citation, i) => (
          <Row key={i} name={name} item={item} index={i} onChange={handleChange} onBlur={() => { onBlur && onBlur() }} />
        ))
      }
    }
    return null
  }

  return (
    <div className='input-container'>
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

      <div className='multi-structured-input-container'>
        <div className='list'>
          <div className='multi-structured-input'>
            <div className='row header-row'>
              {
                headerRowValues.map((d: string) => (
                  <div className='input-column capitalize' key={d}>
                    {d.charAt(0) + d.slice(1)}
                  </div>
                ))
              }
              <div className='remove-column'></div>
            </div>
            {value && getRows()}
            <div className='add-item'>
              <PseudoLink>
                <span onClick={addItem} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') addItem() }}>
                  <FontAwesomeIcon icon={faPlus} /> &nbsp;{placeHolder}
                </span>
              </PseudoLink>
            </div>
          </div>
          <div className='row'>
          </div>
        </div>
      </div>
      {/* placeholder for error text to match spacing with other form inputs */}
      <div style={{ height: 20 }} />
    </div>
  )
}

export default MultiStructuredInput
