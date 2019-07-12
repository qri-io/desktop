import { IActionWithPayload } from '../actions/helpers'
import { IAppPayload } from '../actions/app'
import {
  APP_SET_SIDEBAR_TAB,
  APP_TOGGLE_DATASET_LIST,
  APP_SIDEBAR_RESIZE,
  APP_SIDEBAR_RESET,
  DEFAULT_SIDEBAR_WIDTH
} from '../constants/app'

export interface IAppState {
  dataset: {
    showDatasetList: boolean
    sidebarWidth: number
    sidebar: {
      activeTab: string
    }
  }
}

const initialState = {
  dataset: {
    showDatasetList: false,
    sidebarWidth: DEFAULT_SIDEBAR_WIDTH,
    sidebar: {
      activeTab: 'status'
    }
  }
}

export default function appReducer (state: IAppState = initialState, action: IActionWithPayload<IAppPayload>) {
  const { dataset } = state

  switch (action.type) {
    case APP_SET_SIDEBAR_TAB:
      const { activeTab } = action.payload
      if (activeTab === state.dataset.sidebar.activeTab) return state
      return Object.assign({}, state, { dataset: {
        sidebar: { activeTab }
      } })

    case APP_TOGGLE_DATASET_LIST:

      return Object.assign({}, state, { dataset: {
        ...dataset,
        showDatasetList: !dataset.showDatasetList
      } })

    case APP_SIDEBAR_RESIZE:
      const { sidebarWidth } = action.payload
      return Object.assign({}, state, { dataset: {
        ...dataset,
        sidebarWidth
      } })

    case APP_SIDEBAR_RESET:
      return Object.assign({}, state, { dataset: {
        ...dataset,
        sidebarWidth: 250
      } })

    default:
      return state
  }
}
