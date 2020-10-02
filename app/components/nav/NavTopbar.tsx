import React from 'react'
import { IconDefinition } from '@fortawesome/free-regular-svg-icons'

import { RouteProps } from '../../models/Store'
import { connectComponentToPropsWithRouter } from '../../utils/connectComponentToProps'
import { setModal } from '../../actions/ui'

import SearchBox from '../chrome/SearchBox'
import BackArrow from '../chrome/BackArrow'
import Breadcrumb from '../chrome/Breadcrumb'
import HeaderColumnButton from '../chrome/HeaderColumnButton'
import HeaderColumnButtonDropdown from '../chrome/HeaderColumnButtonDropdown'
import { Modal, ModalType } from '../../models/modals'

// RouteProps includes `history`, `location`, and `match`
interface NavTopbarProps extends RouteProps {
  title: string
  buttons: NavbarButtonProps[]
  setModal: (modal: Modal) => void
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
export const NavTopbar: React.FunctionComponent<NavTopbarProps> = ({ title, location, match, setModal, history, buttons = [] }) => {
  const handleOnEnter = (e: React.KeyboardEvent) => {
    setModal({ q: e.target.value, type: ModalType.Search })
  }
  // determines if route is at base route (e.g. /collection or /network)
  const isBaseRoute = Object.keys(match.params).length === 0

  const onBackClick = () => {
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
        <SearchBox onEnter={handleOnEnter} id='search-box' />
      </div>
      <div className='page-details'>
        <div className='title-and-breadcrumb'>
          <Breadcrumb id='navbar-breadcrumb' value={location.pathname} />
          {title && <h3 className='title'>{title}</h3>}
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

export default connectComponentToPropsWithRouter(
  NavTopbar,
  {},
  { setModal }
)
