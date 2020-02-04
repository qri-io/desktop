import * as React from 'react'
import { Action } from 'redux'
import { CSSTransition } from 'react-transition-group'
import { ConnectedRouter } from 'connected-react-router'
import { ipcRenderer, remote } from 'electron'
import fs from 'fs'
import path from 'path'
import ReactTooltip from 'react-tooltip'
import { history } from '../store/configureStore.development'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileMedical } from '@fortawesome/free-solid-svg-icons'

// import components
import Toast from './Toast'
import Navbar from './Navbar'
import AppError from './AppError'
import AppLoading from './AppLoading'
import AddDataset from './modals/AddDataset'
import LinkDataset from './modals/LinkDataset'
import RemoveDataset from './modals/RemoveDataset'
import CreateDataset from './modals/CreateDataset'
import PublishDataset from './modals/PublishDataset'
import UnpublishDataset from './modals/UnpublishDataset'
import SearchModal from './modals/SearchModal'
import RoutesContainer from '../containers/RoutesContainer'

// import models
import { ApiAction } from '../store/api'
import { Modal, ModalType, HideModal } from '../models/modals'
import { Toast as IToast, Selections, ToastType } from '../models/store'
import { Dataset } from '../models/dataset'
import { ToastTypes } from './chrome/Toast'

export const QRI_CLOUD_ROOT = 'https://qri.cloud'

// 2800ms is quick enough for the app to feel responsive
// but is slow enough to not clog up the ports
export const defaultPollInterval = 3000

export interface AppProps {
  hasDatasets: boolean
  loading: boolean
  session: Session
  name: string
  selections: Selections
  apiConnection?: number
  hasAcceptedTOS: boolean
  // the persited directory path to which the user last saved a dataset
  datasetDirPath: string
  qriCloudAuthenticated: boolean
  toast: IToast
  openToast: (type: ToastType, name: string, message: string) => Action
  modal: Modal
  workingDataset: Dataset
  exportPath: string
  setExportPath: (path: string) => Action
  children: JSX.Element[] | JSX.Element
  bootstrap: () => Promise<ApiAction>
  fetchMyDatasets: (page?: number, pageSize?: number) => Promise<ApiAction>
  addDataset: (peername: string, name: string) => Promise<ApiAction>
  linkDataset: (peername: string, name: string, dir: string) => Promise<ApiAction>
  setWorkingDataset: (peername: string, name: string) => Promise<ApiAction>
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
  signout: () => Action
  setRoute: (route: string) => Action
  importFile: (filePath: string, fileName: string, fileSize: number) => Promise<ApiAction>
  fetchWorkingDatasetDetails: () => Promise<ApiAction>
}

interface AppState {
  currentModal: Modal
  sessionID: string
  peername: string
  showDragDrop: boolean
  debugLogPath: string
}

const noModalObject: HideModal = {
  type: ModalType.NoModal
}

class App extends React.Component<AppProps, AppState> {
  constructor (props: AppProps) {
    super(props)

    this.state = {
      currentModal: noModalObject,
      sessionID: this.props.session.sessionID,
      peername: this.props.session.peername,
      showDragDrop: false,
      debugLogPath: ''
    }

    this.renderModal = this.renderModal.bind(this)
    this.renderAppLoading = this.renderAppLoading.bind(this)
    this.renderAppError = this.renderAppError.bind(this)
    this.handleCreateDataset = this.handleCreateDataset.bind(this)
    this.handleAddDataset = this.handleAddDataset.bind(this)
    this.handleSelectRoute = this.handleSelectRoute.bind(this)
    this.handleSetDebugLogPath = this.handleSetDebugLogPath.bind(this)
    this.handleExportDebugLog = this.handleExportDebugLog.bind(this)
  }

  private handleCreateDataset () {
    this.props.setModal({ type: ModalType.CreateDataset })
  }

  private handleAddDataset () {
    this.props.setModal({ type: ModalType.AddDataset })
  }

  private handleSelectRoute (e: any, route: string) {
    this.props.setRoute(route)
  }

  private handleSetDebugLogPath (_e: any, path: string) {
    this.setState({ debugLogPath: path })
  }

  private handleExportDebugLog () {
    const window = remote.getCurrentWindow()
    const exportFilename: string | undefined = remote.dialog.showSaveDialogSync(window, {
      defaultPath: 'qri-debug.log'
    })
    if (!exportFilename) {
      // Dialog cancelled, do nothing
      return
    }
    if (!this.state.debugLogPath) {
      // Don't have a log file, log and do nothing
      console.log('debugLogsPath not set, cannot export!')
      return
    }
    fs.copyFileSync(this.state.debugLogPath, exportFilename)
  }

