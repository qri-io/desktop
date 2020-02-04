import { connect } from 'react-redux'

import { setModal } from '../actions/ui'
import Navbar from '../components/nav/Navbar'

const NavbarContainer = connect(
  null,
  { setModal }
)(Navbar)

export default NavbarContainer
