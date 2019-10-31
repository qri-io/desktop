import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import Readme, { ReadmeProps } from '../components/Readme'
import Store from '../models/store'
import { fsiWriteAndFetch, fetchReadmePreview } from '../actions/api'

const mapStateToProps = (state: Store) => {
  const { workingDataset, commitDetails, selections } = state
  const history = selections.activeTab === 'history'
  const dataset = history ? commitDetails : workingDataset
  const { value } = dataset.components.readme

  const { peername, name, commit } = selections

  // get data for the currently selected component
  return {
    peername,
    path: commit,
    name,
    value,
    history,
    workingDataset
  }
}

const mergeProps = (props: any, actions: any): ReadmeProps => {
  return { ...props, ...actions }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ write: fsiWriteAndFetch, fetchPreview: fetchReadmePreview }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Readme)
