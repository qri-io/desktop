import { RouterState } from 'react-router-redux'
import Dataset, { Commit } from './dataset'
import { Session } from './session'

enum ApiConnection {
  neverConnected = 0,
  connected = 1,
  connectionFailure = -1
}

enum ModalType {
  CreateDataset,
  AddDataset,
}

type Modal =
| {
  type: ModalType.CreateDataset
  dirPath?: string
  bodyPath?: string
}
| {
  type: ModalType.AddDataset
  initialURL?: string | null
}

export interface Mutation {
  value: {
    [key: string]: any
  }
  isLoading: boolean
  error: string | null
}

export interface Mutations {
  [key: string]: Mutation
}

export interface UI {
  apiConnection: ApiConnection
  showDatasetList: boolean
  errorMessage: string | null
  message: string | null
  hasAcceptedTOS: boolean
  hasSetPeername: boolean
  modal?: Modal
  showDiff: boolean
  datasetSidebarWidth: number
  commitSidebarWidth: number
}

// currently selected dataset, tab, dataset component, commit, etc
export interface Selections {
  peername: string | null
  name: string | null
  activeTab: string
  component: string
  commit: string
  commitComponent: string
}

// info about the current value of a list being paginated
export interface PageInfo {
  isFetching: boolean
  pageCount: number
  fetchedAll: boolean
  error?: string
}

// dataset summary info to show in dataset list
export interface DatasetSummary {
  title: string
  peername: string
  name: string
  hash: string
  path: string
  isLinked: boolean
  changed: boolean
}

// list of local datasets
export interface MyDatasets {
  pageInfo: PageInfo
  value: DatasetSummary[]
  filter: string // filter string from ui
}

export type ComponentState = 'modified' | 'unmodified' | 'removed' | 'added'

// info about a dataset component as compared the same component in previous commit
export interface ComponentStatus {
  filepath: string
  status: ComponentState
  errors?: object[]
  warnings?: object[]
  component?: string
}

export interface Pages {
  [key: string]: PageInfo
}

export interface DatasetStatus {
  [key: string]: ComponentStatus
}

export interface CommitDetails {
  path: string
  prevPath: string
  peername: string
  name: string
  pages: Pages
  diff: object
  value: Dataset
  status: DatasetStatus
}

export interface WorkingDataset extends CommitDetails {
  linkpath: string | null
  history: {
    pageInfo: PageInfo
    value: Commit[]
  }
  loading: false
  bodyLoading: false
}

export default interface Store {
  session: Session
  ui: UI
  selections: Selections
  myDatasets: MyDatasets
  workingDataset: WorkingDataset
  commitDetails: CommitDetails
  mutations: Mutations
  router: RouterState
}
