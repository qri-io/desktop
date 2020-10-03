import React from 'react'
import { IconDefinition } from '@fortawesome/free-regular-svg-icons'
import classNames from 'classnames'

import { RouteProps } from '../../models/Store'
import { connectComponentToPropsWithRouter } from '../../utils/connectComponentToProps'

import BackArrow from '../chrome/BackArrow'
import HeaderColumnButton from '../chrome/HeaderColumnButton'
import HeaderColumnButtonDropdown from '../chrome/HeaderColumnButtonDropdown'
import Transfers from '../Transfers'

// RouteProps includes `history`, `location`, and `match`
interface NavTopbarProps extends RouteProps {
  title: string | React.ReactElement
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
export const NavTopbarComponent: React.FunctionComponent<NavTopbarProps> = ({ title, buttons = [], location, match, history }) => {
  // determines if route is at base route (e.g. /collection or /network)
  const isBaseRoute = Object.keys(match.params).length === 0

  const onBackClick = () => {
    // if not on base route, clicking back takes you to base route
    // (e.g. /collection/edit/username/dataset/body => /collection)
    const baseRoute = location.pathname.split("/")[1]
    return history.push(`/${baseRoute}`)
  }

  const titleIsString = typeof title === 'string'

  return (
    <div className='page-navbar'>
      <div className='row'>
        <div className='nav-buttons'>
          {!isBaseRoute && <a className='back' onClick={onBackClick}><BackArrow /></a>}
        </div>
        <div className='transfers'>
          <Transfers />
        </div>
      </div>
      <div className='page-details'>
        <div className='title-and-breadcrumb'>
          {title && <h3 className={classNames('title', { 'single-line': titleIsString })}>{title}</h3>}
        </div>
        <div className='buttons'>
          {buttons.map((props) => {
            switch (props.type) {
              case 'button-dropdown':
                return <HeaderColumnButtonDropdown key={props.id} {...props} items={props.dropdownItems} />
              case 'component':
                return props.component
              default:
                return <HeaderColumnButton key={props.id} {...props} />
            }
          })}
        </div>
      </div>
    </div>
  )
}

// only props we need come from the router
export default connectComponentToPropsWithRouter(NavTopbarComponent, {}, {})
