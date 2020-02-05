import { connect } from 'react-redux'
import Workbench, { WorkbenchProps, WorkbenchData } from '../components/workbench/Workbench'
import { fetchWorkbench } from '../actions/workbench'

import { Store, Selections } from '../models/store'

import { setSidebarWidth, setModal, setDetailsBar } from '../actions/ui'
import {
  fetchBody,
  fetchCommitBody,
  fetchCommitDataset,
  fetchHistory,
  fetchWorkingDataset,
  fetchWorkingStatus,

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

function locationFromSelection (s: Selections): string {
  let sel = `/workbench/${s.activeTab}/${s.peername}/${s.name}`
  if (s.commit !== '') {
    sel += `/${s.commit}`
  }
  return sel
}

const WorkbenchContainer = connect(
  (state: Store, props) => {
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
      // TODO (b5) - here we're intentionally constructing location from selection state,
      // as it's more accurate than values derived from the route. Refactor away
      // from selection toward using route match params
      location: locationFromSelection(selections),
      tab: props.tab || 'status',
      peername: props.peername || selections.peername,
      name: props.name || selections.name,
      path: props.path || selections.commit,

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
