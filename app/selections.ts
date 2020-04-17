import Dataset, { Commit } from "./models/dataset"
import cloneDeep from 'clone-deep'

import Store, {
  HistoryDataset,
  Status,
  PageInfo,
  SelectedComponent,
  VersionInfo,
  Selections,
  Toast,
  ApiConnection,
  StatusInfo
} from './models/store'
import { Details, DetailsType } from "./models/details"
import { datasetToVersionInfo } from "./actions/mappingFuncs"
import { Modal, ModalType } from "./models/modals"
import { Session } from "./models/session"
import { SidebarTypes } from "./actions/ui"
import { QriRef } from "./models/qriRef"

/**
 *
 * CONNECTION STATE TREE
 *
 */

export function selectApiConnection (state: Store): ApiConnection {
  return state.connection.apiConnection
}

/**
 *
 * HISTORYDATASET STATE TREE
 *
 */

export function selectHistoryDatasetBodyPageInfo (state: Store): PageInfo {
  return state.historyDataset.components.body.pageInfo
}

export function selectHistoryCommit (state: Store): Commit | undefined {
  return selectHistoryDataset(state).commit
}

export function selectHistoryComponentsList (state: Store): SelectedComponent[] {
  const dataset = selectHistoryDataset(state)
  const components: SelectedComponent[] = []
  if (dataset) {
    Object.keys(dataset).forEach((component: SelectedComponent) => {
      if (dataset[component]) components.push(component)
    })
  }
  return components
}

// returns a dataset that only contains components
export function selectHistoryDataset (state: Store): Dataset {
  return datasetFromHistoryDataset(state.historyDataset)
}

export function selectHistoryDatasetIsLoading (state: Store): boolean {
  return state.historyDataset.isLoading
}

export function selectHistoryDatasetPath (state: Store): string {
  return state.historyDataset.path
}

export function selectHistoryDatasetName (state: Store): string {
  return state.historyDataset.name
}

export function selectHistoryDatasetUsername (state: Store): string {
  return state.historyDataset.peername
}

export function selectHistoryDatasetRef (state: Store): string {
  return `${state.historyDataset.peername}/${state.historyDataset.name}/at${state.historyDataset.path}`
}

export function selectHistoryStats (state: Store): Array<Record<string, any>> {
  return state.historyDataset.stats
}

export function selectHistoryStatus (state: Store): Status {
  return state.historyDataset.status
}

export function selectHistoryStatusInfo (state: Store, component: SelectedComponent): StatusInfo {
  const status = selectHistoryStatus(state)
  return status[component]
}

export function selectHistoryIsLoading (state: Store): boolean {
  return state.historyDataset.isLoading
}

function datasetFromHistoryDataset (historyDataset: HistoryDataset): Dataset {
  const { components } = historyDataset
  let d: Dataset = {}

  Object.keys(components).forEach((componentName: string) => {
    if (componentName === 'bodyPath') return
    if (components[componentName].value) {
      d[componentName] = cloneDeep(components[componentName].value)
    }
  })
  return d
}

/**
 *
 * LOG STATE TREE
 *
 */

export function selectLog (state: Store): VersionInfo[] {
  return state.log.value
}

export function selectLogPageInfo (state: Store): PageInfo {
  return state.log.pageInfo
}

/**
 *
 * MYDATASETS STATE TREE
 *
 */

export function selectMyDatasets (state: Store) {
  return state.myDatasets.value
}

export function selectMyDatasetsPageInfo (state: Store) {
  return state.myDatasets.pageInfo
}

export function selectHasDatasets (state: Store) {
  const pageInfo = selectMyDatasetsPageInfo(state)
  const length = selectMyDatasets(state).length
  return pageInfo.isFetching || length > 0
}

export function selectDatasetByName (state: Store, username: string, name: string): VersionInfo | undefined {
  const myDatasets = selectMyDatasets(state)
  return myDatasets.find((vi: VersionInfo) => {
    return vi.username === username && vi.name === name
  })
}

export function selectLatestPath (state: Store, username: string, name: string): string {
  const vi = selectDatasetByName(state, username, name)
  if (!vi) {
    return ''
  }
  return vi.path
}

/**
 *
 * MUTATIONS STATE TREE
 *
 */

// combines working dataset and mutations dataset to return most
// up-to-date version of the edited dataset
export function selectDatasetFromMutations (state: Store): Dataset {
  const mutationsDataset = selectMutationsDataset(state)

  const dataset = selectWorkingDataset(state)
  const d = { ...dataset, ...mutationsDataset }
  return d
}

export function selectMutationsDataset (state: Store): Dataset {
  return state.mutations.dataset.value
}

export function selectMutationsIsDirty (state: Store): boolean {
  return !!state.mutations.dirty
}

export function selectIsCommiting (state: Store): boolean {
  return state.mutations.save.isLoading
}

