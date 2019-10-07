import { connect } from 'react-redux'
import Structure from '../components/Structure'
import Store from '../models/store'

interface StructureContainerProps {
  history?: boolean
}

const mapStateToProps = (state: Store, ownProps: StructureContainerProps) => {
  const { workingDataset, commitDetails } = state

  // get data for the currently selected component
  const schema = ownProps.history ? commitDetails.components.schema.value : workingDataset.components.schema.value
  const structure = ownProps.history ? commitDetails.structure : workingDataset.structure
  return { schema, structure }
}

const actions = {}

export default connect(mapStateToProps, actions)(Structure)
