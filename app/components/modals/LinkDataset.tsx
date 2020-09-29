import * as React from 'react'
import { remote } from 'electron'
import { Action } from 'redux'

import { LinkDatasetModal } from '../../models/modals'
import { ApiAction } from '../../store/api'

import { connectComponentToProps } from '../../utils/connectComponentToProps'

import { linkDatasetAndFetch } from '../../actions/api'
import { setDatasetDirPath, dismissModal } from '../../actions/ui'

import { selectModal, selectPersistedDatasetDirPath } from '../../selections'

import Modal from './Modal'
import TextInput from '../form/TextInput'
import Error from './Error'
import Buttons from './Buttons'
import ButtonInput from '../form/ButtonInput'

interface LinkDatasetProps {
  modal: LinkDatasetModal

  persistedDatasetDirPath: string

  onDismissed: () => void
  onSubmit: (peername: string, name: string, dir: string) => Promise<ApiAction>
  setDatasetDirPath: (path: string) => Action
}

export const LinkDatasetComponent: React.FunctionComponent<LinkDatasetProps> = (props) => {
  const {
    modal,
    onDismissed,
    onSubmit,
    persistedDatasetDirPath,
    setDatasetDirPath
  } = props

  const {
    username,
    name,
    modified = false
  } = modal
  const [path, setPath] = React.useState(persistedDatasetDirPath)
  const [datasetDirectory, setDatasetDirectory] = React.useState(name)

  const [dismissable, setDismissable] = React.useState(true)
  const [buttonDisabled, setButtonDisabled] = React.useState(true)
  const [alreadyDatasetError, setAlreadyDatasetError] = React.useState('')

  React.useEffect(() => {
    // if path is empty, disable the button
    setButtonDisabled(!path)
    setDatasetDirPath(path)
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

  const handleChanges = (e: React.ChangeEvent) => {
    const value = e.target.value
    const name = e.target.name
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
    onSubmit(username, name, `${path}/${datasetDirectory}`)
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
      title={`Checkout ${username}/${name}`}
      onDismissed={onDismissed}
      onSubmit={() => {}}
      dismissable={dismissable}
      setDismissable={setDismissable}
    >
      <div className='content-wrap'>
        <div className='content'>
          {modified &&
            <div className='warning'>
              <div>Warning!</div>
              This dataset has changes that haven&apos;t been commited yet! Click &apos;cancel&apos; and commit the changes if you want to keep them. Continuing to checkout will NOT keep your changes.
            </div>
          }
          <TextInput
            name='datasetDirectory'
            label='Dataset Directory'
            helpText="The name of the directory which will contain this dataset's components"
            showHelpText
            type=''
            value={datasetDirectory}
            onChange={handleChanges}
            maxLength={600}
            errorText={alreadyDatasetError}
          />
          <br />
          <div className='flex-space-between'>
            <TextInput
              name='path'
              label='Checkout Location'
              helpText='The file path where the dataset directory will be saved on your machine'
              showHelpText
              type=''
              value={path}
              onChange={handleChanges}
              maxLength={600}
              errorText={alreadyDatasetError}
            />
            <div className='margin-left'><ButtonInput id='chooseCheckoutLocation' onClick={() => handlePickerDialog(showDirectoryPicker)} >Choose...</ButtonInput></div>
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
        submitText='Checkout Dataset'
        onSubmit={handleSubmit}
        disabled={buttonDisabled}
        loading={loading}
      />
    </Modal>
  )
}

export default connectComponentToProps(
  LinkDatasetComponent,
  (state: any, ownProps: LinkDatasetProps) => {
    return {
      ...ownProps,
      modal: selectModal(state),
      persistedDatasetDirPath: selectPersistedDatasetDirPath(state)
    }
  },
  {
    onDismissed: dismissModal,
    onSubmit: linkDatasetAndFetch,
    setDatasetDirPath
  }
)
