import { connect } from 'react-redux'
import Workbench, { WorkbenchProps, WorkbenchData } from '../components/workbench/Workbench'
import { fetchWorkbench } from '../actions/workbench'
import { setMutationsDataset, setMutationsStatus, resetMutationsDataset, resetMutationsStatus } from '../actions/mutations'

import { Store, Selections, WorkingDataset, Status } from '../models/store'

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
  renameDataset,
  fsiWrite,
  discardChangesAndFetch
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

// selectStatus sends down the correct status to the Workbench
// if workingDataset has not loaded yet, send an empty status
// if the dataset is linked to the filesystem, send down the workingDataset status
// if not, and there is not mutationsStatus, that means no changes have occured
// create a status based on the dataset components in the workingDataset
function selectStatus (workingDataset: WorkingDataset, mutationsStatus: Status): Status {
  if (!workingDataset || workingDataset.isLoading) return {}

  const { fsiPath } = workingDataset
  if (fsiPath !== '') {
    return workingDataset.status
  }
  if (mutationsStatus) {
    return mutationsStatus
  }
  let status: Status = {}
  Object.keys(workingDataset.components).forEach((componentName: string) => {
    if (workingDataset.components[componentName].value) {
      status[componentName] = { filepath: componentName, status: 'unmodified' }
    }
  })
  return status
}

const WorkbenchContainer = connect(
  (state: Store, props) => {
    const {
      ui,
      selections,
      workingDataset,
      commitDetails,
      myDatasets,
      session,
      mutations
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
      mutationsDataset: mutations.dataset.value || {},
      status: selectStatus(workingDataset, mutations.status.value),

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
      modified: mutations.dirty,
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
    setMutationsStatus,
    setMutationsDataset,
    resetMutationsDataset,
    resetMutationsStatus,

    fetchHistory,
    fetchWorkingDataset,
    fetchWorkingStatus,
    fetchBody,
    fetchWorkbench,

    fetchCommitDataset,
    fetchCommitBody,

    publishDataset,
    unpublishDataset,
    discardChanges: discardChangesAndFetch,
    renameDataset,
    fsiWrite
  },
  mergeProps
)(Workbench)

export default WorkbenchContainer
