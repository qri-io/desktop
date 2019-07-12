import {
  APP_SET_SIDEBAR_TAB
} from '../constants/app'

export interface IAppPayload {
  activeTab? : string
}

export function setSidebarTab (activeTab: string) {
  return {
    type: APP_SET_SIDEBAR_TAB,
    payload: {
      activeTab
    }
  }
}
