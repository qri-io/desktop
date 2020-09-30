import React from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-regular-svg-icons'

export interface HeaderColumnButtonProps {
  id?: string
  tooltip?: string
  label?: string
  icon?: IconDefinition | React.ReactElement
  disabled?: boolean
  onClick?: (event: React.MouseEvent) => void
}

const HeaderColumnButton: React.FunctionComponent<HeaderColumnButtonProps> = (props) => {
  const { id = '', icon, label, tooltip, disabled, onClick } = props

  return (
    <div
      id={id}
      className={classNames('header-column', { disabled })}
      data-tip={tooltip}
      onClick={onClick}
    >
      {icon && React.isValidElement(icon)
        ? (<div className='header-column-icon'>{icon}</div>)
        : <div className='header-column-icon'><FontAwesomeIcon icon={icon} size='lg'/></div>
      }
      {label &&
        <div className='header-column-text'>
          <div className='label'>{label}</div>
        </div>
      }
    </div>
  )
}

export default HeaderColumnButton
