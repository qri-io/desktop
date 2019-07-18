import { RouterState } from 'react-router-redux'
import Dataset, { Commit } from './dataset'

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

export interface UI {
  apiConnection: ApiConnection
  showDatasetList: boolean
  errorMessage: string | null
  message: string | null
  hasAcceptedTOS: boolean
  hasSetPeername: boolean
  modal?: Modal
  showDiff: boolean
  sidebarWidth: number
}

// currently selected dataset, tab, dataset component, commit, etc
export interface Selections {
  peername: string
  name: string | null
  activeTab: string
  component: string
  commit: string
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

// info about a dataset component as compared the same component in previous commit
export interface ComponentStatus {
  filepath: string
  status: 'changed' | 'unchanged' | 'removed' | 'added'
  errors: object[]
  warnings: object[]
}

export interface Pages {
  [key: string]: PageInfo
}

export interface DatasetComparison {
  path: string
  prevPath: string
  peername: string
  name: string
  pages: Pages
  diff: object
  value: Dataset
  status: {
    [key: string]: ComponentStatus
  }
}

export interface WorkingDataset extends DatasetComparison {
  history: {
    pageInfo: PageInfo
    value: Commit[]
  }
}

export default interface Store {
  session: string
  ui: UI
  selections: Selections
  myDatasets: MyDatasets
  workingDataset: WorkingDataset
  workingHistory: DatasetComparison
  router: RouterState
}
