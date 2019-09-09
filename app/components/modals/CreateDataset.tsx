import * as React from 'react'
import { remote } from 'electron'
import Modal from './Modal'
import { ApiAction } from '../../store/api'
import TextInput from '../form/TextInput'
import Error from './Error'
import Buttons from './Buttons'
// import Tabs from './Tabs'
import ButtonInput from '../form/ButtonInput'
import { DatasetSummary } from '../../models/store'
import { validateDatasetName } from '../../utils/formValidation'

interface CreateDatasetProps {
  onDismissed: () => void
  onSubmit: (path: string, name: string, dir: string, mkdir: string) => Promise<ApiAction>
  setWorkingDataset: (peername: string, name: string, isLinked: boolean, published: boolean) => Promise<ApiAction>
}

// setWorkingDataset
const CreateDataset: React.FunctionComponent<CreateDatasetProps> = ({ onDismissed, onSubmit, setWorkingDataset }) => {
  const [datasetName, setDatasetName] = React.useState('')
  const [path, setPath] = React.useState('')
  const [filePath, setFilePath] = React.useState('')

  const [dismissable, setDismissable] = React.useState(true)
  const [buttonDisabled, setButtonDisabled] = React.useState(true)
  const [datasetNameError, setDatasetNameError] = React.useState('')
  const [alreadyDatasetError, setAlreadyDatasetError] = React.useState('')

  React.useEffect(() => {
    // validate datasetName and assign error
    const datasetNameValidationError = validateDatasetName(datasetName)
    datasetNameValidationError ? setDatasetNameError(datasetNameValidationError) : setDatasetNameError('')

    // only ready when all three fields are not invalid
    const ready = path !== '' && filePath !== '' && !datasetNameValidationError
    setButtonDisabled(!ready)
  }, [datasetName, path, filePath])

  // should come from props
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  // should come from props/actions that has us check if the directory already contains a qri dataset
  const isQriDataset = (path: string) => !path

  const showDirectoryPicker = () => {
    const window = remote.getCurrentWindow()
    const directory: string[] | undefined = remote.dialog.showOpenDialog(window, {
      properties: ['createDirectory', 'openDirectory']
    })

    if (!directory) {
      return
    }

    const path = directory[0]

    setPath(path)
    const isDataset = isQriDataset(path)
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

    const path = filePath[0]
    const splitOnSlash = path.split('/')
    const file = splitOnSlash && splitOnSlash.pop()
    const name = file && file.split('.')[0]

    name && datasetName === '' && setDatasetName(name)

    setFilePath(path)
    const isDataset = isQriDataset(path)
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
    onSubmit(filePath, datasetName, path, datasetName)
      .then(({ payload }) => {
        const { data } = payload
        // make sure the dataset we just added is in the list
        const { peername, name, fsipath, published } = data.find((dataset: DatasetSummary) => dataset.name === datasetName)
        setWorkingDataset(peername, name, fsipath !== '', published)
        onDismissed()
      })
      .catch((action: any) => {
        setLoading(false)
        setDismissable(true)
        setError(action.payload.err.message)
      })
  }

  return (
    <Modal
      id="CreateDataset"
      title={'New Dataset'}
      onDismissed={onDismissed}
      onSubmit={() => {}}
      dismissable={dismissable}
      setDismissable={setDismissable}
    >
      <div className='content-wrap'>
        <div className='content'>
          <div className='flex-space-between'>
            <TextInput
              name='path'
              label='Data file'
              type=''
              value={filePath}
              onChange={handleChanges}
              maxLength={600}
              errorText={alreadyDatasetError}
            />
            <div className='margin-left'><ButtonInput onClick={() => handleFilePickerDialog(showFilePicker)} >Choose...</ButtonInput></div>
          </div>
          <TextInput
            name='datasetName'
            label='Dataset Name'
            type=''
            value={datasetName}
            onChange={handleChanges}
            maxLength={600}
            errorText={datasetNameError}
          />
          <div className='flex-space-between'>
            <TextInput
              name='path'
              label='Save Path'
              type=''
              value={path}
              onChange={handleChanges}
              maxLength={600}
              errorText={alreadyDatasetError}
            />
            <div className='margin-left'><ButtonInput onClick={() => handlePathPickerDialog(showDirectoryPicker)} >Choose...</ButtonInput></div>
          </div>
        </div>
      </div>

      <p className='submit-message'>
        {!buttonDisabled && (
          <span>Qri will create the directory {path}/{datasetName} and import your data file</span>
        )}
      </p>
      <Error text={error} />
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
