import * as React from 'react'
import { Action } from 'redux'
import { remote, ipcRenderer } from 'electron'

import Modal from './Modal'
import TextInput from '../form/TextInput'
import Buttons from './Buttons'
import moment from 'moment'
import ButtonInput from '../form/ButtonInput'

interface ExportVersionProps {
  onDismissed: () => void
  peername: string
  name: string
  path: string
  title: string
  exportPath: string
  timestamp: Date
  setExportPath: (path: string) => Action
}

const ExportVersion: React.FunctionComponent<ExportVersionProps> = (props) => {
  const {
    onDismissed,
    peername,
    name,
    path,
    title,
    timestamp,
    exportPath: persistedExportPath,
    setExportPath: saveExportPath
  } = props

  const pathUrl = path === '' ? '' : `/at/${path}`
  const exportUrl = `http://localhost:2503/export/${peername}/${name}${pathUrl}?download=true&all=true`
  const [exportPath, setExportPath] = React.useState(persistedExportPath)
  const [dismissable, setDismissable] = React.useState(true)
  const [buttonDisabled, setButtonDisabled] = React.useState(true)

  const handleSubmit = () => {
    ipcRenderer.send('export', { url: exportUrl, directory: exportPath })
    onDismissed()
  }

  React.useEffect(() => {
    // persist the exportPath
    if (exportPath !== '') {
      saveExportPath(exportPath)
      if (buttonDisabled) setButtonDisabled(false)
    } else {
      setButtonDisabled(true)
    }
  }, [exportPath])

  const handleChanges = (e: React.ChangeEvent) => {
    const value = e.target.value
    if (value[value.length - 1] !== ' ') setExportPath(value)
  }

  const handlePathPickerDialog = (showFunc: () => void) => {
    new Promise(resolve => {
      setDismissable(false)
      resolve()
    })
      .then(() => showFunc())
      .then(() => setDismissable(true))
  }

  const showDirectoryPicker = () => {
    const window = remote.getCurrentWindow()
    const directory: string[] | undefined = remote.dialog.showOpenDialog(window, {
      properties: ['createDirectory', 'openDirectory']
    })

    if (!directory) {
      return
    }

    const selectedPath = directory[0]

    setExportPath(selectedPath)
  }

  return (
    <Modal
      id="export_modal"
      title={'Export a Version of this Dataset'}
      onDismissed={onDismissed}
      onSubmit={() => {}}
      dismissable={dismissable}
      setDismissable={setDismissable}
    >
      <div className='content-wrap'>
        <div>
          <div className='content'>
            <div className='margin-bottom'>
              <p><strong>{peername}/{name}</strong></p>
              <p>{title} - <i>{moment(timestamp).format('MMMM Do YYYY, h:mm:ss a')}</i></p>
            </div>
            <div className='flex-space-between'>
              <TextInput
                name='savePath'
                label='Export Folder'
                labelTooltip='Qri will export the dataset to this folder'
                tooltipFor='modal-tooltip'
                type=''
                value={exportPath}
                onChange={handleChanges}
                maxLength={600}
              />
              <div className='margin-left'><ButtonInput id='chooseSavePath' onClick={() => handlePathPickerDialog(showDirectoryPicker)} >Choose...</ButtonInput></div>
            </div>
          </div>
        </div>
        <p className='submit-message'>
          {!buttonDisabled && (
            <span>Qri will save a zip of this dataset version to {exportPath} </span>
          )}
        </p>
      </div>
      <Buttons
        cancelText='cancel'
        onCancel={onDismissed}
        submitText='Export Version'
        onSubmit={handleSubmit}
        disabled={buttonDisabled}
        loading={false}
      />
    </Modal>
  )
}

export default ExportVersion
