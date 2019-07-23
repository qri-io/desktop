import { ui } from './initalState'
import { AnyAction } from 'redux'

export const UI_TOGGLE_DATASET_LIST = 'UI_TOGGLE_DATASET_LIST'
export const UI_SET_SIDEBAR_WIDTH = 'UI_SET_SIDEBAR_WIDTH'
export const UI_ACCEPT_TOS = 'UI_ACCEPT_TOS'
export const UI_SET_PEERNAME = 'UI_SET_PEERNAME'

const initialState = ui

export const defaultSidebarWidth = ui.datasetSidebarWidth

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case UI_TOGGLE_DATASET_LIST:
      const showDatasetList = !state.showDatasetList
      return Object.assign({}, state, { showDatasetList })

    case UI_SET_SIDEBAR_WIDTH:
      const { type, sidebarWidth } = action.payload
      let newState
      if (type === 'dataset') {
        newState = { datasetSidebarWidth: sidebarWidth }
      } else {
        newState = { commitSidebarWidth: sidebarWidth }
      }
      return Object.assign({}, state, newState)

    case UI_ACCEPT_TOS:
      return Object.assign({}, state, { hasAcceptedTOS: true })

    case UI_SET_PEERNAME:
      return Object.assign({}, state, { hasSetPeername: true })

    default:
      return state
  }
}
