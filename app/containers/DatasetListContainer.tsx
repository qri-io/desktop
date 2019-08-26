import { connect } from 'react-redux'
import { setFilter } from '../actions/myDatasets'
import { fetchMyDatasets } from '../actions/api'
import { setWorkingDataset } from '../actions/selections'
import DatasetList from '../components/DatasetList'

import { Modal } from '../models/modals'

interface DatasetListContainerProps {
  setModal: (modal: Modal) => void
}

const mapStateToProps = (state: any, ownProps: DatasetListContainerProps) => {
  const { myDatasets, workingDataset } = state
  const { setModal } = ownProps
  return {
    myDatasets,
    workingDataset,
    setModal
  }
}

const actions = {
  setFilter,
  setWorkingDataset,
  fetchMyDatasets
}

export default connect(mapStateToProps, actions)(DatasetList)
