// TODO (chriswhong): restore drag and drop sorting functionality,
// check out https://github.com/qri-io/desktop/commit/f0c1ac08850540be4b43db1fbb6b6a8d5d577594

import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import cloneDeep from 'clone-deep'
import PseudoLink from '../PseudoLink'
import { User, Citation } from '../../models/dataset'
import DynamicEditField from '../form/DynamicEditField'

interface MetadataMultiInputrops {
  item: User | Citation
  name: 'contributors' | 'citations'
  index: number
  write: (e: React.SyntheticEvent, index: number, value: User | Citation | null) => void
  fields: string[]
  onRemove: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
}

const MetadataMultiInputItem: React.FunctionComponent<MetadataMultiInputrops> = (props) => {
  const { item, index, write, fields, onRemove, name } = props

  const handleWrite = (name: string, value: string, e: React.SyntheticEvent) => {
    const i = cloneDeep(item)
    i[name] = value
    console.log(i)
    write(e, index, i)
  }

  const inputs = <>
    {
      fields.map((field: string) => {
        return (<td key={field}><DynamicEditField
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          name={field}
          row={index}
          value={item ? item[field] || '' : ''}
          onChange={handleWrite}
          allowEmpty={true}
        /></td>)
      })
    }
  </>

  return (
    <tr className='row-container' id={`${name}-row-${index}`}>
      {inputs}
      <td className='remove-column'>
        <span id={`${name}-remove-row-${index}`} onClick={onRemove}><PseudoLink><FontAwesomeIcon icon={faTimes} /></PseudoLink></span>
      </td>
    </tr>
  )
}

export default MetadataMultiInputItem
