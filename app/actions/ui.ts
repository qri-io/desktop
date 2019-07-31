import {
  UI_TOGGLE_DATASET_LIST,
  UI_SET_SIDEBAR_WIDTH,
  UI_ACCEPT_TOS,
  UI_SET_PEERNAME,
  UI_OPEN_TOAST,
  UI_CLOSE_TOAST,
  UI_SET_API_CONNECTION
} from '../reducers/ui'

import { ToastType } from '../models/store'

export const toggleDatasetList = () => {
  return {
    type: UI_TOGGLE_DATASET_LIST
  }
}

type SidebarTypes = 'dataset' | 'commit'

export const setSidebarWidth = (type: SidebarTypes, sidebarWidth: number) => {
  return {
    type: UI_SET_SIDEBAR_WIDTH,
    payload: { type, sidebarWidth }
  }
}

export const acceptTOS = () => {
  return {
    type: UI_ACCEPT_TOS
  }
}

export const setHasSetPeername = () => {
  return {
    type: UI_SET_PEERNAME
  }
}

export const openToast = (type: ToastType, message: string) => {
  return {
    type: UI_OPEN_TOAST,
    payload: { type, message }
  }
}

export const closeToast = () => {
  return {
    type: UI_CLOSE_TOAST
  }
}

export const setApiConnection = (status: number) => {
  return {
    type: UI_SET_API_CONNECTION,
    status
  }
}
