import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import Readme, { ReadmeProps } from '../components/Readme'
import Store from '../models/store'
import { fsiWriteAndFetch, fetchReadmePreview } from '../actions/api'

const mapStateToProps = (state: Store) => {
  const { workingDataset, selections } = state
  const { value } = workingDataset.components.readme

  const { peername, name } = selections

  // get data for the currently selected component
  return {
    peername,
    name,
    value,
    history,
    workingDataset
  }
}

const mergeProps = (props: any, actions: any): ReadmeProps => { //eslint-disable-line
  return { ...props, ...actions }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ write: fsiWriteAndFetch, fetchPreview: fetchReadmePreview }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Readme)
