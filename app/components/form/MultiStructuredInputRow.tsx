// TODO (chriswhong): restore drag and drop sorting functionality,
// check out https://github.com/qri-io/desktop/commit/f0c1ac08850540be4b43db1fbb6b6a8d5d577594

import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import PseudoLink from '../PseudoLink'
import { User, Citation } from '../../models/dataset'

interface MultiStructuredInputRowProps {
  item: User | Citation
  name: 'contributors' | 'citations'
  index: number
  onChange: (index: number, value: User | Citation | null) => void
  onBlur: () => void
}

const MultiStructuredInputRow: React.FunctionComponent<MultiStructuredInputRowProps> = (props) => {
  const { item, index, onChange, onBlur, name } = props

  const handleChange = (type: string, value: string) => {
    item[type] = value
    onChange(index, item)
  }

  const removeMe = () => {
    onChange(index, null)
  }

  const inputs = (name === 'contributors')
    ? (
    <>
      <div className='input-column'><input className='input' type='text' value={item.id} onChange={(e) => { handleChange('id', e.target.value) }} onBlur={onBlur} autoFocus={true} /></div>
      <div className='input-column'><input className='input' type='text' value={item.name} onChange={(e) => { handleChange('name', e.target.value) }} onBlur={onBlur} /></div>
      <div className='input-column'><input className='input' type='email' value={item.email} onChange={(e) => { handleChange('email', e.target.value) }} onBlur={onBlur} /></div>
    </>
    ) : (
    <>
      <div className='input-column'><input className='input' type='text' value={item.name} onChange={(e) => { handleChange('name', e.target.value) }} onBlur={onBlur} autoFocus={true} /></div>
      <div className='input-column'><input className='input' type='text' value={item.url} onChange={(e) => { handleChange('url', e.target.value) }} onBlur={onBlur} /></div>
      <div className='input-column'><input className='input' type='email' value={item.email} onChange={(e) => { handleChange('email', e.target.value) }} onBlur={onBlur} /></div>
    </>
    )

  return (
    <div className='row-container' >
      <div className='row'>
        {inputs}
        <div className='remove-column'>
          <span onClick={removeMe}><PseudoLink><FontAwesomeIcon icon={faTimes} /></PseudoLink></span>
        </div>
      </div>
    </div>
  )
}

export default MultiStructuredInputRow
