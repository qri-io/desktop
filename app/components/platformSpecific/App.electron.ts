import { ipcRenderer, remote } from 'electron'

export function addRendererListener (eventType: string, func: (e?: any, s?: string) => void) {
  ipcRenderer.on(eventType, func)
}

export function removeRendererListener (eventType: string, func: (e?: any, s?: string) => void) {
  ipcRenderer.removeListener(eventType, func)
}

export function sendElectronEventToMain (eventType: string) {
  ipcRenderer.send(eventType)
}

export function saveDialogSync (opts: Electron.SaveDialogSyncOptions): string | undefined {
  return remote.dialog.showSaveDialogSync(remote.getCurrentWindow(), opts)
}

export function reloadWindow () {
  remote.getCurrentWindow().reload()
}
