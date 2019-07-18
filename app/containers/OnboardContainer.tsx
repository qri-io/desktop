import { connect } from 'react-redux'
import { acceptTOS, setPeername } from '../actions/ui'
import Onboard from '../components/Onboard'
import Store from '../models/store'

const mapStateToProps = (state: Store) => {
  const { ui } = state
  return { ui }
}

const actions = {
  acceptTOS,
  setPeername
}

export default connect(mapStateToProps, actions)(Onboard)
