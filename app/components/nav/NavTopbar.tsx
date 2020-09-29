import React from 'react'
import { IconDefinition } from '@fortawesome/free-regular-svg-icons'

import { RouteProps } from '../../models/Store'
import { connectComponentToPropsWithRouter } from '../../utils/connectComponentToProps'
import { setModal } from '../../actions/ui'

import SearchBox from '../chrome/SearchBox'
import BackArrow from '../chrome/BackArrow'
import ForwardArrow from '../chrome/ForwardArrow'
import Breadcrumb from '../chrome/Breadcrumb'
import HeaderColumnButton from '../chrome/HeaderColumnButton'
import HeaderColumnButtonDropdown from '../chrome/HeaderColumnButtonDropdown'
import { Modal, ModalType } from '../../models/modals'

// RouteProps includes `history`, `location`, and `match`
interface NavbarProps extends RouteProps {
  title: string
  buttons: NavbarButtonProps[]
  setModal: (modal: Modal) => void
}

export interface NavbarButtonProps {
  type: 'button' | 'button-dropdown'
  id: string
  label: string
  onClick: (event: React.MouseEvent) => void

  tooltip?: string
  icon?: IconDefinition | React.ReactElement
  disabled?: boolean
  dropdownItems?: React.ReactElement[]
}

// Navbar is persistent chrome from app-wide navigation
export const NavbarComponent: React.FunctionComponent<NavbarProps> = ({ title, location, setModal, history, buttons = [] }) => {
  const handleOnEnter = (e: React.KeyboardEvent) => {
    setModal({ q: e.target.value, type: ModalType.Search })
  }
  return (
    <div className='page-navbar'>
      <div className='row'>
        <div className='nav-buttons'>
          <a className='back' onClick={() => history.goBack()}><BackArrow /></a>
          <a className='forward' onClick={() => history.goForward()}><ForwardArrow /></a>
        </div>
        <SearchBox onEnter={handleOnEnter} id='search-box' />
      </div>
      <div>
        <Breadcrumb id='navbar-breadcrumb' value={location.pathname} />
        {title && <h3 className='title'>{title}</h3>}
      </div>
      <div>
        {buttons.map((props) => {
          switch (props.type) {
            case 'button-dropdown':
              return <HeaderColumnButtonDropdown key={props.id} {...props} items={props.dropdownItems} />
            default:
              return <HeaderColumnButton key={props.id} {...props} />
          }
        })}
      </div>
    </div>
  )
}

export default connectComponentToPropsWithRouter(
  NavTopbarComponent,
  {},
  { setModal }
)
