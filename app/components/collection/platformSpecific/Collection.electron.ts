import { ipcRenderer } from 'electron'

export function showDatasetMenu (show: boolean) {
  ipcRenderer.send('show-dataset-menu', show)
}
