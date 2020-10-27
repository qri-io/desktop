import { remote, OpenDialogSyncOptions } from 'electron'

export function showOpenDialogSync (opts: OpenDialogSyncOptions): string[] | undefined {
  return remote.dialog.showOpenDialogSync(remote.getCurrentWindow(), opts)
}
