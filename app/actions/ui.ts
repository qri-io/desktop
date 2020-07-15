import {
  UI_SET_SIDEBAR_WIDTH,
  UI_ACCEPT_TOS,
  UI_SET_QRI_CLOUD_AUTHENTICATED,
  UI_OPEN_TOAST,
  UI_CLOSE_TOAST,
  UI_SET_MODAL,
  UI_HIDE_COMMIT_NUDGE,
  UI_SET_DATASET_DIR_PATH,
  UI_SET_EXPORT_PATH,
  UI_SET_DETAILS_BAR,
  UI_SET_IMPORT_FILE_DETAILS,
  UI_SET_BOOTUP_COMPONENT
} from '../reducers/ui'

import { ToastType, BootupComponentType } from '../models/store'
import { Modal, ModalType } from '../models/modals'
import { Details } from '../models/details'

export type SidebarTypes = 'workbench' | 'network' | 'collection'

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

export const openToast = (type: ToastType, name: string, message: string) => {
  return {
    type: UI_OPEN_TOAST,
    payload: { type, name, message }
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

export const dismissModal = () => {
  return setModal({ type: ModalType.NoModal })
}

// signout has platform specific implementation
// when using the `signout` function, import it from this file
export { signout } from './platformSpecific/ui.TARGET_PLATFORM'

export const setHideCommitNudge = () => {
  return {
    type: UI_HIDE_COMMIT_NUDGE
  }
}

export const setDatasetDirPath = (path: string) => {
  return {
    type: UI_SET_DATASET_DIR_PATH,
    path
  }
}

export const setExportPath = (path: string) => {
  return {
    type: UI_SET_EXPORT_PATH,
    path
  }
}

export const setDetailsBar = (details: Details) => {
  return {
    type: UI_SET_DETAILS_BAR,
    details
  }
}

// filesize in bytes, provided by drag n drop UI
export const setImportFileDetails = (fileName: string, fileSize: number) => {
  return {
    type: UI_SET_IMPORT_FILE_DETAILS,
    fileName,
    fileSize
  }
}

export const setBootupComponent = (component: BootupComponentType) => {
  return {
    type: UI_SET_BOOTUP_COMPONENT,
    component
  }
}
