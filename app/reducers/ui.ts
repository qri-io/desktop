import { AnyAction } from 'redux'

import store from '../utils/localStore'
import { apiActionTypes } from '../utils/actionType'
import { ModalType } from '../models/modals'
import { DetailsType } from '../models/details'
import {
  SELECTIONS_SET_SELECTED_LISTITEM,
  SELECTIONS_SET_WORKING_DATASET,
  SELECTIONS_CLEAR
} from './selections'
import { blockMenusOnFirstLoad, blockMenusIfModalIsOpen } from './platformSpecific/ui.TARGET_PLATFORM'

export const UI_SET_SIDEBAR_WIDTH = 'UI_SET_SIDEBAR_WIDTH'
export const UI_ACCEPT_TOS = 'UI_ACCEPT_TOS'
export const UI_SET_QRI_CLOUD_AUTHENTICATED = 'UI_SET_QRI_CLOUD_AUTHENTICATED'
export const UI_OPEN_TOAST = 'UI_OPEN_TOAST'
export const UI_CLOSE_TOAST = 'UI_CLOSE_TOAST'
export const UI_SET_MODAL = 'UI_SET_MODAL'
export const UI_SIGNOUT = 'UI_SIGNOUT'
export const UI_HIDE_COMMIT_NUDGE = 'UI_HIDE_COMMIT_NUDGE'
export const UI_SET_DATASET_DIR_PATH = 'UI_SET_DATASET_DIR_PATH'
export const UI_SET_EXPORT_PATH = 'UI_SET_EXPORT_PATH'
export const UI_SET_DETAILS_BAR = 'UI_SET_DETAILS_BAR'
export const UI_SET_BOOTUP_COMPONENT = 'UI_SET_BOOTUP_COMPONENT'
export const UI_BULK_ACTION_EXECUTING = 'UI_BULK_ACTION_EXECUTING'

export const UNAUTHORIZED = 'UNAUTHORIZED'

export const defaultSidebarWidth = 250
export const hasAcceptedTOSKey = 'acceptedTOS'
export const qriCloudAuthenticatedKey = 'qriCloudAuthenticated'
export const hideCommitNudge = 'hideCommitNudge'

const getSidebarWidth = (key: string): number => {
  const width = store().getItem(key)
  if (width) {
    return parseInt(width, 10)
  }
  return defaultSidebarWidth
}

const defaultToast = {
  type: 'success',
  name: 'default',
  message: '',
  visible: false
}

const initialState = {
  hasAcceptedTOS: store().getItem(hasAcceptedTOSKey) === 'true',
  qriCloudAuthenticated: store().getItem(qriCloudAuthenticatedKey) === 'true',
  showDiff: false,
  datasetSidebarWidth: getSidebarWidth('datasetSidebarWidth'),
  collectionSidebarWidth: getSidebarWidth('collectionSidebarWidth'),
  networkSidebarWidth: getSidebarWidth('networkSidebarWidth'),
  toast: defaultToast,
  blockMenus: true,
  hideCommitNudge: store().getItem(hideCommitNudge) === 'true',
  datasetDirPath: store().getItem('datasetDirPath') || '',
  exportPath: store().getItem('exportPath') || '',
  modal: { type: ModalType.NoModal },
  detailsBar: { type: DetailsType.NoDetails },
  importFileName: '',
  importFileSize: 0,
  bootupComponent: 'loading',
  bulkActionExecuting: false
}

// send an event to electron to block menus on first load
blockMenusOnFirstLoad()

const [, ADD_SUCC] = apiActionTypes('add')
const [, INIT_SUCC] = apiActionTypes('init')

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case UI_SET_SIDEBAR_WIDTH:
      const { type, sidebarWidth } = action.payload
      switch (type) {
        case 'workbench':
          store().setItem('datasetSidebarWidth', sidebarWidth)
          return {
            ...state,
            datasetSidebarWidth: sidebarWidth
          }
        case 'collection':
          store().setItem('collectionSidebarWidth', sidebarWidth)
          return {
            ...state,
            collectionSidebarWidth: sidebarWidth
          }
        case 'network':
          store().setItem('networkSidebarWidth', sidebarWidth)
          return {
            ...state,
            networkSidebarWidth: sidebarWidth
          }
        default:
          return state
      }

    case UI_ACCEPT_TOS:
      store().setItem(hasAcceptedTOSKey, 'true')
      return Object.assign({}, state, { hasAcceptedTOS: true })

    case UI_SET_QRI_CLOUD_AUTHENTICATED:
      store().setItem(qriCloudAuthenticatedKey, 'true')
      return Object.assign({}, state, { qriCloudAuthenticated: true })

    case UI_OPEN_TOAST:
      return {
        ...state,
        toast: {
          ...action.payload,
          visible: true
        }
      }

    case UI_CLOSE_TOAST:
      return {
        ...state,
        toast: {
          ...state.toast,
          visible: false
        }
      }

    case UI_SET_MODAL:
      const modal = action.payload

      // if modal is open, block electron menus
      blockMenusIfModalIsOpen(modal)

      return {
        ...state,
        modal
      }

    case UI_SET_DETAILS_BAR:
      return {
        ...state,
        detailsBar: action.details
      }

    // if we change screens
    case SELECTIONS_SET_WORKING_DATASET:
    case SELECTIONS_CLEAR:
    case SELECTIONS_SET_SELECTED_LISTITEM:
      return {
        ...state,
        detailsBar: { type: DetailsType.NoDetails }
      }

    case UI_SIGNOUT:
      store().setItem('qriCloudAuthenticated', 'false')
      return {
        ...state,
        qriCloudAuthenticated: false
      }

    case UI_HIDE_COMMIT_NUDGE:
      store().setItem('hideCommitNudge', 'true')
      return {
        ...state,
        hideCommitNudge: true
      }

    case UNAUTHORIZED:
      store().setItem(qriCloudAuthenticatedKey, 'true')
      return {
        ...state,
        qriCloudAuthenticated: false
      }

    case UI_SET_DATASET_DIR_PATH:
      store().setItem('datasetDirPath', action.path)
      return {
        ...state,
        datasetDirPath: action.path
      }

    case UI_SET_EXPORT_PATH:
      store().setItem('exportPath', action.path)
      return {
        ...state,
        exportPath: action.path
      }

    case ADD_SUCC:
    case INIT_SUCC:
      const { peername, name } = action.payload.data
      return {
        ...state,
        toast: {
          type: 'success',
          message: `${action.type === ADD_SUCC ? 'Added' : 'Created new'} dataset ${peername}/${name}`,
          visible: true
        }
      }

    case UI_SET_BOOTUP_COMPONENT:
      const { component } = action
      return {
        ...state,
        bootupComponent: component
      }

    case UI_BULK_ACTION_EXECUTING:
      const { executing } = action
      return {
        ...state,
        bulkActionExecuting: executing
      }
    default:
      return state
  }
}
