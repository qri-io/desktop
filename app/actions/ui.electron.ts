import { ipcRenderer } from 'electron'
import { UI_SIGNOUT } from '../reducers/ui'
export * from './ui.base'

export const signout = () => {
  ipcRenderer.send('block-menus', true)
  return {
    type: UI_SIGNOUT
  }
}
