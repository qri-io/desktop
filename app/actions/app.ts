import {
  APP_SET_SIDEBAR_TAB,
  APP_TOGGLE_DATASET_LIST,
  APP_SIDEBAR_RESIZE,
  APP_SIDEBAR_RESET
} from '../constants/app'

export interface IAppPayload {
  activeTab? : string
  sidebarWidth?: string
}

export function setSidebarTab (activeTab: string) {
  return {
    type: APP_SET_SIDEBAR_TAB,
    payload: {
      activeTab
    }
  }
}

export function toggleDatasetList () {
  return {
    type: APP_TOGGLE_DATASET_LIST
  }
}

export function handleResize (sidebarWidth: number) {
  return {
    type: APP_SIDEBAR_RESIZE,
    payload: {
      sidebarWidth
    }
  }
}

export function handleReset () {
  return {
    type: APP_SIDEBAR_RESET
  }
}
