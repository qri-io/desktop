import * as React from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-regular-svg-icons'

export interface HeaderColumnButtonProps {
  tooltip?: string
  label?: string
  icon: IconDefinition | React.ReactElement
  disabled?: boolean
  onClick?: (event: React.MouseEvent) => void
}

const HeaderColumnButton: React.FunctionComponent<HeaderColumnButtonProps> = (props) => {
  const { icon, label, tooltip, disabled, onClick } = props

  return (
    <div
      className={classNames('header-column', { disabled })}
      data-tip={tooltip}
      onClick={onClick}
    >
      {React.isValidElement(icon)
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
