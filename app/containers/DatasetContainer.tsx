import { connect } from 'react-redux'
import Dataset, { DatasetProps } from '../components/Dataset'

import { Modal } from '../models/modals'
import Store from '../models/store'

import { toggleDatasetList, setSidebarWidth, signout } from '../actions/ui'
import {
  fetchWorkingDatasetDetails,
  fetchWorkingStatus,
  publishDataset,
  unpublishDataset,
  fetchWorkingDataset,
  fetchBody
} from '../actions/api'

import {
  setActiveTab,
  setSelectedListItem
} from '../actions/selections'

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
      workingDataset,
      mutations,
      myDatasets,
      session
    } = state
    const hasDatasets = myDatasets.value.length !== 0
    const { setModal } = ownProps
    return Object.assign({
      ui,
      selections,
      workingDataset,
      mutations,
      setModal,
      hasDatasets,
      session
    }, ownProps)
  },
  {
    toggleDatasetList,
    setActiveTab,
    setSidebarWidth,
    setSelectedListItem,
    fetchWorkingDatasetDetails,
    fetchWorkingStatus,
    fetchBody,
    fetchWorkingDataset,
    publishDataset,
    unpublishDataset,
    signout
  },
  mergeProps
)(Dataset)

export default DatasetContainer
