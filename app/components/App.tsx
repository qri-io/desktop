import { hot } from 'react-hot-loader/root'
import * as React from 'react'
import { Action } from 'redux'
import { CSSTransition } from 'react-transition-group'
import { HashRouter as Router } from 'react-router-dom'
import { ipcRenderer } from 'electron'

// import components
import Toast from './Toast'
import AppError from './AppError'
import AppLoading from './AppLoading'
import AddDataset from './modals/AddDataset'
import ExportVersion from './modals/ExportVersion'
import LinkDataset from './modals/LinkDataset'
import RemoveDataset from './modals/RemoveDataset'
import CreateDataset from './modals/CreateDataset'
import PublishDataset from './modals/PublishDataset'
import UnpublishDataset from './modals/UnpublishDataset'
import RoutesContainer from '../containers/RoutesContainer'

// import models
import { ApiAction } from '../store/api'
import { Modal, ModalType, HideModal } from '../models/modals'
import { Toast as IToast, Selections } from '../models/store'
import { Dataset } from '../models/dataset'

export const QRI_CLOUD_ROOT = 'https://qri.cloud'

// 2800ms is quick enough for the app to feel responsive
// but is slow enough to not clog up the ports
export const defaultPollInterval = 3000

export interface AppProps {
  hasDatasets: boolean
  loading: boolean
  sessionID: string
  peername: string
  name: string
  selections: Selections
  apiConnection?: number
  hasAcceptedTOS: boolean
  // the persited directory path to which the user last saved a dataset
  datasetDirPath: string
  qriCloudAuthenticated: boolean
  toast: IToast
  modal: Modal
  workingDataset: Dataset
  exportPath: string
  setExportPath: (path: string) => Action
  children: JSX.Element[] | JSX.Element
  bootstrap: () => Promise<ApiAction>
  fetchMyDatasets: (page?: number, pageSize?: number) => Promise<ApiAction>
  addDataset: (peername: string, name: string, path: string) => Promise<ApiAction>
  linkDataset: (peername: string, name: string, dir: string) => Promise<ApiAction>
  setWorkingDataset: (peername: string, name: string) => Promise<ApiAction>
  initDataset: (path: string, name: string, format: string) => Promise<ApiAction>
  acceptTOS: () => Action
  setQriCloudAuthenticated: () => Action
  signup: (username: string, email: string, password: string) => Promise<ApiAction>
  signin: (username: string, password: string) => Promise<ApiAction>
  closeToast: () => Action
  pingApi: () => Promise<ApiAction>
  setModal: (modal: Modal) => Action
  removeDatasetAndFetch: (peername: string, name: string, removeFiles: boolean) => Promise<ApiAction>
  publishDataset: () => Promise<ApiAction>
  unpublishDataset: () => Promise<ApiAction>
  setDatasetDirPath: (path: string) => Action
}

interface AppState {
  currentModal: Modal
  sessionID: string
  peername: string
  showDragDrop: boolean
}

const noModalObject: HideModal = {
  type: ModalType.NoModal
}

class App extends React.Component<AppProps, AppState> {
  constructor (props: AppProps) {
    super(props)

    this.state = {
      currentModal: noModalObject,
      sessionID: this.props.sessionID,
      peername: this.props.peername,
      showDragDrop: false
    }

    this.renderModal = this.renderModal.bind(this)
    this.renderAppLoading = this.renderAppLoading.bind(this)
    this.renderAppError = this.renderAppError.bind(this)
  }

  componentDidMount () {
    // handle ipc events from electron menus
    ipcRenderer.on('create-dataset', () => {
      this.props.setModal({ type: ModalType.CreateDataset })
    })

    ipcRenderer.on('add-dataset', () => {
      this.props.setModal({ type: ModalType.AddDataset })
    })

    setInterval(() => {
      if (this.props.apiConnection !== 1 || this.props.selections.peername === '' || this.props.selections.name === '') {
        this.props.pingApi()
      }
    }, defaultPollInterval)

    if (this.props.apiConnection === 1) {
      this.props.bootstrap()
    }
  }

  componentDidUpdate (prevProps: AppProps) {
    if (this.props.sessionID === '' && prevProps.apiConnection === 0 && this.props.apiConnection === 1) {
      this.props.bootstrap()
    }
  }

