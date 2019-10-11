import { connect } from 'react-redux'
import Structure, { StructureProps } from '../components/Structure'
import Store from '../models/store'
import { fsiWriteAndFetch } from '../actions/api'

const mapStateToProps = (state: Store, ownProps: StructureProps) => {
  const { workingDataset, commitDetails, selections } = state

  // get data for the currently selected component
  const structure = ownProps.history ? commitDetails.components.structure.value : workingDataset.components.structure.value
  const schema = 'schema' in structure ? structure.schema : {}
  return { schema, structure, peername: selections.peername, name: selections.name, history: selections.activeTab === 'history' }
}

const actions = {
  write: fsiWriteAndFetch
}

const mergeProps = (props: any, actions: any): StructureProps => {
  return { ...props, ...actions }
}

export default connect(mapStateToProps, actions, mergeProps)(Structure)
