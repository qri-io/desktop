import { RouterState } from 'connected-react-router'
import { Meta, Structure, Commit, IStats } from './dataset'
import { Session } from './session'
import { Details } from './details'
import { QriRef } from './qriRef'
import { match, RouteComponentProps } from 'react-router-dom'

export enum ApiConnection {
  neverConnected = 0,
  connected = 1,
  connectionFailure = -1
}

enum ModalType {
  NewDataset,
  PullDataset,
}

export type ComponentType =
  | 'component'
  | 'commit'
  | 'commitComponent'

type Modal =
| {
  type: ModalType.NewDataset
  dirPath?: string
  bodyPath?: string
}
| {
  type: ModalType.PullDataset
  initialURL?: string | null
}

export interface RouteProps extends RouteComponentProps {
  match: match<QriRef>
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

export type ToastType =
  | 'success'
  | 'info'
  | 'error'

export interface Toast {
  type: ToastType
  name: string
  message: string
  visible: false
}

export interface Connection {
  apiConnection: ApiConnection
  failedToFetchCount: number
}

export interface UI {
  hasAcceptedTOS: boolean
  qriCloudAuthenticated: boolean
  modal?: Modal
  showDiff: boolean
  datasetSidebarWidth: number
  collectionSidebarWidth: number
  networkSidebarWidth: number
  toast: Toast
  blockMenus: boolean
  hideCommitNudge: boolean
  datasetDirPath: string
  exportPath: string
  detailsBar: Details
  importFileName: string
  importFileSize: number
  bootupComponent: BootupComponentType
  bulkActionExecuting: boolean
}

export type BootupComponentType =
  | 'loading'
  | 'migrating'
  | 'migrationFailure'
  | 'portOccupied'
  | string

export type SelectedComponent =
  | 'commit'
  | 'readme'
  | 'meta'
  | 'body'
  | 'structure'
  | 'transform'
  | ''

// currently selected dataset, tab, dataset component, commit, etc
export interface Selections {
  peername: string
  name: string
  activeTab: string
  component: SelectedComponent
  commit: string
  commitComponent: SelectedComponent
}

// info about the current value of a list being paginated
export interface PageInfo {
  isFetching: boolean
  page: number
  pageSize: number
  fetchedAll: boolean
  error?: string
}

// VersionInfo pulls details from a dataset at a specific commit in a version
// history. It's flat, plain data representation of a dataset meant for listing.
// VersionInfo is a superset of a Reference, embedding all fields a reference
// contains, and a subset of a Dataset, which fully describes a single version
export interface VersionInfo {
  // reference details
  // human-readble name of the owner of this dataset
  username: string
  // user identifier
  profileId: string
  // dataset name
  name: string
  // commit hash, eg: /ipfs/QmY9WcXXUnHJbYRA28LRctiL4qu4y...
  path: string

  // repo locality
  // path to a local filesystem-linked directory (if exists)
  fsiPath: string
  // is block data for this commit stored locally?
  foreign: boolean
  // published tells whether or not a dataset is published
  published: boolean

  // dataset version details
  // dataset meta.Title field
  metaTitle: string
  // meta.Themes array as a "comma,separated,string"
  themeList: string

  // TODO (b5) - these are not yet supplied by the backend.
  // data format of the body
  bodyFormat: string
  // length of body data in bytes
  bodySize?: number
  // number of rows in the body
  bodyRows?: number
  // number of validation errors in the body
  numErrors?: number

  // title of commit
  commitTitle: string
  // commit description message
  commitMessage: string
  // commit.Timestamp field, time of version creation
  commitTime: string
  // number of commits in history
  numVersions?: number

  // TODO (b5) - need to figure out publication representation. there's tension
  // about what "publication" as a boolean means.
  // published: boolean
}

export function qriRefFromVersionInfo (vi: VersionInfo): QriRef {
  return {
    username: vi.username,
    profileId: vi.profileId,
    name: vi.name,
    path: vi.path
  }
}

// list of local datasets
export interface MyDatasets {
  pageInfo: PageInfo
  value: VersionInfo[]
  filter: string // filter string from ui
}

export type ComponentStatus =
  | 'modified'
  | 'unmodified'
  | 'removed'
  | 'added'
  | 'add'
  | 'parse error'

// info about a dataset component as compared the same component in previous commit
export interface StatusInfo {
  filepath: string
  status: ComponentStatus
  mtime?: Date
  errors?: object[]
  warnings?: object[]
  component?: string
}

export interface Pages {
  [key: string]: PageInfo
}

export interface Status {
  [key: string]: StatusInfo
}

type DagCompletion = number[]

type RemoteEventType =
  | 'push-version'
  | 'pull-version'

export interface RemoteEvent {
  ref: QriRef
  remoteAddr: string
  progress: DagCompletion
  type: RemoteEventType
  complete?: boolean
}

export type RemoteEvents = Record<string, RemoteEvent>

export interface DatasetStore {
  path: string
  prevPath: string
  peername: string
  name: string
  status: Status
  isLoading: boolean
  published: boolean
  components: {
    commit: {
      value: Commit
    }
    readme: {
      value?: string
      preview?: string
    }
    body: {
      value: any[]
      pageInfo: PageInfo
    }
    meta: {
      value: Meta
    }
    structure: {
      value: Structure
    }
    stats: {
      value?: IStats
    }
    transform: {
      value?: string
    }
  }
  structure: Structure
}

export interface WorkingDataset extends DatasetStore {
  fsiPath: string
  isSaving: boolean
  isWriting: boolean
}

export interface Log {
  pageInfo: PageInfo
  value: VersionInfo[]
}

export interface WorkbenchRoutes {
  historyRef: QriRef
  editRef: QriRef
  location: string
}

export default interface Store {
  session: Session
  connection: Connection
  ui: UI
  remoteEvents: RemoteEvents
  selections: Selections
  myDatasets: MyDatasets
  workingDataset: WorkingDataset
  workbenchRoutes: WorkbenchRoutes
  dataset: DatasetStore
  log: Log
  mutations: Mutations
  router: RouterState
}
