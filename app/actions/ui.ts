import {
  UI_TOGGLE_DATASET_LIST,
  UI_SET_SIDEBAR_WIDTH,
  UI_ACCEPT_TOS,
  UI_SET_PEERNAME
} from '../reducers/ui'

export const toggleDatasetList = () => {
  return {
    type: UI_TOGGLE_DATASET_LIST
  }
}

export const setSidebarWidth = (sidebarWidth: number) => {
  return {
    type: UI_SET_SIDEBAR_WIDTH,
    payload: { sidebarWidth }
  }
}

export const acceptTOS = () => {
  return {
    type: UI_ACCEPT_TOS
  }
}

export const setPeername = () => {
  return {
    type: UI_SET_PEERNAME
  }
}