  componentDidMount () {
    // handle ipc events from electron menus
    ipcRenderer.on('create-dataset', this.handleCreateDataset)

    ipcRenderer.on('add-dataset', this.handleAddDataset)

    ipcRenderer.on('select-route', this.handleSelectRoute)

    ipcRenderer.on('set-debug-log-path', this.handleSetDebugLogPath)

    ipcRenderer.on('export-debug-log', this.handleExportDebugLog)

    setInterval(() => {
      if (this.props.apiConnection !== 1 || this.props.selections.peername === '' || this.props.selections.name === '') {
        this.props.pingApi()
      }
    }, defaultPollInterval)

    if (this.props.apiConnection === 1) {
      this.props.bootstrap()
    }
  }

  componentWillUnmount () {
    ipcRenderer.removeListener('create-dataset', this.handleCreateDataset)

    ipcRenderer.on('add-dataset', this.handleAddDataset)

    ipcRenderer.on('select-route', this.handleSelectRoute)
  }

  componentDidUpdate (prevProps: AppProps) {
    if (this.props.session.id === '' && prevProps.apiConnection === 0 && this.props.apiConnection === 1) {
      this.props.bootstrap()
    }

    // this "wires up" all of the tooltips, must be called on update, as tooltips
    // in descendents can come and go
    ReactTooltip.rebuild()
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
            onSubmit={this.props.importFile}
            onDismissed={async () => setModal(noModalObject)}
            filePath={modal.bodyPath ? modal.bodyPath : ''}
          />
        )
        break
      }

      case ModalType.AddDataset: {
        modalComponent = (
          <AddDataset
            onSubmit={this.props.addDataset}
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
            setDatasetDirPath={this.props.setDatasetDirPath}
            datasetDirPath={this.props.datasetDirPath}
          />
        )
        break
      }

      case ModalType.Search: {
        modalComponent = (
          <SearchModal q={modal.q} onDismissed={async () => setModal(noModalObject)}/>
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
    const { importFile } = this.props
    return (
      <div
        onDragEnter={(event) => {
          event.stopPropagation()
          event.preventDefault()
          this.setState({ showDragDrop: true })
        }}
        onDragOver={(event) => {
          event.stopPropagation()
          event.preventDefault()
          this.setState({ showDragDrop: true })
        }}
        onDragLeave={(event) => {
          event.stopPropagation()
          event.preventDefault()
          this.setState({ showDragDrop: false })
        }}
        onDrop={(event) => {
          this.setState({ showDragDrop: false })
          event.preventDefault()
          const ext = path.extname(event.dataTransfer.files[0].path)
          this.props.closeToast()
          if (!(ext === '.csv' || ext === '.json')) {
            // open toast for 1 second
            this.props.openToast(ToastTypes.error, 'drag-drop', 'unsupported file format: only json and csv supported')
            setTimeout(() => this.props.closeToast(), 2500)
            return
          }

          const {
            path: filePath,
            name: fileName,
            size: fileSize
          } = event.dataTransfer.files[0]
          importFile(filePath, fileName, fileSize)
        }}
        className='drag-drop'
        id='drag-drop'
      >
        <div className="inner">
          <div className="spacer">Create a new dataset!</div>
          <div className="icon"><FontAwesomeIcon size="5x" icon={faFileMedical} /></div>
        </div>
        <div className="footer">You can import csv and json files</div>
      </div>
    )
  }

  render () {
    const {
      toast,
      closeToast,
      loading,
      session,
      signout
    } = this.props

    if (loading) {
      return this.renderAppLoading()
    }

    const { photo: userphoto, peername: username, name } = session

    return (
      <div id='app' className='drag'
        onDragEnter={() => {
          if (this.props.modal.type === ModalType.NoModal) {
            this.setState({ showDragDrop: true })
          }
        }}
        style={{
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}>
        {this.renderAppError()}
        {this.state.showDragDrop && this.renderDragDrop() }
        {this.renderModal()}
        <ConnectedRouter history={history}>
          <Navbar
            userphoto={userphoto}
            username={username}
            name={name}
            signout={signout}
          />
          <RoutesContainer />
        </ConnectedRouter>
        <Toast
          type={toast.type}
          message={toast.message}
          isVisible={toast.visible}
          timeout={3000}
          onClose={closeToast}
        />
        {/*
          This adds react-tooltip to all children of Dataset
          To add a tooltip to any element, add a data-tip={'tooltip text'} attribute
          See componentDidUpdate, which calls rebuild() to re-bind all tooltips
        */}
        <ReactTooltip
          place='bottom'
          type='dark'
          effect='solid'
          delayShow={200}
          multiline
        />
      </div>
    )
  }
}

export default App
