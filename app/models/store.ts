import { RouterState } from 'react-router-redux'
import { Meta, Structure } from './dataset'
import { Session } from './session'
import { Details } from './details'

enum ApiConnection {
  neverConnected = 0,
  connected = 1,
  connectionFailure = -1
}

enum ModalType {
  CreateDataset,
  AddDataset,
}

export type ComponentType = 'component' | 'commit' | 'componentCommit'

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

export type ToastType = 'success' | 'error'

export interface Toast {
  type: ToastType
  message: string
  visible: false
}

export interface Connection {
  apiConnection: ApiConnection
  failedToFetchCount: number
}

export interface UI {
  showDatasetList: boolean
  hasAcceptedTOS: boolean
  qriCloudAuthenticated: boolean
  modal?: Modal
  showDiff: boolean
  datasetSidebarWidth: number
  commitSidebarWidth: number
  toast: Toast
  blockMenus: boolean
  hideCommitNudge: boolean
  datasetDirPath: string
  exportPath: string
  detailsBar: Details
}

export type SelectedComponent = 'readme' | 'meta' | 'body' | 'structure' | ''

// currently selected dataset, tab, dataset component, commit, etc
export interface Selections {
  peername: string | null
  name: string | null
  activeTab: string
  component: SelectedComponent
  commit: string
  commitComponent: string
}

// info about the current value of a list being paginated
export interface PageInfo {
  isFetching: boolean
  page: number
  pageSize: number
  fetchedAll: boolean
  error?: string
}

// dataset summary info to show in dataset list
export interface DatasetSummary {
  title: string
  peername: string
  name: string
  path: string
  fsiPath: string
  published: boolean
}

// list of local datasets
export interface MyDatasets {
  pageInfo: PageInfo
  value: DatasetSummary[]
  filter: string // filter string from ui
}

export type ComponentState = 'modified' | 'unmodified' | 'removed' | 'add' | 'parse error'

// info about a dataset component as compared the same component in previous commit
export interface ComponentStatus {
  filepath: string
  status: ComponentState
  mtime?: Date
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
  status: DatasetStatus
  isLoading: boolean
  components: {
    readme: {
      value: string | undefined
      preview: string | undefined
    }
    body: {
      value: any[] | undefined
      pageInfo: PageInfo
    }
    meta: {
      value: Meta
    }
    structure: {
      value: Structure
    }
  }
}

export interface HistoryItem {
  author: string
  // profileID: string
  name: string
  path: string
  timestamp: Date
  title: string
}

export interface WorkingDataset extends CommitDetails {
  fsiPath: string
  hasHistory: boolean
  published: boolean
  history: {
    pageInfo: PageInfo
    value: HistoryItem[]
  }
}

export default interface Store {
  session: Session
  connection: Connection
  ui: UI
  selections: Selections
  myDatasets: MyDatasets
  workingDataset: WorkingDataset
  commitDetails: CommitDetails
  mutations: Mutations
  router: RouterState
}
