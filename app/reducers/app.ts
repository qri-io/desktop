import { IActionWithPayload } from '../actions/helpers'
import { IAppPayload } from '../actions/app'
import {
  APP_SET_SIDEBAR_TAB
} from '../constants/app'

export interface IAppState {
  activeTab: string
}

const initialState = {
  activeTab: 'status'
}

export default function appReducer (state: IAppState = initialState, action: IActionWithPayload<IAppPayload>) {
  switch (action.type) {
    case APP_SET_SIDEBAR_TAB:
      const { activeTab } = action.payload
      if (activeTab === state.activeTab) return state
      return Object.assign({}, state, { activeTab })

    default:
      return state
  }
}
