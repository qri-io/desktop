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

export interface AppProps {
  hasDatasets: boolean
  loading: boolean
  sessionID: string
  peername: string
  name: string
  selections: Selections
  apiConnection?: number
  hasAcceptedTOS: boolean
  qriCloudAuthenticated: boolean
  toast: IToast
  modal: Modal
  workingDataset: Dataset
  children: JSX.Element[] | JSX.Element
  fetchSession: () => Promise<ApiAction>
  fetchMyDatasets: (page?: number, pageSize?: number) => Promise<ApiAction>
  addDataset: (peername: string, name: string) => Promise<ApiAction>
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
}

interface AppState {
  currentModal: Modal
  sessionID: string
  peername: string
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
      peername: this.props.peername
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
    }, 1000)

    this.props.fetchSession()
      .then(async () => {
        if (this.props.qriCloudAuthenticated) { this.props.fetchMyDatasets() }
      })
  }

  static getDerivedStateFromProps (NextProps: AppProps, PrevState: AppState) {
    if (PrevState.sessionID !== NextProps.sessionID || PrevState.peername !== NextProps.peername) {
      NextProps.fetchMyDatasets()
      return { sessionID: NextProps.sessionID, peername: NextProps.peername }
    }
    return null
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
            onSubmit={this.props.initDataset}
            onDismissed={async () => setModal(noModalObject)}
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

  render () {
    const {
      toast,
      closeToast
    } = this.props

    return (
      <div style={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {this.renderAppLoading()}
        {this.renderAppError()}
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
