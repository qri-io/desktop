import { connect } from 'react-redux'
import Dataset, { DatasetProps } from '../components/Dataset'

import { Modal } from '../models/modals'
import Store from '../models/store'

import { toggleDatasetList, setSidebarWidth, signout } from '../actions/ui'
import {
  fetchWorkingDatasetDetails,
  fetchWorkingStatus,
  fetchWorkingHistory,
  publishDataset,
  unpublishDataset
} from '../actions/api'

import {
  setActiveTab,
  setSelectedListItem,
  setWorkingDataset
} from '../actions/selections'

import { setFilter } from '../actions/myDatasets'

import {
  resetBody,
  resetOtherComponents
} from '../actions/workingDataset'

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
      mutations,
      session
    } = state

    const { setModal } = ownProps
    return Object.assign({
      ui,
      selections,
      myDatasets,
      workingDataset,
      mutations,
      setModal,
      session
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
    fetchWorkingHistory,
    resetBody,
    resetOtherComponents,
    publishDataset,
    unpublishDataset,
    signout
  },
  mergeProps
)(Dataset)

export default DatasetContainer
