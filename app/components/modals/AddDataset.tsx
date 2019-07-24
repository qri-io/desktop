import * as React from 'react'
import { CSSTransition } from 'react-transition-group'
import Modal, { ModalProps } from './Modal'
import TextInput from '../form/TextInput'
import Error from './Error'
import Buttons from './Buttons'
import Tabs from './Tabs'

interface AddByNameProps {
  peername: string
  datasetName: string
  onChange: (name: string, value: any, e: any) => void
}

const AddByName: React.FunctionComponent<AddByNameProps> = ({ peername, datasetName, onChange }) => {
  return (
    <div className='content'>
      <p>Add a dataset that already exists on Qri <br/>using the peername and dataset name.</p>
      <TextInput
        name='peername'
        label='Peername:'
        type=''
        value={peername}
        onChange={onChange}
        maxLength={300}
      />
      <TextInput
        name='datasetName'
        label='Dataset Name:'
        type=''
        value={datasetName}
        onChange={onChange}
        maxLength={300}
      />
    </div>
  )
}

interface AddByUrl {
  url: string
  onChange: (name: string, value: any, e: any) => void
}

const AddByUrl: React.FunctionComponent<AddByUrl> = ({ url, onChange }) => {
  return (
    <div className='content'>
      <p>Add a dataset that already exists on Qri <br/> using a url.</p>
      <TextInput
        name='url'
        label='Url'
        type=''
        value={url}
        onChange={onChange}
        maxLength={600}
      />
    </div>
  )
}

enum TabTypes {
  ByName = 'By Name',
  ByUrl = 'By Url',
}

const AddDataset: React.FunctionComponent<ModalProps> = ({ onDismissed, onSubmit }) => {
  const [peername, setPeername] = React.useState('')
  const [datasetName, setDatasetName] = React.useState('')
  const [url, setUrl] = React.useState('')
  const [activeTab, setActiveTab] = React.useState(TabTypes.ByName)
  const [dismissable, setDismissable] = React.useState(true)
  const [buttonDisabled, setButtonDisabled] = React.useState(true)

  // should come from props
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleChanges = (name: string, value: any) => {
    if (value[value.length - 1] === ' ') {
      return
    }
    if (name === 'peername') setPeername(value)
    if (name === 'datasetName') setDatasetName(value)
    if (name === 'url') setUrl(value)
    toggleButton(activeTab)
  }

  const toggleButton = (activeTab: TabTypes) => {
    if (activeTab === TabTypes.ByName) {
      if (peername && datasetName) {
        setButtonDisabled(false)
      } else {
        setButtonDisabled(true)
      }
    }
    if (activeTab === TabTypes.ByUrl) {
      if (url) {
        setButtonDisabled(false)
      } else {
        setButtonDisabled(true)
      }
    }
  }

  const handleSetDismissable = (dismissable: boolean) => {
    console.log(dismissable)
    setDismissable(dismissable)
  }

  const handleSubmit = () => {
    handleSetDismissable(false)
    setLoading(true)
    // should fire off action and catch error response
    // if success, fetchDatatsets
    const handleResponse = () => {
      if (peername === 'error' || datasetName === 'error' || url === 'error') {
        setError('could not find dataset!')
        handleSetDismissable(true)
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

  const renderAddByName = () => {
    return (
      <CSSTransition
        in={ activeTab === TabTypes.ByName }
        classNames="fade"
        component="div"
        timeout={300}
        unmountOnExit
      >
        <AddByName peername={peername} datasetName={datasetName} onChange={handleChanges}/>
      </CSSTransition>
    )
  }

  const renderAddByUrl = () => {
    return (
      <CSSTransition
        in={ activeTab === TabTypes.ByUrl }
        classNames="fade"
        component="div"
        timeout={300}
        unmountOnExit
      >
        <AddByUrl url={url} onChange={handleChanges}/>
      </CSSTransition>
    )
  }

  const handleSetActiveTab = (activeTab: TabTypes) => {
    toggleButton(activeTab)
    setActiveTab(activeTab)
    setError('')
  }

  return (
    <Modal
      id="addDataset"
      title={'Add Dataset'}
      onDismissed={onDismissed}
      onSubmit={handleSubmit}
      dismissable={dismissable}
      setDismissable={setDismissable}
    >
      <Tabs tabs={[TabTypes.ByName, TabTypes.ByUrl]} active={activeTab} onClick={handleSetActiveTab} id='add-dataset-tab'/>
      <div className='content-wrap'>
        {renderAddByName()}
        {renderAddByUrl()}
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

export default AddDataset
