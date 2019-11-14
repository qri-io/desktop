import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import Body, { BodyProps } from '../components/Body'
import Store from '../models/store'
import { setDetailsBar } from '../actions/ui'
import { fetchBody, fetchCommitBody } from '../actions/api'
import path from 'path'

const mapStateToProps = (state: Store) => {
  const { workingDataset, commitDetails, selections, ui } = state
  const history = selections.activeTab === 'history'
  const dataset = history ? commitDetails : workingDataset
  const { pageInfo, value } = dataset.components.body

  const details = ui.detailsBar

  var format = ''
  if (history) {
    format = workingDataset.components.structure.value.format
  } else {
    format = state.workingDataset.status && state.workingDataset.status.body && state.workingDataset.status.body.filepath
      ? path.extname(state.workingDataset.status.body.filepath).slice(1)
      : ''
  }
  const { peername, name, commit } = selections
  const structure = dataset.components.structure.value
  // get data for the currently selected component
  return {
    peername,
    path: commit,
    name,
    pageInfo,
    value,
    structure,
    format,
    history,
    details,
    workingDataset
  }
}

const mergeProps = (props: any, actions: any): BodyProps => {
  return { ...props, ...actions }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ fetchBody, fetchCommitBody, setDetailsBar }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Body)
