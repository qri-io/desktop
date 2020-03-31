import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'

import { fetchWorkbench } from '../actions/workbench'
import { setMutationsDataset, setMutationsStatus, resetMutationsDataset, resetMutationsStatus, discardMutationsChanges } from '../actions/mutations'
import { Store, WorkingDataset, Status, Selections } from '../models/store'
import { setSidebarWidth, setModal } from '../actions/ui'
import {
  fetchBody,
  fetchCommitBody,
  fetchCommitDataset,
  fetchHistory,
  fetchWorkingDataset,
  fetchWorkingDatasetDetails,
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

import Workbench, { WorkbenchProps, WorkbenchData } from '../components/workbench/Workbench'
import { qriRefFromRoute, QriRef } from '../models/qriRef'

const mergeProps = (props: any, actions: any): WorkbenchProps => {
  return { ...props, ...actions }
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

/** TODO (ramfox): in an upcoming refactor we are going to take out the
 * selections reducer and `setWorkingDataset` function in favor of pulling
 * all needed info from the router
 * to bridge this gap, I'm adding this hack that will shape the `location`
 * param to look like what we expect the route to look like
 * `workbench/:peername/:name` for the editor
 * or `workbench/history/:peername/:name:/at:path` for the history
 * */
function hackAddSelectionsDetailsToQriRef (selections: Selections, qriRef: QriRef): QriRef {
  const activeTab = selections.activeTab
  const ref = { ...qriRef }
  if (!qriRef.location || !activeTab || activeTab === '') {
    return ref
  }
  if (!qriRef.username) {
    ref.username = selections.peername
    ref.location += '/' + selections.peername
  }
  if (!qriRef.name) {
    ref.name = selections.name
    ref.location += '/' + selections.peername
  }
  // when we have the router set correctly, we won't rely on `activeTab` (also
  // because we are gearing up for a visual change where we no longer have
  // a 'status' or 'history' tab), instead, if we are given a specific path
  // we should assume we want to show the dataset at that path. Otherwise, we
  // should show the editor
  if (activeTab === 'history' && selections.commit && selections.commit !== '') {
    ref.path = selections.commit
    ref.location += '/at' + selections.commit
  }
  return ref
}

const WorkbenchContainer = connect(
  (state: Store, ownProps: RouteComponentProps<QriRef>) => {
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
      mutationsDataset: mutations.dataset.value || {},
      status: selectStatus(workingDataset, mutations.status.value),

      workingDataset: workingDataset,
      head: commitDetails,
      // TODO (ramfox): refactor so that history has it's own place in the state tree
      history: workingDataset.history
    }

    const qriRef = hackAddSelectionsDetailsToQriRef(selections, qriRefFromRoute(ownProps))
    return {
      qriRef,
      data,
      selections,
      session,
      hasDatasets,
      showDetailsBar,
      modified: mutations.dirty,
      sidebarWidth: ui.datasetSidebarWidth,
      details: ui.detailsBar,
      inNamespace: workingDataset.peername === session.peername
    }
  },
  {
    setModal,
    setActiveTab,
    setSidebarWidth,
    setCommit,
    setComponent: setSelectedListItem,
    setMutationsStatus,
    setMutationsDataset,
    resetMutationsDataset,
    resetMutationsStatus,

    fetchHistory,
    fetchWorkingDataset,
    fetchWorkingDatasetDetails,
    fetchWorkingStatus,
    fetchBody,
    fetchWorkbench,

    fetchCommitDataset,
    fetchCommitBody,

    publishDataset,
    unpublishDataset,
    discardChanges: discardChangesAndFetch,
    discardMutationsChanges,
    renameDataset,
    fsiWrite
  },
  mergeProps
)(Workbench)

export default WorkbenchContainer
