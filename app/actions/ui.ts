import { ipcRenderer } from 'electron'

import {
  UI_TOGGLE_DATASET_LIST,
  UI_SET_SIDEBAR_WIDTH,
  UI_ACCEPT_TOS,
  UI_SET_QRI_CLOUD_AUTHENTICATED,
  UI_OPEN_TOAST,
  UI_CLOSE_TOAST,
  UI_SET_MODAL,
  UI_SIGNOUT,
  UI_HIDE_COMMIT_NUDGE
} from '../reducers/ui'

import { ToastType } from '../models/store'
import { Modal } from '../models/modals'

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

export const setQriCloudAuthenticated = () => {
  return {
    type: UI_SET_QRI_CLOUD_AUTHENTICATED
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

export const setModal = (modal: Modal) => {
  return {
    type: UI_SET_MODAL,
    payload: modal
  }
}

export const signout = () => {
  ipcRenderer.send('block-menus', true)
  return {
    type: UI_SIGNOUT
  }
}

export const setHideCommitNudge = () => {
  return {
    type: UI_HIDE_COMMIT_NUDGE
  }
}
