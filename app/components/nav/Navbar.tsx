import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import SearchBox from '../chrome/SearchBox'
import Breadcrumb from '../chrome/Breadcrumb'
import { Modal, ModalType } from '../../models/modals'

// RouteComponentProps includes `history`, `location`, and `match`
interface NavbarProps extends RouteComponentProps {
  setModal: (modal: Modal) => void
}

const BackArrow: React.FunctionComponent = () => (
  <svg width="20px" height="18px" viewBox="0 0 20 18" version="1.1">
    <g id="chrome/back_button" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round">
      <g id="Group" transform="translate(3.000000, 2.000000)" stroke="#4D4D4D" strokeWidth="4">
        <line x1="14.75" y1="7.04861111" x2="1.75" y2="7.04861111" id="Line-3"></line>
        <polyline id="Path-3" points="6.125 0.243055556 0.125 7.04861111 6.125 13.8541667"></polyline>
      </g>
    </g>
  </svg>
)

const ForwardArrow: React.FunctionComponent = () => (
  <svg width="20px" height="18px" viewBox="0 0 20 18" version="1.1">
    <g id="chrome/forward_button" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round">
      <g id="Group-Copy" transform="translate(9.000000, 9.000000) rotate(-180.000000) translate(-9.000000, -9.000000) translate(1.000000, 2.000000)" stroke="#4D4D4D" strokeWidth="4">
        <line x1="14.75" y1="7.04861111" x2="1.75" y2="7.04861111" id="Line-3"></line>
        <polyline id="Path-3" points="6.125 0.243055556 0.125 7.04861111 6.125 13.8541667"></polyline>
      </g>
    </g>
  </svg>
)

// Navbar is persistent chrome from app-wide navigation
const Navbar: React.FunctionComponent<NavbarProps> = ({ location, setModal }) => {
  const handleOnEnter = (e: React.KeyboardEvent) => {
    setModal({ q: e.target.value, type: ModalType.Search })
  }
  return (
    <div className='page-navbar'>
      <div className='row'>
        <div className='nav-buttons'>
          <a className='back'><BackArrow /></a>
          <a className='forward'><ForwardArrow /></a>
        </div>
        <SearchBox onEnter={handleOnEnter} />
      </div>
      <Breadcrumb value={location.pathname} />
    </div>
  )
}

// the `withRouter` func from 'react-router-dom' gives the Navbar component
// access to history, location, and match (the RouteComponentProps)
export default withRouter(Navbar)
