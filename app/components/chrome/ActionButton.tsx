import React from 'react'
import sizeMe from 'react-sizeme'

import { DatasetAction } from '../../models/dataset'

import Icon from './Icon'

const ActionButton: React.FunctionComponent<DatasetAction> = (props) => {
  const { icon, onClick, text } = props

  return (
    <div className='action-button' onClick={onClick}>
      <Icon icon={icon} size='sm' color='medium' />
      <div className='text' >{text}</div>
    </div>
  )
}

export default sizeMe()(ActionButton)
