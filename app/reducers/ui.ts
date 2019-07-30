import { AnyAction } from 'redux'
import store from '../utils/localStore'

export const UI_TOGGLE_DATASET_LIST = 'UI_TOGGLE_DATASET_LIST'
export const UI_SET_SIDEBAR_WIDTH = 'UI_SET_SIDEBAR_WIDTH'
export const UI_ACCEPT_TOS = 'UI_ACCEPT_TOS'
export const UI_SET_PEERNAME = 'UI_SET_PEERNAME'
export const UI_OPEN_TOAST = 'UI_OPEN_TOAST'
export const UI_CLOSE_TOAST = 'UI_CLOSE_TOAST'

export const defaultSidebarWidth = 250
export const hasAcceptedTOSKey = 'acceptedTOS'
export const hasSetPeernameKey = 'setPeername'

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
  apiConnection: 1,
  showDatasetList: false,
  errorMessage: null,
  message: null,
  hasAcceptedTOS: store().getItem(hasAcceptedTOSKey) === 'true',
  hasSetPeername: store().getItem(hasSetPeernameKey) === 'true',
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

    case UI_SET_PEERNAME:
      store().setItem(hasSetPeernameKey, 'true')
      return Object.assign({}, state, { hasSetPeername: true })

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
          type: 'success',
          message: '',
          visible: false
        }
      }

    default:
      return state
  }
}
