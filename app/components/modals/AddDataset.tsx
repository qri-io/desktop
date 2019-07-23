import * as React from 'react'
import { CSSTransition } from 'react-transition-group'
import Modal, { ModalProps } from './Modal'
import TextInput from '../form/TextInput'
import Error from './Error'
import Buttons from './Buttons'
import Tabs from './Tabs'

const AddByName: React.FunctionComponent<any> = ({ peername, datasetName, onChange }) => {
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

const AddByUrl: React.FunctionComponent<any> = ({ url, onChange }) => {
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

const AddDataset: React.FunctionComponent<ModalProps> = ({ onDismissed, onSubmit }) => {
  const [peername, setPeername] = React.useState('')
  const [datasetName, setDatasetName] = React.useState('')
  const [url, setUrl] = React.useState('')
  const [activeTab, setActiveTab] = React.useState('By Name')

  const handleChanges = (name: string, value: any) => {
    if (value[value.length - 1] === ' ') {
      return
    }
    if (name === 'peername') setPeername(value)
    if (name === 'datasetName') setDatasetName(value)
    if (name === 'url') setUrl(value)
    toggleButton(activeTab)
  }

  const toggleButton = (activeTab: string) => {
    if (activeTab === 'By Name') {
      if (peername && datasetName) {
        setButtonDisabled(false)
      } else {
        setButtonDisabled(true)
      }
    }
    if (activeTab === 'By Url') {
      if (url) {
        setButtonDisabled(false)
      } else {
        setButtonDisabled(true)
      }
    }
  }

  // should be from props
  const [error, setError] = React.useState('')
  const [dismissable, setDismissable] = React.useState(true)
  const [buttonDisabled, setButtonDisabled] = React.useState(true)
  const [loading, setLoading] = React.useState(false)

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
        in={ activeTab === 'By Name' }
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
        in={ activeTab === 'By Url' }
        classNames="fade"
        component="div"
        timeout={300}
        unmountOnExit
      >
        <AddByUrl url={url} onChange={handleChanges}/>
      </CSSTransition>
    )
  }

  const handleSetActiveTab = (activeTab: string) => {
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
      <Tabs tabs={['By Name', 'By Url']} active={activeTab} onClick={handleSetActiveTab} />
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
