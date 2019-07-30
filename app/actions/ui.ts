import {
  UI_TOGGLE_DATASET_LIST,
  UI_SET_SIDEBAR_WIDTH,
  UI_ACCEPT_TOS,
  UI_SET_PEERNAME,
  UI_SET_API_CONNECTION
} from '../reducers/ui'

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

export const setApiConnection = (status: number) => {
  return {
    type: UI_SET_API_CONNECTION,
    status
  }
}
