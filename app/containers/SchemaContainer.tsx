import { connect } from 'react-redux'
import Schema from '../components/Schema'
import Store from '../models/store'

interface SchemaContainerProps {
  history?: boolean
}

const mapStateToProps = (state: Store, ownProps: SchemaContainerProps) => {
  const { workingDataset, commitDetails } = state

  // get data for the currently selected component
  const schema = ownProps.history ? commitDetails.value.structure.schema : workingDataset.value.structure.schema
  return { schema }
}

const actions = {}

export default connect(mapStateToProps, actions)(Schema)
