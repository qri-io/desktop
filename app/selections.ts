import Dataset, { Commit } from "./models/dataset"
import cloneDeep from 'clone-deep'

import Store, { CommitDetails, Status, PageInfo, SelectedComponent } from './models/store'
import { Details } from "./models/details"

export function selectSelectedComponent (state: Store): SelectedComponent {
  return state.selections.component
}

export function selectSelectedCommitComponent (state: Store): SelectedComponent {
  return state.selections.commitComponent
}

export function selectDetails (state: Store): Details {
  return state.ui.detailsBar
}

export function selectFsiPath (state: Store) {
  return state.workingDataset.fsiPath
}

// combines working dataset and mutations dataset to return most
// up-to-date version of the edited dataset
export function selectMutationsDataset (state: Store): Dataset {
  const { mutations } = state
  const mutationsDataset = mutations.dataset.value

  const dataset = selectWorkingDataset(state)
  const d = { ...dataset, ...mutationsDataset }
  return d
}

export function selectHistoryDatasetBodyPageInfo (state: Store): PageInfo {
  return state.commitDetails.components.body.pageInfo
}

export function selectHistoryCommit (state: Store): Commit | undefined {
  return selectHistoryDataset(state).commit
}

// returns a dataset that only contains components
export function selectHistoryDataset (state: Store): Dataset {
  return datasetFromCommitDetails(state.commitDetails)
}

export function selectHistoryDatasetIsLoading (state: Store): boolean {
  return state.commitDetails.isLoading
}

export function selectHistoryDatasetPath (state: Store): string {
  return state.commitDetails.path
}

export function selectHistoryDatasetName (state: Store): string {
  return state.commitDetails.name
}

export function selectHistoryDatasetPeername (state: Store): string {
  return state.commitDetails.peername
}

export function selectHistoryDatasetRef (state: Store): string {
  return `${state.commitDetails.peername}/${state.commitDetails.name}/at${state.commitDetails.path}`
}

export function selectHistoryStats (state: Store): Array<Record<string, any>> {
  return state.commitDetails.stats
}

export function selectHistoryStatus (state: Store): Status {
  return state.commitDetails.status
}

export function selectHistoryIsLoading (state: Store): boolean {
  return state.commitDetails.isLoading
}

export function selectIsCommiting (state: Store): boolean {
  return state.mutations.save.isLoading
}

export function selectIsLinked (state: Store): boolean {
  return !!state.workingDataset.fsiPath && state.workingDataset.fsiPath !== ''
}

export function selectMutationsCommit (state: Store): Commit {
  return state.mutations.save.value
}

export function selectOnHistoryTab (state: Store): boolean {
  return state.selections.activeTab === 'history'
}

export function selectStatusFromMutations (state: Store): Status {
  const { mutations } = state
  const mutationsStatus = mutations.status.value

  // if we've already had mutations, trust the mutations status as the
  // source of truth for status
  if (mutationsStatus) {
    return mutationsStatus
  }

  if (selectIsLinked(state)) {
    // if we are fsi linked trust the working status
    return selectWorkingStatus(state)
  }

  // otherwise, since we have not had any mutations we have to construct a status
  // that expresses we haven't had any modifications
  let status: Status = {}
  const dataset = selectWorkingDataset(state)
  Object.keys(dataset).forEach((componentName: string) => {
    if (dataset[componentName]) {
      status[componentName] = { filepath: componentName, status: 'unmodified' }
    }
  })
  return status
}

export function selectWorkingDatasetBodyPageInfo (state: Store): PageInfo {
  return state.workingDataset.components.body.pageInfo
}

// returns a dataset that only contains components
export function selectWorkingDataset (state: Store): Dataset {
  return datasetFromCommitDetails(state.workingDataset)
}

export function selectWorkingDatasetIsLoading (state: Store): boolean {
  return state.workingDataset.isLoading
}

export function selectWorkingDatasetName (state: Store): string {
  return state.workingDataset.name
}

export function selectWorkingDatasetPeername (state: Store): string {
  return state.workingDataset.peername
}

// returns username/datasetname
export function selectWorkingDatasetRef (state: Store): string {
  return `${state.workingDataset.peername}/${state.workingDataset.name}`
}

export function selectWorkingStatus (state: Store): Status {
  return state.workingDataset.status
}

export function selectWorkingStats (state: Store): Array<Record<string, any>> {
  return state.workingDataset.stats
}

function datasetFromCommitDetails (commitDetails: CommitDetails): Dataset {
  const { components } = commitDetails
  let d: Dataset = {}

  Object.keys(components).forEach((componentName: string) => {
    if (componentName === 'bodyPath') return
    if (components[componentName].value) {
      d[componentName] = cloneDeep(components[componentName].value)
    }
  })
  return d
}
