import { connect } from 'react-redux'
import { fetchMyDatasets, fetchWorkingDataset } from '../actions/api'
import { Onboard } from '../components/Onboard'

const mapStateToProps = () => {
  return {}
}

const actions = {
  fetchMyDatasets,
  fetchWorkingDataset
}

export default connect(mapStateToProps, actions)(Onboard)
