// globals __BUILD__
import * as React from 'react'
import { Action } from 'redux'
import { withRouter } from 'react-router-dom'
import { shell } from 'electron'
import {
  faExternalLinkAlt,
  faFileAlt,
  faCopy,
  faComment,
  faGlobeEurope
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-regular-svg-icons'

import ExternalLink from './ExternalLink'
import { DISCORD_URL, QRI_CLOUD_URL } from '../constants'
import NavbarItem from './chrome/NavbarItem'

const defaultPhoto = require('../assets/default_46x46.png') //eslint-disable-line

interface MenuItemProps {
  id: string
  label: string
  icon?: IconDefinition
  link?: string
  onClick?: () => void
}

const MenuItem: React.FunctionComponent<MenuItemProps> = (props: MenuItemProps) => {
  const { label, icon, link, onClick, id } = props
  const menuItem = (
    <div id={id} className='user-menu-item' onClick={onClick}>
      <div className='label'>{label}</div>
      {
        icon &&
        <div className='icon'><FontAwesomeIcon icon={faExternalLinkAlt} size='xs' /></div>
      }
    </div>
  )

  return link ? (
    <ExternalLink id={id} href={link}>
      {menuItem}
    </ExternalLink>
  )
    : menuItem
}

interface NavbarProps {
  userphoto?: string | undefined
  username?: string
  name?: string
  signout: () => Action

  location: {
    pathname: string
  }
}

const Navbar: React.FunctionComponent<NavbarProps> = (props: NavbarProps) => {
  const { userphoto = defaultPhoto, location, signout, username = '', name = '' } = props

  const { pathname } = location

  const [showUserMenu, setShowUserMenu] = React.useState(false)
  const toggleUserMenu = (event: React.MouseEvent) => {
    setShowUserMenu(!showUserMenu)
    event.stopPropagation()
  }

  const dropdown: any = React.useRef(null)

  const handleClick = (e: MouseEvent) => {
    // check whether an app-wide click is in this component
    if (dropdown.current !== null && dropdown.current.contains(e.target)) {
    // if it's in this component, but is a dropdown item, close the dropdown
      const element = e.target as HTMLElement
      if (element.className === 'user-menu') setShowUserMenu(false)

      // inside click
      return
    }
    // close the dropdown if the click happened outside of this component
    setShowUserMenu(false)
  }

  React.useEffect(() => {
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  })

  let navItems = [
    {
      icon: faCopy,
      id: 'collection',
      link: '/collection',
      tooltip: 'Collection - Local Datasets'
    },
    {
      icon: faFileAlt,
      id: 'workbench',
      link: '/workbench',
      tooltip: 'Workbench - Build & Edit Datasets'
    }
  ]

  if (__BUILD__.ENABLE_NETWORK_SECTION) {
    navItems = [{
      icon: faGlobeEurope,
      id: 'network',
      link: '/network',
      tooltip: 'Network - Browse other datasets'
    }].concat(navItems)
  }

  return (

    <div className='navbar-container' ref={dropdown}>
      {showUserMenu && (
        <div className='user-menu'>
          <div className='user-menu-section'>
            <div className='user-menu-info'>
              <div className='userphoto' style={{
                backgroundImage: `url(${userphoto})`
              }}/>
              <div className='text'>
                <div className='username'>{username}</div>
                <div className='name'>{name}</div>
              </div>
            </div>
            <MenuItem id='settings' label='User Settings' icon={faExternalLinkAlt} link={`${QRI_CLOUD_URL}/settings`} />
            <MenuItem id='profile' label='Public Profile'icon={faExternalLinkAlt} link={`${QRI_CLOUD_URL}/${username}`} />
            <MenuItem id='signout' label='Sign out' onClick={signout} />
          </div>
        </div>)
      }
      <div className='navbar'>
        <div className='navbar-top'>
          {
            navItems.map(({ icon, link, tooltip, id }, i) => (
              <NavbarItem
                id={id}
                key={i}
                icon={icon}
                link={link}
                tooltip={tooltip}
                active={pathname.startsWith(link)}
              />
            ))
          }
        </div>
        <div className='navbar-bottom'>
          <NavbarItem
            icon={faComment}
            tooltip={'Need help? Ask questions<br/> in our Discord channel'}
            onClick={() => { shell.openExternal(DISCORD_URL) }}
          />
          <NavbarItem
            id='nav-options'
            icon={
              <div className='userphoto' style={{
                backgroundImage: `url(${userphoto})`
              }}/>
            }
            onClick={toggleUserMenu}
          />
        </div>
      </div>
    </div>
  )
}

export default withRouter(Navbar)
