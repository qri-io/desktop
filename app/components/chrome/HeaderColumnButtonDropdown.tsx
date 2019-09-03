import * as React from 'react'
import { HeaderColumnButtonProps } from './HeaderColumnButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface HeaderColumnButtonDropdownProps extends HeaderColumnButtonProps {
  items: React.ReactElement[]
}

const HeaderColumnButtonDropdown: React.FunctionComponent<HeaderColumnButtonDropdownProps> = (props) => {
  const [showMenu, setShowMenu] = React.useState(false)
  const toggleMenu = (event: React.MouseEvent) => {
    setShowMenu(!showMenu)
    event.stopPropagation()
  }
  const { icon, label = '', tooltip, onClick = toggleMenu, items } = props

  return (
    <div
      className='header-column header-column-dropdown'
      data-tip={tooltip}
      onClick={onClick}
    >
      {React.isValidElement(icon)
        ? icon
        : <div className='header-column-icon'><FontAwesomeIcon icon={icon} size='lg'/></div>
      }
      {(label !== '') &&
        <div className='header-column-text'>
          <div className='label'>{label}</div>
        </div>
      }
      <div className='header-column-arrow' onClick={toggleMenu}>
        {showMenu
          ? <div className="arrow collapse">&nbsp;</div>
          : <div className="arrow expand">&nbsp;</div>
        }
      </div>
      {showMenu && (
        <ul className='dropdown'>
          {items.map((elem, i) => (
            <li key={i}>{elem}</li>
          ))}
        </ul>)
      }
    </div>
  )
}

export default HeaderColumnButtonDropdown
