import { connect } from 'react-redux'
import { setFilter } from '../actions/myDatasets'
import { fetchMyDatasets } from '../actions/api'
import { setWorkingDataset } from '../actions/selections'
import DatasetList from '../components/DatasetList'

const mapStateToProps = (state: any) => {
  const { myDatasets, workingDataset } = state
  return {
    myDatasets,
    workingDataset
  }
}

const actions = {
  setFilter,
  setWorkingDataset,
  fetchMyDatasets
}

export default connect(mapStateToProps, actions)(DatasetList)