  private renderModal (): JSX.Element | null {
    const { modal, setModal } = this.props
    if (!modal) return null
    let modalComponent = <div />

    switch (modal.type) {
      case ModalType.RemoveDataset: {
        modalComponent = (
          <RemoveDataset
            modal={modal}
            onSubmit={this.props.removeDatasetAndFetch}
            onDismissed={async () => setModal(noModalObject)}
          />
        )
        break
      }

      case ModalType.PublishDataset: {
        const { peername, name } = this.props.workingDataset
        modalComponent = (
          <PublishDataset
            peername={peername}
            name={name}
            onSubmit={this.props.publishDataset}
            onDismissed={async () => setModal(noModalObject)}
          />
        )
        break
      }

      case ModalType.UnpublishDataset: {
        const { peername, name } = this.props.workingDataset
        modalComponent = (
          <UnpublishDataset
            peername={peername}
            name={name}
            onSubmit={this.props.unpublishDataset}
            onDismissed={async () => setModal(noModalObject)}
          />
        )
        break
      }

      case ModalType.CreateDataset: {
        modalComponent = (
          <CreateDataset
            datasetDirPath={this.props.datasetDirPath}
            onSubmit={this.props.initDataset}
            onDismissed={async () => setModal(noModalObject)}
            setDatasetDirPath={this.props.setDatasetDirPath}
          />
        )
        break
      }

      case ModalType.AddDataset: {
        modalComponent = (
          <AddDataset
            datasetDirPath={this.props.datasetDirPath}
            onSubmit={this.props.addDataset}
            onDismissed={async () => setModal(noModalObject)}
            setDatasetDirPath={this.props.setDatasetDirPath}
          />
        )
        break
      }

      case ModalType.ExportVersion: {
        modalComponent = (
          <ExportVersion
            peername={modal.peername}
            name={modal.name}
            path={modal.path}
            title={modal.title}
            timestamp={modal.timestamp}
            exportPath={this.props.exportPath}
            setExportPath={this.props.setExportPath}
            onDismissed={async () => setModal(noModalObject)}
          />
        )
        break
      }

      case ModalType.LinkDataset: {
        const { peername, name } = this.props.workingDataset
        modalComponent = (
          <LinkDataset
            peername={peername}
            name={name}
            onSubmit={this.props.linkDataset}
            onDismissed={async () => setModal(noModalObject)}
          />
        )
        break
      }
    }

    return (
      <div >
        <CSSTransition
          in={modal.type !== ModalType.NoModal}
          classNames='fade'
          component='div'
          timeout={300}
          unmountOnExit
        >
          {modalComponent}
        </CSSTransition>
      </div>
    )
  }

  private renderAppLoading () {
    return (
      <CSSTransition
        in={this.props.loading}
        classNames="fade"
        component="div"
        timeout={1000}
        mountOnEnter
        unmountOnExit
      >
        <AppLoading />
      </CSSTransition>
    )
  }

  private renderAppError () {
    return (
      <CSSTransition
        in={this.props.apiConnection === -1}
        classNames="fade"
        component="div"
        timeout={1000}
        unmountOnExit
      >
        <AppError />
      </CSSTransition>
    )
  }

  private renderDragDrop () {
    return (
      <div
        onDragEnter={(event) => {
          event.stopPropagation()
          event.preventDefault()
          this.setState({ showDragDrop: true })
          console.log('enter')
        }}
        onDragOver={(event) => {
          event.stopPropagation()
          event.preventDefault()
          this.setState({ showDragDrop: true })
          console.log('over')
        }}
        onDragLeave={(event) => {
          event.stopPropagation()
          event.preventDefault()
          this.setState({ showDragDrop: false })
          console.log('leave')
        }}
        onDrop={(event) => {
          this.setState({ showDragDrop: false })
          console.log(event.dataTransfer.files[0].name)
          event.preventDefault()
          console.log('drop')
        }}
        className='drag-drop'
        id='drag-drop'
      >
      DRAG AND DROP!
      </div>
    )
  }

  render () {
    const {
      toast,
      closeToast,
      loading
    } = this.props

    if (loading) {
      return this.renderAppLoading()
    }

    return (
      <div className='drag'
        onDragEnter={() => {
          this.setState({ showDragDrop: true })
        }}
        style={{
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}>
        {this.renderAppError()}
        {this.state.showDragDrop && this.renderDragDrop() }
        {this.renderModal()}
        <Router>
          <RoutesContainer />
        </Router>
        <Toast
          type={toast.type}
          message={toast.message}
          isVisible={toast.visible}
          timeout={3000}
          onClose={closeToast}
        />
      </div>
    )
  }
}

export default hot(App)
