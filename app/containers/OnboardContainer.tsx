import { connect } from 'react-redux'
import { fetchMyDatasets } from '../actions/api'
import { Onboard } from '../components/Onboard'

const mapStateToProps = () => {
  return {}
}

const actions = {
  fetchMyDatasets
}

export default connect(mapStateToProps, actions)(Onboard)
