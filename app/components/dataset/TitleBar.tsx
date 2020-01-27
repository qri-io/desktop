import React from 'react'
import { ActionButtonProps } from '../chrome/ActionButton'
import Icon from '../chrome/Icon'

interface TitleBarProps {
  icon?: string
  title: string
  data: ActionButtonProps[]
}

const TitleBar: React.FunctionComponent<TitleBarProps> = (props) => {
  const { icon, title, data } = props
  return (
    <div className='title-bar'>
      <div className='left' >
        {icon &&
          <div className='title-bar-icon'>
            <Icon icon={icon} size='lg' />
          </div>
        }
        <div className='title-bar-title'>{title}</div>
      </div>
      <div className='right'></div>
    </div>
  )
}

export default TitleBar
