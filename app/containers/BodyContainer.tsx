import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import Body, { BodyProps } from '../components/Body'
import Store from '../models/store'
import { fetchBody, fetchCommitBody } from '../actions/api'

const mapStateToProps = (state: Store) => {
  const { workingDataset, commitDetails, selections } = state
  const history = selections.activeTab === 'history'
  const dataset = history ? commitDetails : workingDataset
  const { pageInfo, value } = dataset.components.body

  const { peername, name, commit: path } = selections
  const structure = dataset.components.structure.value

  // get data for the currently selected component
  return {
    peername,
    path,
    name,
    pageInfo,
    value,
    structure,
    history,
    workingDataset
  }
}

const mergeProps = (props: any, actions: any): BodyProps => {
  return { ...props, ...actions }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ fetchBody, fetchCommitBody }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Body)
