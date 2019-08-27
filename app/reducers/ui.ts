import { AnyAction } from 'redux'
import store from '../utils/localStore'
import { apiActionTypes } from '../store/api'
import { SAVE_SUCC, SAVE_FAIL } from '../reducers/mutations'

export const UI_TOGGLE_DATASET_LIST = 'UI_TOGGLE_DATASET_LIST'
export const UI_SET_SIDEBAR_WIDTH = 'UI_SET_SIDEBAR_WIDTH'
export const UI_ACCEPT_TOS = 'UI_ACCEPT_TOS'
export const UI_SET_QRI_CLOUD_AUTHENTICATED = 'UI_SET_QRI_CLOUD_AUTHENTICATED'
export const UI_OPEN_TOAST = 'UI_OPEN_TOAST'
export const UI_CLOSE_TOAST = 'UI_CLOSE_TOAST'
export const UI_SET_API_CONNECTION = 'UI_SET_API_CONNECTION'
export const UI_SET_MODAL = 'UI_SET_MODAL'
export const UI_SIGNOUT = 'UI_SIGNOUT'

export const defaultSidebarWidth = 250
export const hasAcceptedTOSKey = 'acceptedTOS'
export const qriCloudAuthenticatedKey = 'qriCloudAuthenticated'

const [, HEALTH_SUCCESS] = apiActionTypes('health')

const getSidebarWidth = (key: string): number => {
  const width = store().getItem(key)
  if (width) {
    return parseInt(width, 10)
  }
  return defaultSidebarWidth
}

const defaultToast = {
  type: 'success',
  message: '',
  visible: false
}

const initialState = {
  apiConnection: 0,
  showDatasetList: false,
  hasAcceptedTOS: store().getItem(hasAcceptedTOSKey) === 'true',
  qriCloudAuthenticated: store().getItem(qriCloudAuthenticatedKey) === 'true',
  showDiff: false,
  datasetSidebarWidth: getSidebarWidth('datasetSidebarWidth'),
  commitSidebarWidth: getSidebarWidth('commitSidebarWidth'),
  toast: defaultToast
}

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case UI_TOGGLE_DATASET_LIST:
      const showDatasetList = !state.showDatasetList
      return Object.assign({}, state, { showDatasetList })

    case UI_SET_SIDEBAR_WIDTH:
      const { type, sidebarWidth } = action.payload
      let newState
      if (type === 'dataset') {
        store().setItem('datasetSidebarWidth', sidebarWidth)
        newState = { datasetSidebarWidth: sidebarWidth }
      } else {
        store().setItem('commitSidebarWidth', sidebarWidth)
        newState = { commitSidebarWidth: sidebarWidth }
      }
      return Object.assign({}, state, newState)

    case UI_ACCEPT_TOS:
      store().setItem(hasAcceptedTOSKey, 'true')
      return Object.assign({}, state, { hasAcceptedTOS: true })

    case UI_SET_QRI_CLOUD_AUTHENTICATED:
      store().setItem(qriCloudAuthenticatedKey, 'true')
      return Object.assign({}, state, { qriCloudAuthenticated: true })

    case UI_OPEN_TOAST:
      const { type: toastType, message } = action.payload
      return {
        ...state,
        toast: {
          type: toastType,
          message,
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
      return {
        ...state,
        modal
      }

    // listen for SAVE_SUCC and SAVE_FAIL to set the toast
    case SAVE_SUCC:
      return {
        ...state,
        toast: {
          type: 'success',
          message: 'Commit Successful!',
          visible: true
        }
      }

    case SAVE_FAIL:
      return {
        ...state,
        toast: {
          type: 'error',
          message: 'Oops, something went wrong with this commit',
          visible: true
        }
      }

    case HEALTH_SUCCESS:
      if (state.apiConnection === 1) return state
      return Object.assign({}, state, { apiConnection: 1 })
    case UI_SET_API_CONNECTION:
      return Object.assign({}, state, { apiConnection: action.status })

    case UI_SIGNOUT:
      store().setItem('qriCloudAuthenticated', 'false')
      return {
        ...state,
        qriCloudAuthenticated: false
      }
    default:
      return state
  }
}
