import * as React from 'react'
import path from 'path'
import { Action } from 'redux'
import { remote } from 'electron'
import changeCase from 'change-case'

import Modal from './Modal'
import ExternalLink from '../ExternalLink'
import { ApiAction } from '../../store/api'
import TextInput from '../form/TextInput'
import Error from './Error'
import Buttons from './Buttons'
import ButtonInput from '../form/ButtonInput'
import { validateDatasetName } from '../../utils/formValidation'

interface CreateDatasetProps {
  onDismissed: () => void
  onSubmit: (path: string, name: string, dir: string, mkdir: string) => Promise<ApiAction>
  datasetDirPath: string
  setDatasetDirPath: (path: string) => Action
  filePath: string
}

const CreateDataset: React.FunctionComponent<CreateDatasetProps> = (props) => {
  const {
    onDismissed,
    onSubmit,
    datasetDirPath: persistedDatasetDirPath,
    setDatasetDirPath: saveDatasetDirPath,
    filePath: givenFilePath
  } = props

  const validName = (name: string): string => {
    // cast name to meet our specification
    // make lower case, snakecase, and remove invalid characters
    let coercedName = changeCase.lowerCase(name)
    coercedName = changeCase.snakeCase(name)
    return coercedName.replace(/^[^a-z0-9_]+$/g, '')
  }

  const [datasetDirPath, setDatasetDirPath] = React.useState(persistedDatasetDirPath)
  const [filePath, setFilePath] = React.useState(givenFilePath)
  const [datasetName, setDatasetName] = React.useState(validName(path.basename(filePath, path.extname(filePath))))

  const [dismissable, setDismissable] = React.useState(true)
  const [buttonDisabled, setButtonDisabled] = React.useState(true)
  const [datasetNameError, setDatasetNameError] = React.useState('')
  const [alreadyDatasetError, setAlreadyDatasetError] = React.useState('')

  React.useEffect(() => {
    // validate datasetName and assign error
    const datasetNameValidationError = validateDatasetName(datasetName)
    datasetNameValidationError ? setDatasetNameError(datasetNameValidationError) : setDatasetNameError('')

    // only ready when all three fields are not invalid
    const ready = datasetDirPath !== '' && filePath !== '' && datasetName !== '' && !datasetNameValidationError
    setButtonDisabled(!ready)
  }, [datasetName, datasetDirPath, filePath])

  React.useEffect(() => {
    // persist the datasetDirPath
    saveDatasetDirPath(datasetDirPath)
  }, [datasetDirPath])

  // should come from props
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  // should come from props/actions that has us check if the directory already contains a qri dataset
  const isQriDataset = (datasetDirPath: string) => !datasetDirPath

  const showDirectoryPicker = () => {
    const window = remote.getCurrentWindow()
    const directory: string[] | undefined = remote.dialog.showOpenDialog(window, {
      properties: ['createDirectory', 'openDirectory']
    })

    if (!directory) {
      return
    }

    const selectedPath = directory[0]

    setDatasetDirPath(selectedPath)
    const isDataset = isQriDataset(selectedPath)
    if (isDataset) {
      setAlreadyDatasetError('A dataset already exists in this directory.')
      setButtonDisabled(true)
    }
  }

  const showFilePicker = () => {
    const window = remote.getCurrentWindow()
    const filePath: string[] | undefined = remote.dialog.showOpenDialog(window, {
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

  const handlePathPickerDialog = (showFunc: () => void) => {
    new Promise(resolve => {
      setDismissable(false)
      resolve()
    })
      .then(() => showFunc())
      .then(() => setDismissable(true))
  }

  const handleChanges = (name: string, value: any) => {
    if (value[value.length - 1] === ' ') {
      return
    }

    if (name === 'datasetName') {
      setDatasetName(value)
      setAlreadyDatasetError('')
    }
  }

  const handleSubmit = () => {
    setDismissable(false)
    setLoading(true)
    error && setError('')
    if (!onSubmit) return
    onSubmit(filePath, datasetName, datasetDirPath, datasetName)
      .then(() => onDismissed())
      .catch((action: any) => {
        setLoading(false)
        setDismissable(true)
        setError(action.payload.err.message)
      })
  }

  const fullPath = path.join(datasetDirPath, datasetName)

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
              onChange={handleChanges}
              maxLength={600}
              errorText={alreadyDatasetError}
              tooltipFor='modal-tooltip'
            />
            <div className='margin-left'><ButtonInput id='chooseBodyFilePath' onClick={() => handleFilePickerDialog(showFilePicker)} >Choose...</ButtonInput></div>
          </div>
          <TextInput
            name='datasetName'
            label='Dataset Name'
            labelTooltip='Choose a descriptive name that is unique among your datasets'
            type=''
            value={datasetName}
            onChange={handleChanges}
            maxLength={600}
            errorText={datasetNameError}
            tooltipFor='modal-tooltip'
          />
          <div className='flex-space-between'>
            <TextInput
              name='savePath'
              label='Directory path'
              labelTooltip='Qri will create a new directory for<br/>this dataset&apos;s files at this location.'
              type=''
              value={datasetDirPath}
              onChange={handleChanges}
              maxLength={600}
              errorText={alreadyDatasetError}
              tooltipFor='modal-tooltip'
            />
            <div className='margin-left'><ButtonInput id='chooseSavePath' onClick={() => handlePathPickerDialog(showDirectoryPicker)} >Choose...</ButtonInput></div>
          </div>
        </div>
      </div>

      <p className='submit-message'>
        {!buttonDisabled && (
          <span>Qri will create the directory {fullPath} and import your data file</span>
        )}
      </p>
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

export default CreateDataset
