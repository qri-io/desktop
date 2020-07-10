import { ipcRenderer } from 'electron'
import { Modal } from '../../models/modals'

export const blockMenusOnFirstLoad = () => {
  ipcRenderer.send('block-menus', true)
}

export const blockMenusIfModalIsOpen = (modal: Modal) => {
  const blockMenus = modal.type !== 0
  ipcRenderer.send('block-menus', blockMenus)
}
