import * as React from 'react'
import { ApiAction } from '../../store/api'
import { CSSTransition } from 'react-transition-group'
import Modal from './Modal'
import TextInput from '../form/TextInput'
import Error from './Error'
import Buttons from './Buttons'
// import Tabs from './Tabs'

interface AddByNameProps {
  datasetName: string
  onChange: (name: string, value: any, e: any) => void
}

const AddByName: React.FunctionComponent<AddByNameProps> = ({ datasetName, onChange }) => {
  return (
    <div className='content'>
      <p>Add a dataset that already exists on Qri</p>
      <p>Qri dataset names have the following structure: <strong>peername/dataset name</strong>.</p>
      <p>For example: <strong>chriswhong/usgs_earthquakes</strong>.</p>
      <TextInput
        name='datasetName'
        label='Peername/Dataset_Name:'
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
      <p>Add a dataset that already exists on Qri using a <strong>url</strong>.</p>
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

interface AddDatasetProps {
  onDismissed: () => void
  onSubmit: (peername: string, name: string) => Promise<ApiAction>
}

const AddDataset: React.FunctionComponent<AddDatasetProps> = ({ onDismissed, onSubmit }) => {
  const [datasetName, setDatasetName] = React.useState('')

  // restore when you can add by URL
  // const [url, setUrl] = React.useState('')
  // const [activeTab, setActiveTab] = React.useState(TabTypes.ByName)
  const activeTab = TabTypes.ByName

  const [dismissable, setDismissable] = React.useState(true)
  const [buttonDisabled, setButtonDisabled] = React.useState(true)

  React.useEffect(() => {
    toggleButton(activeTab)
    if (error !== '') setError('')
  }, [datasetName, activeTab])

  // should come from props
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleChanges = (name: string, value: any) => {
    if (value[value.length - 1] === ' ') {
      return
    }
    if (name === 'datasetName') setDatasetName(value)
    // restore when you can add by URL
    // if (name === 'url') setUrl(value)
  }

  const toggleButton = (activeTab: TabTypes) => {
    if (activeTab === TabTypes.ByName) {
      if (datasetName) {
        setButtonDisabled(false)
      } else {
        setButtonDisabled(true)
      }
    }
    // restore when you can add by URL
    // if (activeTab === TabTypes.ByUrl) {
    //   if (url) {
    //     setButtonDisabled(false)
    //   } else {
    //     setButtonDisabled(true)
    //   }
    // }
  }

  const handleSubmit = () => {
    setDismissable(false)
    setLoading(true)
    error && setError('')
    // should fire off action and catch error response
    // if success, fetchDatatsets
    if (!onSubmit) return
    const names = datasetName.split('/')
    if (names.length !== 2) {
      setError('dataset reference should be in the format [peername]/[dataset_name]')
      setLoading(false)
      setDismissable(true)
      return
    }

    onSubmit(names[0], names[1])
      .then(() => onDismissed())
      .catch((action) => {
        setDismissable(true)
        setLoading(false)
        setError(action.payload.err.message)
      })
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
        <AddByName datasetName={datasetName} onChange={handleChanges}/>
      </CSSTransition>
    )
  }

  // restore when you can add by URL
  // const renderAddByUrl = () => {
  //   return (
  //     <CSSTransition
  //       in={ activeTab === TabTypes.ByUrl }
  //       classNames="fade"
  //       component="div"
  //       timeout={300}
  //       unmountOnExit
  //     >
  //       <AddByUrl url={url} onChange={handleChanges}/>
  //     </CSSTransition>
  //   )
  // }
  //
  // const handleSetActiveTab = (activeTab: TabTypes) => {
  //   setActiveTab(activeTab)
  // }

  return (
    <Modal
      id="addDataset"
      title={'Add Dataset'}
      onDismissed={onDismissed}
      onSubmit={() => {}}
      dismissable={dismissable}
      setDismissable={setDismissable}
    >
      {/* restore when you can add by URL */}
      {/* <Tabs tabs={[TabTypes.ByName, TabTypes.ByUrl]} active={activeTab} onClick={handleSetActiveTab} id='add-dataset-tab'/> */}
      <div className='content-wrap'>
        <div>
          {renderAddByName()}
          {/* restore when you can add by URL */}
          {/* {renderAddByUrl()} */}
        </div>
        <CSSTransition
          in={!!error}
          timeout={300}
          classNames='slide'
          component='div'
        >
          <div id='error'><Error text={error} /></div>
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
