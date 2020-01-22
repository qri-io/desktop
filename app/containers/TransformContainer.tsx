import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import Transform, { TransformProps } from '../components/Transform'
import Store from '../models/store'
import { fsiWrite } from '../actions/api'

const mapStateToProps = (state: Store) => {
  const { workingDataset, selections } = state
  const { value } = workingDataset.components.transform

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

const mergeProps = (props: any, actions: any): TransformProps => { //eslint-disable-line
  return { ...props, ...actions }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ write: fsiWrite }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Transform)
