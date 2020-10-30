import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import cloneDeep from 'clone-deep'
import classNames from 'classnames'

import InputLabel from './InputLabel'
import Row from '../item/MetadataMultiInputItem'
import { User, Citation } from '../../models/dataset'
import PseudoLink from '../PseudoLink'

export interface MetadataMultiInputProps {
  label: string
  labelTooltip?: string
  name: 'citations' | 'contributors'
  value: User[] | Citation[] | undefined
  onWrite: (e: React.SyntheticEvent, target: string, value: any) => void
  placeHolder: string
  tooltipFor?: string
}

export const isUserArray = (array: any): array is User[] => {
  return array[0] && array[0].id !== undefined
}

const MetadataMultiInput: React.FunctionComponent<MetadataMultiInputProps> = (props) => {
  const {
    label,
    name,
    labelTooltip,
    value,
    onWrite,
    tooltipFor,
    placeHolder
  } = props

  const emptyValues = {
    contributors: {
      id: '',
      name: '',
      email: ''
    },
    citations: {
      name: '',
      url: '',
      email: ''
    }
  }

  const [numRows, setNumRows] = React.useState(value ? value.length : 0)
  const [canAdd, setCanAdd] = React.useState(true)

  React.useEffect(() => {
    if (value) {
      if (value.length === numRows && !canAdd) setCanAdd(true)
      else if (value.length < numRows && canAdd) setCanAdd(false)
    } else {
      if (numRows === 0 && !canAdd) setCanAdd(true)
      else if (numRows !== 0 && canAdd) setCanAdd(false)
    }
  }, [value])

  // handles changes, overwrites a user
  const handleWrite = (e: React.ChangeEvent, index: number, item: User | Citation) => {
    let valueCopy = cloneDeep(value)
    const allBlank = Object.keys(item).every((field: string) => {
      return item[field] === ''
    })

    // if this is a new row that the user has not added to yet
    // don't do anything, leave the row blank and available
    if (allBlank && (!valueCopy || valueCopy.length === index)) {
      return
    }

    if (!valueCopy) {
      onWrite(e, name, [item])
    } else {
      // in this case, since the row previously existed but is now blank, we should remove it
      if (allBlank) {
        removeItem(index)
        return
      }
      valueCopy[index] = item
      onWrite(e, name, valueCopy)
    }
  }

  const addItem = () => {
    setNumRows((prev: number) => prev + 1)
    setCanAdd(false)
  }

  const removeItem = (index: number) => {
    return (e: React.SyntheticEvent) => {
      if (!value) return
      const valueCopy = cloneDeep(value)
      setNumRows(prev => prev - 1)
      if (index !== valueCopy.length) {
        valueCopy.splice(index, 1)
        onWrite(e, name, valueCopy)
      }
    }
  }

  const headerRowValues = Object.keys(emptyValues[name])

  const getRows = (numRows: number) => {
    const rows: JSX.Element[] = []
    let val: User | Citation
    for (var i = 0; i < numRows; i++) {
      if (!value || value.length === i) {
        val = cloneDeep(emptyValues[name])
      } else {
        val = value[i]
      }
      rows.push(<Row
        key={i}
        name={name}
        item={val}
        index={i}
        write={handleWrite}
        fields={Object.keys(emptyValues[name])}
        onRemove={removeItem(i)}
      />)
    }
    return rows
  }

  let onKeyDown
  if (canAdd) {
    onKeyDown = (e) => { if (e.key === 'Enter') addItem() }
  }

  let onClick
  if (canAdd) {
    onClick = addItem
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
          <table>
            <colgroup>
              {
                headerRowValues.map((field: string, i: number) => <col key={i}/>)
              }
              <col className={'remove-col'} />
            </colgroup>
            <thead>
              <tr>
                {
                  headerRowValues.map((d: string) => (
                    <th className='input-column capitalize' key={d}>
                      {d.charAt(0) + d.slice(1)}
                    </th>
                  ))
                }
                <th className='remove-column'></th>
              </tr>
            </thead>
            <tbody>
              {getRows(numRows)}
            </tbody>
          </table>
          <div className='add-item'>
            <PseudoLink>
              <span
                id={`${name}-add-item`}
                className={classNames({ 'disabled': !canAdd })}
                onClick={onClick}
                tabIndex={0}
                onKeyDown={onKeyDown}
              >
                <FontAwesomeIcon icon={faPlus} /> &nbsp;{placeHolder}
              </span>
            </PseudoLink>
          </div>
        </div>
        <div className='row'>
        </div>
      </div>
      {/* placeholder for error text to match spacing with other form inputs */}
      <div style={{ height: 20 }} />
    </div>
  )
}

export default MetadataMultiInput
