import { connect } from 'react-redux'
import Schema from '../components/Schema'
import Store from '../models/store'

const mapStateToProps = (state: Store) => {
  const { workingDataset } = state

  // get data for the currently selected component
  const schema = workingDataset.value.structure.schema
  return { schema }
}

const actions = {}

export default connect(mapStateToProps, actions)(Schema)
