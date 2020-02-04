import { connect } from 'react-redux'
import Workbench, { WorkbenchProps, WorkbenchData } from '../components/workbench/Workbench'
import { fetchWorkbench } from '../actions/workbench'

import Store from '../models/store'

import { setSidebarWidth, setModal, setDetailsBar } from '../actions/ui'
import {
  fetchHistory,

  fetchWorkingDataset,
  fetchWorkingStatus,
  fetchBody,
  fetchCommitBody,
  fetchCommitDataset,

  publishDataset,
  unpublishDataset,
  discardChanges,
  renameDataset,
  fsiWrite
} from '../actions/api'

import {
  setActiveTab,
  setCommit,
  setSelectedListItem
} from '../actions/selections'
import { DetailsType } from '../models/details'

const mergeProps = (props: any, actions: any): WorkbenchProps => {
  return { ...props, ...actions }
}

const WorkbenchContainer = connect(
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

    const data: WorkbenchData = {
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
    setCommit,
    setComponent: setSelectedListItem,
    setDetailsBar,

    fetchHistory,
    fetchWorkingDataset,
    fetchWorkingStatus,
    fetchBody,
    fetchWorkbench,

    fetchCommitDataset,
    fetchCommitBody,

    publishDataset,
    unpublishDataset,
    discardChanges,
    renameDataset,
    fsiWrite
  },
  mergeProps
)(Workbench)

export default WorkbenchContainer