export function selectMutationsCommit (state: Store): Commit {
  return state.mutations.save.value
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

export function selectStatusInfoFromMutations (state: Store, component: SelectedComponent): StatusInfo {
  return selectStatusFromMutations(state)[component] || generateUnmodifiedStatusInfo(component)
}

/**
 *
 * SELECTIONS STATE TREE
 *
 */

export function selectSelections (state: Store): Selections {
  return state.selections
}

export function selectSelectedComponent (state: Store): SelectedComponent {
  return state.selections.component
}

export function selectSelectedCommitComponent (state: Store): SelectedComponent {
  return state.selections.commitComponent
}

export function selectOnHistoryTab (state: Store): boolean {
  return state.selections.activeTab === 'history'
}

/**
 *
 * SESSION STATE TREE
 *
 */

export function selectSession (state: Store): Session {
  return state.session
}

export function selectSessionUsername (state: Store): string {
  return state.session.peername
}

export function selectInNamespace (state: Store, qriRef: QriRef): boolean {
  return selectSessionUsername(state) === qriRef.username
}

/**
 *
 * UI STATE TREE
 *
 */

export function selectDetails (state: Store): Details {
  return state.ui.detailsBar
}

export function selectImportFileName (state: Store): string {
  return state.ui.importFileName
}

export function selectImportFileSize (state: Store): number {
  return state.ui.importFileSize
}

export function selectModal (state: Store): Modal {
  return state.ui.modal || { type: ModalType.NoModal }
}

export function selectPersistedDatasetDirPath (state: Store): string {
  return state.ui.datasetDirPath || ''
}

export function selectPersistedExportPath (state: Store): string {
  return state.ui.exportPath || ''
}

export function selectShowDetailsBar (state: Store): boolean {
  return state.ui.detailsBar.type !== DetailsType.NoDetails
}

export function selectSidebarWidth (state: Store, view: SidebarTypes): number {
  const { ui } = state
  switch (view) {
    case 'collection':
      return ui.collectionSidebarWidth
    case 'workbench':
      return ui.datasetSidebarWidth
    case 'network':
      return ui.networkSidebarWidth
    default:
      return 0
  }
}

export function selectToast (state: Store): Toast {
  return state.ui.toast
}

/**
 *
 * WORKINGDATASET STATE TREE
 *
 */

export function selectFsiPath (state: Store) {
  return state.workingDataset.fsiPath
}

export function selectIsLinked (state: Store): boolean {
  return !!state.workingDataset.fsiPath && state.workingDataset.fsiPath !== ''
}

export function selectIsPublished (state: Store): boolean {
  return state.workingDataset.published
}

export function selectVersionInfoFromWorkingDataset (state: Store): VersionInfo {
  const { workingDataset } = state
  const vi = datasetToVersionInfo(selectWorkingDataset(state))
  return {
    ...vi,
    username: workingDataset.peername,
    name: workingDataset.name,
    path: workingDataset.path,
    fsiPath: workingDataset.fsiPath
  }
}

export function selectWorkingDatasetBodyPageInfo (state: Store): PageInfo {
  return state.workingDataset.components.body.pageInfo
}

// returns a dataset that only contains components
export function selectWorkingDataset (state: Store): Dataset {
  return datasetFromHistoryDataset(state.workingDataset)
}

export function selectWorkingDatasetIsLoading (state: Store): boolean {
  return state.workingDataset.isLoading
}

export function selectWorkingDatasetIsPublished (state: Store): boolean {
  return state.workingDataset.published
}

export function selectWorkingDatasetName (state: Store): string {
  return state.workingDataset.name
}

export function selectWorkingDatasetUsername (state: Store): string {
  return state.workingDataset.peername
}

// returns username/datasetname
export function selectWorkingDatasetRef (state: Store): string {
  return `${state.workingDataset.peername}/${state.workingDataset.name}`
}

export function selectWorkingStatus (state: Store): Status {
  return state.workingDataset.status
}

export function selectWorkingStatusInfo (state: Store, component: SelectedComponent): StatusInfo {
  const status = selectWorkingStatus(state)
  return status[component] || generateUnmodifiedStatusInfo(component)
}

export function selectWorkingStats (state: Store): Array<Record<string, any>> {
  return state.workingDataset.stats
}

function generateUnmodifiedStatusInfo (componentName: SelectedComponent): StatusInfo {
  return {
    filepath: componentName,
    status: 'unmodified',
    component: componentName
  }
}

/**
 *
 * WORKBENCHROUTER STATE TREE
 *
 */

export function selectRecentHistoryRef (state: Store): QriRef {
  return state.workbenchRoutes.historyRef
}

export function selectRecentEditRef (state: Store): QriRef {
  return state.workbenchRoutes.editRef
}

export function selectRecentWorkbenchLocation (state: Store): string {
  return state.workbenchRoutes.location
}
