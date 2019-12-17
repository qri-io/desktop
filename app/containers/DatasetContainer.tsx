import { connect } from 'react-redux'
import Dataset, { DatasetProps } from '../components/Dataset'

import { Modal } from '../models/modals'
import Store from '../models/store'

import { setSidebarWidth } from '../actions/ui'
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
  setSelectedListItem,
  setRoute
} from '../actions/selections'
import { DetailsType } from '../models/details'

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
    const showDetailsBar = ui.detailsBar.type !== DetailsType.NoDetails

    return Object.assign({
      ui,
      selections,
      workingDataset,
      mutations,
      setModal,
      hasDatasets,
      session,
      showDetailsBar
    }, ownProps)
  },
  {
    setActiveTab,
    setSidebarWidth,
    setSelectedListItem,
    fetchWorkingDatasetDetails,
    fetchWorkingStatus,
    fetchBody,
    fetchWorkingDataset,
    publishDataset,
    setRoute,
    unpublishDataset
  },
  mergeProps
)(Dataset)

export default DatasetContainer
