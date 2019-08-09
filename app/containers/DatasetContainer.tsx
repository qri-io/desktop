import { connect } from 'react-redux'
import Dataset, { DatasetProps } from '../components/Dataset'

import { Modal } from '../models/modals'
import Store from '../models/store'

import { toggleDatasetList, setSidebarWidth } from '../actions/ui'
import {
  fetchWorkingDatasetDetails,
  fetchWorkingStatus,
  fetchWorkingHistory
} from '../actions/api'
import {
  setActiveTab,
  setSelectedListItem,
  setWorkingDataset
} from '../actions/selections'
import { setFilter } from '../actions/myDatasets'

const mergeProps = (props: any, actions: any): DatasetProps => {
  return { ...props, ...actions }
}

interface DatasetContainerProps {
  setModal: (modal: Modal) => void
}

const DatasetContainer = connect(
  (state: Store, ownProps: DatasetContainerProps) => {
    const {
      ui,
      selections,
      myDatasets,
      workingDataset,
      mutations
    } = state

    const { setModal } = ownProps
    return Object.assign({
      ui,
      selections,
      myDatasets,
      workingDataset,
      mutations,
      setModal
    }, ownProps)
  },
  {
    toggleDatasetList,
    setActiveTab,
    setSidebarWidth,
    setFilter,
    setSelectedListItem,
    setWorkingDataset,
    fetchWorkingDatasetDetails,
    fetchWorkingStatus,
    fetchWorkingHistory
  },
  mergeProps
)(Dataset)

export default DatasetContainer
