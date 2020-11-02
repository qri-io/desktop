import { remote, OpenDialogSyncOptions } from 'electron'
import fs from 'fs'

export function chooseFile (opts: OpenDialogSyncOptions): string[] {
  const filePaths: string[] | undefined = remote.dialog.showOpenDialogSync(remote.getCurrentWindow(), opts)

  if (!filePaths) {
    return ['', '']
  }

  let filepath = filePaths[0]

  const stats = fs.statSync(filepath)

  // if over 10 mb reject
  if (stats.size > (1024 * 1000 * 10)) {
    return ['', "error: over 10MB"]
  }

  return [filepath, '']
}
