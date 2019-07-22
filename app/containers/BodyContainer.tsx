import { connect } from 'react-redux'
import Body from '../components/Body'
import Store from '../models/store'
import { fetchBody } from '../actions/api'

const mapStateToProps = (state: Store) => {
  const { workingDataset } = state

  // get data for the currently selected component
  const body = workingDataset.value.body
  return { body }
}

const actions = {
  fetchBody
}

export default connect(mapStateToProps, actions)(Body)
