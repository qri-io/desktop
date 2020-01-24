import { connect } from 'react-redux'
import Dataset, { DatasetProps, DatasetData } from '../components/Dataset'

import Store from '../models/store'

import { setSidebarWidth, setModal, setDetailsBar } from '../actions/ui'
import {
  fetchHistory,

  fetchWorkingDatasetAndStatus,
  fetchWorkingDataset,
  fetchWorkingStatus,
  fetchStats,
  fetchBody,

  fetchCommitDataset,
  fetchCommitStatus,
  fetchCommitBody,
  fetchCommitStats,

  publishDataset,
  unpublishDataset,
  discardChanges,
  renameDataset
} from '../actions/api'

import {
  setActiveTab,
  setRoute,
  setCommit,
  setSelectedListItem
} from '../actions/selections'
import { DetailsType } from '../models/details'

const mergeProps = (props: any, actions: any): DatasetProps => {
  return { ...props, ...actions }
}

const DatasetContainer = connect(
  (state: Store) => {
    const {
      ui,
      selections,
      workingDataset,
      commitDetails,
      myDatasets,
      session
    } = state
    const hasDatasets = myDatasets.value.length !== 0
    const showDetailsBar = ui.detailsBar.type !== DetailsType.NoDetails

    const data: DatasetData = {
      workingDataset: workingDataset,
      head: commitDetails,
      // TODO (ramfox): refactor so that history has it's own place in the state tree
      history: workingDataset.history
    }

    return {
      data,
      selections,
      session,
      hasDatasets,
      showDetailsBar,
      sidebarWidth: ui.datasetSidebarWidth,
      details: ui.detailsBar
    }
  },
  {
    setModal,
    setActiveTab,
    setSidebarWidth,
    setRoute,
    setCommit,
    setComponent: setSelectedListItem,
    setDetailsBar,

    fetchHistory,
    fetchWorkingDatasetAndStatus,
    fetchWorkingDataset,
    fetchWorkingStatus,
    fetchStats,
    fetchBody,

    fetchCommitDataset,
    fetchCommitStatus,
    fetchCommitBody,
    fetchCommitStats,

    publishDataset,
    unpublishDataset,
    discardChanges,
    renameDataset
  },
  mergeProps
)(Dataset)

export default DatasetContainer
