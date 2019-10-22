import * as React from 'react'
import { Action } from 'redux'
import { remote } from 'electron'
import path from 'path'

import { ApiAction } from '../../store/api'
import { CSSTransition } from 'react-transition-group'
import Modal from './Modal'
import ExternalLink from '../ExternalLink'
import TextInput from '../form/TextInput'
import DebouncedTextInput from '../form/DebouncedTextInput'
import Error from './Error'
import Buttons from './Buttons'
import ButtonInput from '../form/ButtonInput'
import { validateDatasetReference } from '../../utils/formValidation'

interface AddDatasetProps {
  // func to call when we cancel or click away from the modal
  onDismissed: () => void
  // func to call when we hit submit, this adds the dataset from the network
  onSubmit: (peername: string, name: string, path: string) => Promise<ApiAction>
  // default path that we store. Is the last dir path that the user has given us when trying to add a dataset fsi
  datasetDirPath: string
  // sets the default path, fired off when the user chooses a path
  setDatasetDirPath: (path: string) => Action
}

const AddDataset: React.FunctionComponent<AddDatasetProps> = (props) => {
  const {
    onDismissed,
    onSubmit,
    datasetDirPath: persistedDatasetDirPath,
    setDatasetDirPath: saveDatasetDirPath
  } = props

  const [datasetReference, setDatasetReference] = React.useState('')
  const [datasetDirPath, setDatasetDirPath] = React.useState(persistedDatasetDirPath)

  const [dismissable, setDismissable] = React.useState(true)
  const [buttonDisabled, setButtonDisabled] = React.useState(true)
  const [alreadyDatasetError, setAlreadyDatasetError] = React.useState('')
  const [datasetReferenceError, setDatasetReferenceError] = React.useState('')

  // should come from props/actions that has us check if the directory already contains a qri dataset
  const isQriDataset = (datasetDirPath: string) => !datasetDirPath

  React.useEffect(() => {
    const datasetReferenceValidationError = validateDatasetReference(datasetReference)
    datasetReferenceValidationError ? setDatasetReferenceError(datasetReferenceValidationError) : setDatasetReferenceError('')

    // only ready when both fields are not invalid
    const ready = datasetDirPath !== '' && datasetReference !== '' && !datasetReferenceValidationError
    setButtonDisabled(!ready)
  }, [datasetReference, datasetDirPath])

  React.useEffect(() => {
    // persist the datasetDirPath
    if (datasetDirPath) {
      saveDatasetDirPath(datasetDirPath)
    }
  }, [datasetDirPath])

  // should come from props
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleChanges = (name: string, value: any) => {
    if (value[value.length - 1] === ' ') {
      return
    }
    if (error !== '') setError('')
    if (name === 'datasetName') setDatasetReference(value)
  }

  const handleSubmit = () => {
    setDismissable(false)
    setLoading(true)
    error && setError('')

    if (!onSubmit) return
    const [peername, datasetName] = datasetReference.split('/')
    const datasetFolderPath = path.join(datasetDirPath, datasetName)

    onSubmit(peername, datasetName, datasetFolderPath)
      .then(() => { onDismissed() })
      .catch((action) => {
        setDismissable(true)
        setLoading(false)
        setError(action.payload.err.message)
      })
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

    setDatasetDirPath(selectedPath)
    const isDataset = isQriDataset(selectedPath)
    if (isDataset) {
      setAlreadyDatasetError('A dataset already exists in this directory.')
      setButtonDisabled(true)
    }
  }

  let fullPath = ''

  if (datasetReference && !datasetReferenceError) {
    const [, datasetName] = datasetReference.split('/')
    if (datasetDirPath && datasetName) {
      fullPath = path.join(datasetDirPath, datasetName)
    }
  }

  return (
    <Modal
      id="add_modal"
      title={'Add an Existing Qri Dataset'}
      onDismissed={onDismissed}
      onSubmit={() => {}}
      dismissable={dismissable}
      setDismissable={setDismissable}
    >
      <div className='content-wrap'>
        <div>
          <div className='content'>
            <p>Add an existing dataset by entering its dataset reference, like <span className='code-highlight'>b5/world_bank_population</span></p>
            <p>Search for datasets on <ExternalLink href='https://qri.cloud'>Qri Cloud</ExternalLink>.</p>
            <DebouncedTextInput
              name='datasetName'
              label='Dataset Reference'
              labelTooltip={'Qri dataset references use [username]/[datasetname] format'}
              tooltipFor='modal-tooltip'
              type=''
              value={datasetReference}
              onChange={handleChanges}
              errorText={datasetReferenceError}
              maxLength={300}
            />
            <div className='flex-space-between'>
              <TextInput
                name='savePath'
                label='Directory Path'
                labelTooltip='Qri will create a new directory for<br/>this dataset&apos;s files at this location.'
                tooltipFor='modal-tooltip'
                type=''
                value={datasetDirPath}
                onChange={handleChanges}
                maxLength={600}
                errorText={alreadyDatasetError}
              />
              <div className='margin-left'><ButtonInput id='chooseSavePath' onClick={() => handlePathPickerDialog(showDirectoryPicker)} >Choose...</ButtonInput></div>
            </div>
          </div>
        </div>
        <p className='submit-message'>
          {!buttonDisabled && (
            <span>Qri will create the directory {fullPath} with files linked to this dataset</span>
          )}
        </p>
        <CSSTransition
          in={!!error}
          timeout={300}
          classNames='slide'
          component='div'
        >
          <div id='error'><Error id='add' text={error} /></div>
        </CSSTransition>
      </div>
      <Buttons
        cancelText='cancel'
        onCancel={onDismissed}
        submitText='Add Dataset'
        onSubmit={handleSubmit}
        disabled={buttonDisabled}
        loading={loading}
      />
    </Modal>
  )
}

export default AddDataset
