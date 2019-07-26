import { connect } from 'react-redux'
import Metadata from '../components/Metadata'
import Store from '../models/store'

interface MetadataContainerProps {
  history?: boolean
}

const mapStateToProps = (state: Store, ownProps: MetadataContainerProps) => {
  const { workingDataset, commitDetails } = state

  // get data for the currently selected component
  const meta = ownProps.history ? commitDetails.value.meta : workingDataset.value.meta
  return { meta }
}

const actions = {}

export default connect(mapStateToProps, actions)(Metadata)
