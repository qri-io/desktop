import { ipcRenderer, shell } from 'electron'
export function addRendererListener (eventType: string, func: (e?: any, s?: string) => void) {
  ipcRenderer.on(eventType, func)
}

export function removeRendererListener (eventType: string, func: (e?: any, s?: string) => void) {
  ipcRenderer.removeListener(eventType, func)
}

export function openDirectory (path: string) {
  shell.openItem(path)
}
