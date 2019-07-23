import * as React from 'react'
// import { CSSTransition } from 'react-transition-group'
import Modal, { ModalProps } from './Modal'
import TextInput from '../form/TextInput'
import Error from './Error'
import Buttons from './Buttons'
import Tabs from './Tabs'

const CreateDataset: React.FunctionComponent<ModalProps> = ({ onDismissed, onSubmit }) => {
  const [datasetName, setDatasetName] = React.useState('')
  const [path, setPath] = React.useState('')
  // const [bodyFormat, setBodyFormat] = React.useState('csv')
  const [bodyPath, setBodyPath] = React.useState('')
  const [activeTab, setActiveTab] = React.useState('Create new datafile')
  const [dismissable, setDismissable] = React.useState(true)
  const [buttonDisabled, setButtonDisabled] = React.useState(true)
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  console.log(setDatasetName)
  console.log(setPath)
  console.log(setBodyPath)
  // call this whenever we need to check if the button should be disabled
  const toggleButton = (activeTab: string) => {
    if (!(datasetName && path)) {
      setButtonDisabled(true)
      return
    }
    if (activeTab === 'Use existing file') {
      bodyPath === '' && setButtonDisabled(true)
      return
    }
    setButtonDisabled(false)
  }

  const handleSetActiveTab = (activeTab: string) => {
    setActiveTab(activeTab)
    toggleButton(activeTab)
    setError('')
  }

  const renderCreateDataset = () => {
    return (
      <div>
        <TextInput
          name='datasetName'
          label='Dataset Name:'
          type=''
          value={datasetName}
          onChange={handleChanges}
          maxLength={300}
        />
        <TextInput
          name='path'
          label='Local Path:'
          type=''
          value={path}
          onChange={handleChanges}
          maxLength={300}
        />
      </div>
    )
  }

  const handleChanges = (name: string, value: any) => {
    if (value[value.length - 1] === ' ') {
      return
    }
    if (name === 'datasetName') setDatasetName(value)
    if (name === 'path') setPath(value)
    toggleButton(activeTab)
  }

  const renderTabs = () => {
    return <Tabs tabs={['Create new datafile', 'Use existing file']} active={activeTab} onClick={handleSetActiveTab}/>
  }

  const renderCreateBody = () => {
    return (
      <div>
        <TextInput
          name='path'
          label='Local Path:'
          type=''
          value={path}
          onChange={handleChanges}
          maxLength={300}
        />
      </div>
    )
  }

  const renderUseExistingBody = () =>
    <div>Use existing body!</div>

  const handleSubmit = () => {
    setDismissable(true)
    setLoading(true)
    // should fire off action and catch error response
    // if success, fetchDatatsets
    const handleResponse = () => {
      if (datasetName === 'error' || path === 'error' || bodyPath === 'error') {
        setError('could not find dataset!')
        setDismissable(false)
        setLoading(false)
        return
      }
      if (onSubmit) {
        new Promise((resolve) => {
          onSubmit()
          resolve()
        }).then(() =>
          setTimeout(onDismissed, 200)
        )
      }
    }
    setTimeout(handleResponse, 1000)
  }

  return (
    <Modal
      id="CreateDataset"
      title={'Create Dataset'}
      onDismissed={onDismissed}
      onSubmit={handleSubmit}
      dismissable={dismissable}
      setDismissable={setDismissable}
    >
      <div>
        {renderCreateDataset()}
        {renderTabs()}
        {renderCreateBody()}
        {renderUseExistingBody()}
      </div>
      <Error text={error} />
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

export default CreateDataset
