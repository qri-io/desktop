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
  const { icon = '', label = '', tooltip, onClick = toggleMenu, items } = props

  const twoActionStyle = {
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: 38,
    height: '100%'
  }

  return (
    <div
      className='header-column'
      data-tip={tooltip}
      onClick={onClick}
    >
      {(icon !== '') && (typeof icon === 'string')
        ? <div className='header-column-icon'><FontAwesomeIcon icon={icon} size='lg'/></div>
        : icon
      }
      {(label !== '') &&
        <div className='header-column-text'>
          <div className='label'>{label}</div>
        </div>
      }
      <div className='header-column-arrow' onClick={toggleMenu} style={(onClick === toggleMenu) ? undefined : twoActionStyle }>
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
