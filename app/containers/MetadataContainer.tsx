import { connect } from 'react-redux'
import Metadata from '../components/Metadata'
import Store from '../models/store'

const mapStateToProps = (state: Store) => {
  const { workingDataset, selections } = state

  const { component: selectedComponent } = selections

  // get data for the currently selected component
  const meta = workingDataset.value[selectedComponent]
  return { meta }
}

const actions = {}

export default connect(mapStateToProps, actions)(Metadata)
