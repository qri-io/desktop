import { connect } from 'react-redux'
import Dataset from '../components/Dataset'
import {
  toggleDatasetList,
  handleResize,
  handleReset
} from '../actions/app'
import { IState } from '../reducers'

const DatasetContainer = connect(
  (state: IState, ownProps) => {
    const { showDatasetList, sidebarWidth } = state.app.dataset
    return Object.assign({
      showDatasetList,
      sidebarWidth
    }, ownProps)
  },
  {
    toggleDatasetList,
    handleResize,
    handleReset
  }
)(Dataset)

export default DatasetContainer
