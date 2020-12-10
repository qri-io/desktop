import React from 'react'
import { IconDefinition } from '@fortawesome/free-regular-svg-icons'

import { RouteProps } from '../../models/Store'
import { connectComponentToPropsWithRouter } from '../../utils/connectComponentToProps'

import BackArrow from '../chrome/BackArrow'
import HeaderColumnButton from '../chrome/HeaderColumnButton'
import Transfers from '../Transfers'
import Hamburger from '../chrome/Hamburger'

// RouteProps includes `history`, `location`, and `match`
interface NavTopbarProps extends RouteProps {
  title: string
  subTitle?: string

  /**
   * backButtonUrl - when it exists, will override default back button behavior
   * to instead `history.push` to the backButtonUrl location
   */
  backButtonUrl?: string
  buttons: NavbarButtonProps[]
}

export interface NavbarButtonProps {
  type: 'button' | 'button-dropdown' | 'component'
  component?: React.ReactElement

  id?: string
  label?: string
  onClick?: (event: React.MouseEvent) => void

  tooltip?: string
  icon?: IconDefinition | React.ReactElement
  disabled?: boolean
  dropdownItems?: React.ReactElement[]
}

// Navbar is persistent chrome from app-wide navigation
export const NavTopbarComponent: React.FunctionComponent<NavTopbarProps> = (props) => {
  const {
    title,
    subTitle,
    buttons = [],
    location,
    match,
    history,
    backButtonUrl
  } = props
  // determines if route is at base route (e.g. /collection or /network)
  const isBaseRoute = Object.keys(match.params).length === 0

  const onBackClick = () => {
    if (backButtonUrl) {
      return history.push(backButtonUrl)
    }
    // if not on base route, clicking back takes you to base route
    // (e.g. /collection/edit/username/dataset/body => /collection)
    const baseRoute = location.pathname.split("/")[1]
    return history.push(`/${baseRoute}`)
  }

  return (
    <div className='page-navbar'>
      <div className='row'>
        <div className='nav-buttons'>
          {!isBaseRoute && <a className='back' onClick={onBackClick}><BackArrow /></a>}
        </div>
        {!__BUILD__.REMOTE && <div className='transfers'>
          <Transfers />
        </div>}
      </div>
      <div className='page-details'>
        <div className='title-container'>
          <h5 className='subtitle'>{subTitle}</h5>
          <h3 className='title'>{title}</h3>
        </div>
        <div className='buttons'>
          {buttons.map((props, i) => {
            switch (props.type) {
              case 'button-dropdown':
                return <Hamburger id='navbar-hamburger' key={i} {...props} items={props.dropdownItems} />
              case 'component':
                return props.component
              default:
                return <HeaderColumnButton key={i} {...props} />
            }
          })}
        </div>
      </div>
    </div>
  )
}

// only props we need come from the router
export default connectComponentToPropsWithRouter(NavTopbarComponent, {}, {})
