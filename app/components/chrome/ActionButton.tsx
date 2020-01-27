import React from 'react'
import Icon from './Icon'

export interface ActionButtonProps {
  icon: string
  onClick: (e: React.MouseEvent) => void
  text: string
}

const ActionButton: React.FunctionComponent<ActionButtonProps> = (props) => {
  const { icon, onClick, text } = props

  return (
    <div className='action-button' onClick={onClick}>
      <Icon icon={icon} size='sm' color='medium' />
      <div className='text' >{text}</div>
    </div>
  )
}

export default ActionButton
