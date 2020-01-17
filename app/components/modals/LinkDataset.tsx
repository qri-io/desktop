import * as React from 'react'
import { remote } from 'electron'
import Modal from './Modal'
import { ApiAction } from '../../store/api'
import TextInput from '../form/TextInput'
import Error from './Error'
import Buttons from './Buttons'
import ButtonInput from '../form/ButtonInput'
import { Action } from 'redux'

interface LinkDatasetProps {
  peername: string
  name: string
  onDismissed: () => void
  onSubmit: (peername: string, name: string, dir: string) => Promise<ApiAction>
  setDatasetDirPath: (path: string) => Action
  datasetDirPath: string
}

const LinkDataset: React.FunctionComponent<LinkDatasetProps> = ({ peername, name, onDismissed, onSubmit, datasetDirPath, setDatasetDirPath }) => {
  const [path, setPath] = React.useState(datasetDirPath)
  const [datasetDirectory, setDatasetDirectory] = React.useState(name)

  const [dismissable, setDismissable] = React.useState(true)
  const [buttonDisabled, setButtonDisabled] = React.useState(true)
  const [alreadyDatasetError, setAlreadyDatasetError] = React.useState('')

  React.useEffect(() => {
    // if path is empty, disable the button
    setButtonDisabled(!path)
    if (!path) {
      setDatasetDirPath(path)
    }
  }, [path])

  // should come from props
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  // should come from props/actions that has us check if the directory already contains a qri dataset
  const isQriDataset = (path: string) => !path

  const showDirectoryPicker = () => {
    const window = remote.getCurrentWindow()
    const directory: string[] | undefined = remote.dialog.showOpenDialogSync(window, {
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

  const handlePickerDialog = (showFunc: () => void) => {
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
    if (name === 'path') {
      setPath(value)
      setAlreadyDatasetError('')
    }

    if (name === 'datasetDirectory') {
      setDatasetDirectory(value)
      setAlreadyDatasetError('')
    }
  }

  const handleSubmit = () => {
    setDismissable(false)
    setLoading(true)
    error && setError('')
    if (!onSubmit) return
    onSubmit(peername, name, `${path}/${datasetDirectory}`)
      .then(onDismissed)
      .catch((action) => {
        setLoading(false)
        setDismissable(true)
        setError(action.payload.err.message)
      })
  }

  return (
    <Modal
      id="checkout-dataset"
      title={`Checkout ${peername}/${name}`}
      onDismissed={onDismissed}
      onSubmit={() => {}}
      dismissable={dismissable}
      setDismissable={setDismissable}
    >
      <div className='content-wrap'>
        <div className='content'>
          <TextInput
            name='datasetDirectory'
            label='Dataset Directory'
            type=''
            value={datasetDirectory}
            onChange={handleChanges}
            maxLength={600}
            errorText={alreadyDatasetError}
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
            <div className='margin-left'><ButtonInput id='chooseSavePath' onClick={() => handlePickerDialog(showDirectoryPicker)} >Choose...</ButtonInput></div>
          </div>
        </div>
      </div>
      <p className='submit-message'>
        {path !== '' && datasetDirectory !== '' && (<span>Qri will create <span>{path}/{datasetDirectory}</span></span>)}
      </p>
      <Error text={error} />
      <Buttons
        cancelText='cancel'
        onCancel={onDismissed}
        submitText='Link Dataset'
        onSubmit={handleSubmit}
        disabled={buttonDisabled}
        loading={loading}
      />
    </Modal>
  )
}

export default LinkDataset
