import { ipcRenderer } from 'electron'
import { UI_SIGNOUT } from '../../reducers/ui.TARGET_PLATFORM'

export const signout = () => {
  ipcRenderer.send('block-menus', true)
  return {
    type: UI_SIGNOUT
  }
}
