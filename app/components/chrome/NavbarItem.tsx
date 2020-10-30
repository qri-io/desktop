import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-regular-svg-icons'

export interface NavbarItemProps {
  id?: string
  tooltip?: string
  icon?: IconDefinition | React.ReactElement
  disabled?: boolean
  onClick?: (event: React.MouseEvent) => void
  link?: string
  externalLink?: boolean
  items?: React.ReactElement[]
  active?: boolean
}

const NavbarItem: React.FunctionComponent<NavbarItemProps> = (props) => {
  const { id = '', icon, tooltip, disabled, onClick, link, externalLink, active } = props

  const item = (
    <div
      id={id}
      className={classNames('navbar-item', {
        disabled,
        active
      })}
      data-tip={tooltip}
      onClick={onClick}
    >
      {icon && React.isValidElement(icon)
        ? (<div className='navbar-icon'>{icon}</div>)
        : <div className='navbar-icon'><FontAwesomeIcon icon={icon} size='lg'/></div>
      }
    </div>
  )

  return link ? (
    <Link to={link} target={externalLink && '_blank'}>
      {item}
    </Link>
  ) : item
}

export default NavbarItem
