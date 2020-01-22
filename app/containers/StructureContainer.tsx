import { connect } from 'react-redux'
import Structure, { StructureProps } from '../components/Structure'
import Store from '../models/store'
import { fsiWrite } from '../actions/api'
import path from 'path'

const mapStateToProps = (state: Store) => {
  const { workingDataset, commitDetails, selections } = state

  // get if history
  const history = selections.activeTab === 'history'
  // if history, get fsiBodyFormat
  var fsiBodyFormat = ''
  if (!history) {
    fsiBodyFormat = state.workingDataset.status && state.workingDataset.status.body && state.workingDataset.status.body.filepath
      ? path.extname(state.workingDataset.status.body.filepath).slice(1)
      : ''
  }
  // get data for the currently selected component
  const structure = history ? commitDetails.components.structure.value : workingDataset.components.structure.value
  const schema = 'schema' in structure ? structure.schema : {}
  return { schema, structure, peername: selections.peername, name: selections.name, history, fsiBodyFormat }
}

const actions = {
  write: fsiWrite
}

const mergeProps = (props: any, actions: any): StructureProps => {
  return { ...props, ...actions }
}

export default connect(mapStateToProps, actions, mergeProps)(Structure)
