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
import CreateDataset from './modals/CreateDataset'
import RoutesContainer from '../containers/RoutesContainer'

// import models
import { ApiAction } from '../store/api'
import { Modal, ModalType, NoModal } from '../models/modals'
import { Toast as IToast } from '../models/store'
import { Dataset } from '../models/dataset'

export const QRI_CLOUD_ROOT = 'https://qri.cloud'

export interface AppProps {
  hasDatasets: boolean
  loading: boolean
  sessionID: string
  peername: string
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
  setWorkingDataset: (peername: string, name: string, isLinked: boolean) => Promise<ApiAction>
  initDataset: (path: string, name: string, format: string) => Promise<ApiAction>
  acceptTOS: () => Action
  setQriCloudAuthenticated: () => Action
  signup: (username: string, email: string, password: string) => Promise<ApiAction>
  signin: (username: string, password: string) => Promise<ApiAction>
  closeToast: () => Action
  setApiConnection: (status: number) => Action
  pingApi: () => Promise<ApiAction>
  setModal: (modal: Modal) => Action
}

interface AppState {
  currentModal: Modal
  sessionID: string
  peername: string
}

export default class App extends React.Component<AppProps, AppState> {
  constructor (props: AppProps) {
    super(props)

    this.state = {
      currentModal: NoModal,
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

    if (this.props.apiConnection === 0) {
      var iter = 0
      const backendLoadedCheck = setInterval(() => {
        this.props.pingApi()
        iter++
        if (this.props.apiConnection === 1) clearInterval(backendLoadedCheck)
        if (iter > 20) {
          this.props.setApiConnection(-1)
          clearInterval(backendLoadedCheck)
        }
      }, 750)
    }
    this.props.fetchSession()
      .then(async () => this.props.fetchMyDatasets())
  }

  static getDerivedStateFromProps (NextProps: AppProps, PrevState: AppState) {
    if (PrevState.sessionID !== NextProps.sessionID || PrevState.peername !== NextProps.peername) {
      // clear selection if the sessionID has changed from one user to another
      // if it has gone from no user (initial state) to a user, don't re-fetch
      if (PrevState.sessionID !== '') {
        NextProps.setWorkingDataset('', '', false)
          .then(async () => NextProps.fetchMyDatasets(1))
      }
      return { sessionID: NextProps.sessionID, peername: NextProps.peername }
    }
    return null
  }

  private renderModal (): JSX.Element | null {
    const { modal, setModal, workingDataset } = this.props
    const { peername, name } = workingDataset
    const Modal = modal

    if (!Modal) return null
    return (
      <div >
        <CSSTransition
          in={ModalType.CreateDataset === Modal.type}
          classNames='fade'
          component='div'
          timeout={300}
          unmountOnExit
        >
          <CreateDataset
            onSubmit={this.props.initDataset}
            onDismissed={async () => setModal(NoModal)}
            setWorkingDataset={this.props.setWorkingDataset}
            fetchMyDatasets={this.props.fetchMyDatasets}
          />
        </CSSTransition>
        <CSSTransition
          in={ModalType.AddDataset === Modal.type}
          classNames='fade'
          component='div'
          timeout={300}
          unmountOnExit
        >
          <AddDataset
            onSubmit={this.props.addDataset}
            onDismissed={async () => setModal(NoModal)}
            setWorkingDataset={this.props.setWorkingDataset}
            fetchMyDatasets={this.props.fetchMyDatasets}
          />
        </CSSTransition>
        <CSSTransition
          in={ModalType.LinkDataset === Modal.type}
          classNames='fade'
          component='div'
          timeout={300}
          unmountOnExit
        >
          <LinkDataset
            peername={peername}
            name={name}
            onSubmit={this.props.linkDataset}
            onDismissed={async () => setModal(NoModal)}
          />
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
