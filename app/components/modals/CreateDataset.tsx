import * as React from 'react'
import path from 'path'
import { remote } from 'electron'
import fs from 'fs'
import changeCase from 'change-case'

import { CreateDatasetModal } from '../../models/modals'
import { ApiAction } from '../../store/api'

import { connectComponentToProps } from '../../utils/connectComponentToProps'

import { dismissModal } from '../../actions/ui'
import { importFile } from '../../actions/api'

import { selectModal } from '../../selections'

import Modal from './Modal'
import ExternalLink from '../ExternalLink.TARGET_PLATFORM'
import TextInput from '../form/TextInput'
import Error from './Error'
import Buttons from './Buttons'
import ButtonInput from '../form/ButtonInput'

interface CreateDatasetProps {
  onDismissed: () => void
  importFile: (filePath: string, fileName: string, fileSize: number) => Promise<ApiAction>
  modal: CreateDatasetModal
}

const CreateDatasetComponent: React.FunctionComponent<CreateDatasetProps> = (props) => {
  const {
    onDismissed,
    importFile
  } = props

  const validName = (name: string): string => {
    // cast name to meet our specification
    // make lower case, snakecase, and remove invalid characters
    let coercedName = changeCase.lowerCase(name)
    coercedName = changeCase.snakeCase(name)
    return coercedName.replace(/^[^a-z0-9_]+$/g, '')
  }

  const [filePath, setFilePath] = React.useState('')
  const [datasetName, setDatasetName] = React.useState(validName(path.basename(filePath, path.extname(filePath))))

  const [dismissable, setDismissable] = React.useState(true)
  const [buttonDisabled, setButtonDisabled] = React.useState(true)
  const [alreadyDatasetError, setAlreadyDatasetError] = React.useState('')

  React.useEffect(() => {
    setButtonDisabled(filePath === '')
  }, [filePath])

  // should come from props
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  // should come from props/actions that has us check if the directory already contains a qri dataset
  const isQriDataset = (datasetDirPath: string) => !datasetDirPath

  const showFilePicker = () => {
    const window = remote.getCurrentWindow()
    const filePath: string[] | undefined = remote.dialog.showOpenDialogSync(window, {
      properties: ['openFile']
    })

    if (!filePath) {
      return
    }

    const selectedPath = filePath[0]
    const basename = path.basename(selectedPath)
    const name = basename.split('.')[0]

    if (name && datasetName === '') {
      setDatasetName(validName(name))
    }

    setFilePath(selectedPath)
    const isDataset = isQriDataset(selectedPath)
    if (isDataset) {
      setAlreadyDatasetError('A dataset already exists in this directory.')
      setButtonDisabled(true)
    }
  }

  const handleFilePickerDialog = (showFunc: () => void) => {
    new Promise(resolve => {
      setDismissable(false)
      resolve()
    })
      .then(() => showFunc())
      .then(() => setDismissable(true))
  }

  const handleSubmit = () => {
    if (filePath === '') return
    setDismissable(false)
    setLoading(true)
    const fileName = path.basename(filePath)
    const stats = fs.statSync(filePath)

    error && setError('')
    if (!importFile) return
    importFile(filePath, fileName, stats.size)
    onDismissed()
  }

  return (
    <Modal
      id="create_modal"
      title={'Create a New Dataset'}
      onDismissed={onDismissed}
      onSubmit={() => {}}
      dismissable={dismissable}
      setDismissable={setDismissable}
    >
      <div className='content-wrap' >
        <div className='content'>
          <p>Qri will create a directory for your new dataset, containing files linked to each of the dataset&apos;s <ExternalLink href='https://qri.io/docs/concepts/dataset/'>components</ExternalLink>.</p>
          <p>The data file you specify will become your new dataset&apos;s <ExternalLink href='https://qri.io/docs/reference/dataset/#body'>body</ExternalLink> component.</p>
          <div className='flex-space-between'>
            <TextInput
              name='filePath'
              label='Source data file'
              labelTooltip='Select a CSV or JSON file on your computer.<br/>Qri will import the data and leave the file in place.'
              type=''
              value={filePath}
              onChange={(e: React.ChangeEvent) => {
                setButtonDisabled(e.target.value === '')
              }}
              maxLength={600}
              errorText={alreadyDatasetError}
              tooltipFor='modal-tooltip'
            />
            <div className='margin-left'><ButtonInput id='chooseBodyFilePath' onClick={() => handleFilePickerDialog(showFilePicker)} >Choose...</ButtonInput></div>
          </div>
        </div>
      </div>
      <Error id={'create-modal-error'} text={error} />
      <Buttons
        cancelText='cancel'
        onCancel={onDismissed}
        submitText='Create Dataset'
        onSubmit={handleSubmit}
        disabled={buttonDisabled}
        loading={loading}
      />
    </Modal>
  )
}

export default connectComponentToProps(
  CreateDatasetComponent,
  (state: any, ownProps: CreateDatasetProps) => {
    return {
      modal: selectModal(state)
    }
  },
  {
    importFile,
    onDismissed: dismissModal
  }
)
