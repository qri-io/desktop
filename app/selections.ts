import Dataset, { Commit } from "./models/dataset"
import cloneDeep from 'clone-deep'

import Store, {
  DatasetStore,
  Status,
  PageInfo,
  SelectedComponent,
  VersionInfo,
  Selections,
  Toast,
  ApiConnection,
  StatusInfo,
  BootupComponentType
} from './models/store'
import { Details, DetailsType } from "./models/details"
import { datasetToVersionInfo } from "./actions/mappingFuncs"
import { Modal, ModalType } from "./models/modals"
import { Session } from "./models/session"
import { SidebarTypes } from "./actions/ui"
import { QriRef } from "./models/qriRef"
import { RouterState } from "connected-react-router"
import { IChangeReportRefs } from "./models/changeReport"
import { isEditPath } from "./paths"

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
 * DATASET STATE TREE
 *
 */

export function selectDatasetBodyPageInfo (state: Store): PageInfo {
  return state.dataset.components.body.pageInfo
}

export function selectDatasetCommit (state: Store): Commit | undefined {
  return selectDataset(state).commit
}

export function selectDatasetComponentsList (state: Store): SelectedComponent[] {
  const dataset = selectDataset(state)
  const components: SelectedComponent[] = []
  if (dataset) {
    Object.keys(dataset).forEach((component: SelectedComponent) => {
      if (dataset[component]) components.push(component)
    })
  }
  return components
}

// returns a dataset that only contains components
export function selectDataset (state: Store): Dataset {
  return datasetFromDatasetStore(state.dataset)
}

export function selectDatasetPath (state: Store): string {
  return state.dataset.path
}

export function selectDatasetName (state: Store): string {
  return state.dataset.name
}

export function selectDatasetUsername (state: Store): string {
  return state.dataset.peername
}

export function selectDatasetRef (state: Store): QriRef {
  return {
    username: state.dataset.peername,
    name: state.dataset.name,
    path: state.dataset.path
  }
}

export function selectDatasetStats (state: Store): Array<Record<string, any>> {
  return state.dataset.stats
}

export function selectDatasetStatus (state: Store): Status {
  return state.dataset.status
}

export function selectDatasetStatusInfo (state: Store, component: SelectedComponent): StatusInfo {
  const status = selectDatasetStatus(state)
  return status[component]
}

export function selectDatasetIsLoading (state: Store): boolean {
  return state.dataset.isLoading
}

function datasetFromDatasetStore (historyDataset: DatasetStore): Dataset {
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

export function selectLogLatestVersion (state: Store): VersionInfo | undefined {
  if (selectHasHistory(state)) {
    return selectLog(state)[0]
  }
}

export function selectLog (state: Store): VersionInfo[] {
  return state.log.value
}

export function selectLogPageInfo (state: Store): PageInfo {
  return state.log.pageInfo
}

export function selectHasHistory (state: Store): boolean {
  return !!state.log.value.length
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
  return !!state.mutations.dirty && !state.workingDataset.fsiPath
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

export function selectBootupComponent (state: Store): BootupComponentType {
  return state.ui.bootupComponent
}

export function selectBulkActionExecuting (state: Store): boolean {
  return state.ui.bulkActionExecuting
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

/** TODO (ramfox): right now, we only show the published status of the head
 * dataset. The dataset is considered published if HEAD is published, and
 * unpublished if HEAD is not published
*/
export function selectIsPublished (state: Store): boolean {
  return !!state.log.value && state.log.value.length > 0 && state.log.value[0].published
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
  return datasetFromDatasetStore(state.workingDataset)
}

export function selectWorkingDatasetIsLoading (state: Store): boolean {
  return state.workingDataset.isLoading
}

/** TODO (ramfox): right now, we only show the published status of the head
 * dataset. The dataset is considered published if HEAD is published, and
 * unpublished if HEAD is not published
*/
export function selectWorkingDatasetIsPublished (state: Store): boolean {
  return !!state.log.value && state.log.value.length > 0 && state.log.value[0].published
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

// TODO (b5) - we've refactored away from this, should depricate
export function selectRecentWorkbenchLocation (state: Store): string {
  return state.workbenchRoutes.location
}

/**
 *
 * ROUTER STATE TREE
 *
 */
export function selectRouter (state: Store): RouterState {
  return state.router
}

/**
 * CHANGE REPORT SELECTORS
 */

export function selectChangeReportParams (state: any): IChangeReportRefs | undefined {
  var username = selectDatasetUsername(state)
  var name = selectDatasetName(state)

  // if there is no username or name, then no dataset is currently selected
  if (!(username && name)) {
    return undefined
  }

  // don't show if we are looking at the working dataset
  const router = selectRouter(state)
  if (isEditPath(router.location.pathname)) {
    return undefined
  }
  // TODO (ramfox): once we iron out the details, we can potentially show
  // changes based on uncommited edits made in fsi & HEAD
  // const fsiPath = selectFsiPath(state)
  // if (isEditPath(router.location.pathname) && fsiPath === '') {
  //   return undefined
  // }

  var currentPath = selectDatasetPath(state)
  var log = selectLog(state)

  // if there is no history or if the path is the oldest path in the list
  // then there is no previous version to compare it to
  if (log.length === 0 || currentPath === log[log.length - 1].path) {
    return undefined
  }

  const rightIndex = log.findIndex(vi => vi.path === currentPath)
  // since we have already guarded against the given path being the last index
  // we can add 1 to the rightIndex without worrying about overflow

  // if we don't have the previous version, we can't show the changes
  const left = log[rightIndex + 1]
  if (left.foreign) {
    return undefined
  }

  return { right: log[rightIndex], left }
}
