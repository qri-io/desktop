import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import InputLabel from './InputLabel'
import Row from './MultiStructuredInputRow'
import { User, Citation } from '../../models/dataset'
import PseudoLink from '../PseudoLink'

export interface MultiStructuredInputProps {
  label: string
  labelTooltip?: string
  name: 'citations' | 'contributors'
  value: User[] | Citation[] | undefined
  onWrite?: (e: React.SyntheticEvent, target: string, value: any) => void
  placeHolder: string
  tooltipFor?: string
}

export const isUserArray = (array: any): array is User[] => {
  return array[0] && array[0].id !== undefined
}

const MultiStructuredInput: React.FunctionComponent<MultiStructuredInputProps> = (props) => {
  const {
    label,
    name,
    labelTooltip,
    value,
    onWrite,
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

  const [stateValue, setStateValue] = React.useState(value)

  React.useEffect(() => {
    if (value === stateValue) return
    setStateValue(value)
  }, [value])

  // handles changes, overwrites a user
  const handleChange = (e: React.ChangeEvent, index: number, item: User | Citation) => {
    if (stateValue) {
      const clonedArray: User[] | Citation[] = Object.assign([], stateValue)
      const clonedItem: User | Citation = Object.assign({}, item)
      if (item) {
        clonedArray[index] = clonedItem
        setStateValue(clonedArray)
      } else {
        // if item comes back null, remove item from array
        clonedArray.splice(index, 1)
        setStateValue(clonedArray)
        if (onWrite) {
          onWrite(e, name, clonedArray)
        }
      }
    }
  }

  const addItem = () => {
    const clonedArray: User[] | Citation[] = Object.assign([], stateValue)
    if (stateValue) {
      // add an empty object
      if (isUserArray(clonedArray)) {
        clonedArray.push(emptyObjects['contributors'])
      } else {
        clonedArray.push(emptyObjects['citations'])
      }
      // send the new array up to the parent
      setStateValue(clonedArray)
    } else {
      // push a new array with an empty object
      setStateValue([emptyObjects[name]])
    }
  }

  const headerRowValues = Object.keys(emptyObjects[name])

  const handleBlur = (e: React.SyntheticEvent) => {
    if (onWrite) onWrite(e, name, stateValue)
  }

  const getRows = () => {
    if (stateValue) {
      if (isUserArray(stateValue)) {
        return stateValue.map((item: User, i) => (
          <Row key={i} name={name} item={item} index={i} onChange={handleChange} onBlur={handleBlur} />
        ))
      } else {
        return stateValue.map((item: Citation, i) => (
          <Row key={i} name={name} item={item} index={i} onChange={handleChange} onBlur={handleBlur} />
        ))
      }
    }
    return null
  }

  return (
    <div className='input-container'>
      <InputLabel
        label={label}
        tooltip={labelTooltip}
        tooltipFor={tooltipFor}
      />
      <div className='multi-structured-input-container'>
        <div className='list'>
          <div className='multi-structured-input flex-table'>
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
            {stateValue && getRows()}
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
