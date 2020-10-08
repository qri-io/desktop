import { remote, ipcRenderer } from 'electron'
import path from 'path'
import moment from 'moment'

import { refStringFromQriRef } from '../../models/qriRef'
import { VersionInfo, qriRefFromVersionInfo } from '../../models/store'

export default function exportDatasetVersion (vi: VersionInfo, config: 'zip' | 'csv') {
  const window = remote.getCurrentWindow()
  const defaultPath = `${vi.username}-${vi.name}-${moment(vi.commitTime).format('YYYY-MM-DDThh-mm-ss-a')}.${config}`
  const selectedPath: string | undefined = remote.dialog.showSaveDialogSync(window, { defaultPath })

  if (!selectedPath) {
    return
  }

  const directory = path.dirname(selectedPath)
  const filename = path.basename(selectedPath)
  ipcRenderer.send('export', {
    refString: refStringFromQriRef(qriRefFromVersionInfo(vi)),
    filename: filename,
    directory: directory,
    config
  })
}
