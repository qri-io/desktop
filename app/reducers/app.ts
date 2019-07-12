import { IActionWithPayload } from '../actions/helpers'
import { IAppPayload } from '../actions/app'
import {
  APP_SET_SIDEBAR_TAB
} from '../constants/app'

export interface IAppState {
  dataset: {
    sidebar: {
      activeTab: string
    }
  }
}

const initialState = {
  dataset: {
    sidebar: {
      activeTab: 'status'
    }
  }
}

export default function appReducer (state: IAppState = initialState, action: IActionWithPayload<IAppPayload>) {
  switch (action.type) {
    case APP_SET_SIDEBAR_TAB:
      const { activeTab } = action.payload
      if (activeTab === state.dataset.sidebar.activeTab) return state
      return Object.assign({}, state, { dataset: {
        sidebar: { activeTab }
      } })

    default:
      return state
  }
}
