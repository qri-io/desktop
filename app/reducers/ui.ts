import { AnyAction } from 'redux'
import store from '../utils/localStore'
import { apiActionTypes } from '../store/api'

export const UI_TOGGLE_DATASET_LIST = 'UI_TOGGLE_DATASET_LIST'
export const UI_SET_SIDEBAR_WIDTH = 'UI_SET_SIDEBAR_WIDTH'
export const UI_ACCEPT_TOS = 'UI_ACCEPT_TOS'
export const UI_SET_PEERNAME = 'UI_SET_PEERNAME'
export const UI_SET_API_CONNECTION = 'UI_SET_API_CONNECTION'

export const defaultSidebarWidth = 250
export const hasAcceptedTOSKey = 'acceptedTOS'
export const hasSetPeernameKey = 'setPeername'

export const [, PING_SUCCESS, PING_FAILURE] = apiActionTypes('ping')

const getSidebarWidth = (key: string): number => {
  const width = store().getItem(key)
  if (width) {
    return parseInt(width, 10)
  }
  return defaultSidebarWidth
}

const initialState = {
  apiConnection: 0,
  showDatasetList: false,
  errorMessage: null,
  message: null,
  hasAcceptedTOS: store().getItem(hasAcceptedTOSKey) === 'true',
  hasSetPeername: store().getItem(hasSetPeernameKey) === 'true',
  showDiff: false,
  datasetSidebarWidth: getSidebarWidth('datasetSidebarWidth'),
  commitSidebarWidth: getSidebarWidth('commitSidebarWidth')
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
    case PING_SUCCESS:
      if (state.apiConnection === 1) return state
      return Object.assign({}, state, { apiConnection: 1 })
    case PING_FAILURE:
      return Object.assign({}, state, { apiConnection: -1 })
    case UI_SET_API_CONNECTION:
      return Object.assign({}, state, { apiConnection: action.status })
    default:
      return state
  }
}
