import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-regular-svg-icons'

export interface HeaderColumnButtonProps {
  tooltip?: string
  label?: string
  icon: IconDefinition | React.ReactElement
  onClick?: (event: React.MouseEvent) => void
}

const HeaderColumnButton: React.FunctionComponent<HeaderColumnButtonProps> = (props) => {
  const { icon, label, tooltip, onClick } = props

  return (
    <div
      className='header-column'
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
