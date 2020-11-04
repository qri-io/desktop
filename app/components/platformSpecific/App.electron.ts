import { ipcRenderer, remote } from 'electron'
import fs from 'fs'

export function addRendererListener (eventType: string, func: (e?: any, s?: string) => void) {
  ipcRenderer.on(eventType, func)
}

export function removeRendererListener (eventType: string, func: (e?: any, s?: string) => void) {
  ipcRenderer.removeListener(eventType, func)
}

export function sendElectronEventToMain (eventType: string) {
  ipcRenderer.send(eventType)
}

export function reloadWindow () {
  remote.getCurrentWindow().reload()
}

export function exportDebugLog (path: string, opts: Electron.SaveDialogSyncOptions) {
  const exportFilename: string | undefined = remote.dialog.showSaveDialogSync(remote.getCurrentWindow(), opts)
  if (!exportFilename) {
    // Dialog cancelled, do nothing
    return
  }
  fs.copyFileSync(path, exportFilename)
}
