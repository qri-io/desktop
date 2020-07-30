import * as React from 'react'
import { Action } from 'redux'
import { CSSTransition } from 'react-transition-group'
import { ConnectedRouter, push } from 'connected-react-router'
import { ipcRenderer, remote } from 'electron'
import fs from 'fs'
import ReactTooltip from 'react-tooltip'

// import constants
import { DEFAULT_POLL_INTERVAL } from '../constants'

// import models
import { history } from '../store/configureStore.development'
import { ApiAction } from '../store/api'
import { Modal, ModalType } from '../models/modals'
import { Selections, ApiConnection, BootupComponentType } from '../models/store'
import { Session } from '../models/session'

// import util funcs
import { connectComponentToProps } from '../utils/connectComponentToProps'

// import actions
import { setModal, setBootupComponent } from '../actions/ui'
import { pingApi } from '../actions/api'
import { bootstrap } from '../actions/session'

// import selections
import { selectSelections, selectModal, selectApiConnection, selectSession, selectBootupComponent } from '../selections'

// import components
import Toast from './Toast'
import Navbar from './Navbar'
import AppError from './AppError'
import AppLoading from './AppLoading'
import Modals from './modals/Modals'
import Routes from '../routes'
import MigratingBackend from './MigratingBackend'
import MigrationFailed from './MigrationFailed'
import IncompatibleBackend from './IncompatibleBackend'

// declare interface for props
export interface AppProps {
  loading: boolean
  bootupComponent: BootupComponentType
  session: Session
  selections: Selections
  apiConnection?: ApiConnection
  modal: Modal
  children: JSX.Element[] | JSX.Element

  push: (path: string) => void
  setModal: (modal: Modal) => Action
  setBootupComponent: (component: BootupComponentType) => Action

  bootstrap: () => Promise<ApiAction>
  pingApi: () => Promise<ApiAction>
}

// declare interface for state
interface AppState {
  showDragDrop: boolean
  debugLogPath: string
}

// declare class/function component
class AppComponent extends React.Component<AppProps, AppState> {
  constructor (props: AppProps) {
    super(props)

    this.state = {
      showDragDrop: false,
      debugLogPath: ''
    }

    this.handleCreateDataset = this.handleCreateDataset.bind(this)
    this.handlePullDataset = this.handlePullDataset.bind(this)
    this.handlePush = this.handlePush.bind(this)
    this.handleReload = this.handleReload.bind(this)
    this.handleSetDebugLogPath = this.handleSetDebugLogPath.bind(this)
    this.handleExportDebugLog = this.handleExportDebugLog.bind(this)
    this.handleIncompatibleBackend = this.handleIncompatibleBackend.bind(this)
    this.handleMigratingBackend = this.handleMigratingBackend.bind(this)
    this.handleMigrationFailure = this.handleMigrationFailure.bind(this)
    this.handleStartingBackend = this.handleStartingBackend.bind(this)
  }

  private handleStartingBackend () {
    console.log("started backend message received")
  }

  private handleCreateDataset () {
    this.props.setModal({ type: ModalType.CreateDataset })
  }

  private handlePullDataset () {
    this.props.setModal({ type: ModalType.PullDataset })
  }

  private handlePush (e: any, route: string) {
    this.props.push(route)
  }

  private handleReload () {
    remote.getCurrentWindow().reload()
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

  private handleIncompatibleBackend (_: Electron.IpcRendererEvent, ver: string) {
    this.props.setBootupComponent(ver)
  }

  private handleMigratingBackend () {
    this.props.setBootupComponent('migrating')
  }

  private handleMigrationFailure () {
    this.props.setBootupComponent('migrationFailure')
  }

  componentDidMount () {
    // handle ipc events from electron menus
    ipcRenderer.on('create-dataset', this.handleCreateDataset)
    ipcRenderer.on('pull-dataset', this.handlePullDataset)
    ipcRenderer.on('history-push', this.handlePush)
    ipcRenderer.on('set-debug-log-path', this.handleSetDebugLogPath)
    ipcRenderer.on('export-debug-log', this.handleExportDebugLog)
    ipcRenderer.on('reload', this.handleReload)
    ipcRenderer.on('incompatible-backend', this.handleIncompatibleBackend)
    ipcRenderer.on('migrating-backend', this.handleMigratingBackend)
    ipcRenderer.on('migration-failed', this.handleMigrationFailure)
    ipcRenderer.on("starting-backend", this.handleStartingBackend)

    ipcRenderer.send("app-fully-loaded")

    setInterval(() => {
      if (this.props.apiConnection !== 1) {
        this.props.pingApi()
      }
    }, DEFAULT_POLL_INTERVAL)

    if (this.props.apiConnection === 1) {
      this.props.bootstrap()
    }
  }

  componentWillUnmount () {
    ipcRenderer.removeListener('create-dataset', this.handleCreateDataset)
    ipcRenderer.removeListener('pull-dataset', this.handlePullDataset)
    ipcRenderer.removeListener('history-push', this.handlePush)
    ipcRenderer.removeListener('set-debug-log-path', this.handleSetDebugLogPath)
    ipcRenderer.removeListener('reload', this.handleReload)
    ipcRenderer.removeListener('incompatible-backend', this.handleIncompatibleBackend)
    ipcRenderer.removeListener('migrating-backend', this.handleMigratingBackend)
    ipcRenderer.removeListener('migration-failed', this.handleMigrationFailure)
    ipcRenderer.removeListener("starting-backend", this.handleStartingBackend)
  }

  componentDidUpdate (prevProps: AppProps) {
    if (this.props.session.id === '' && prevProps.apiConnection === 0 && this.props.apiConnection === 1) {
      this.props.bootstrap()
    }

    // this "wires up" all of the tooltips, must be called on update, as tooltips
    // in descendents can come and go
    ReactTooltip.rebuild()
  }

  render () {
    const { apiConnection, modal, loading, bootupComponent } = this.props

    if (loading) {
      return (
        <>
          <CSSTransition
            in={bootupComponent === 'loading'}
            classNames="fade"
            component="div"
            timeout={1000}
            mountOnEnter
            unmountOnExit
          >
            <AppLoading />
          </CSSTransition>
          <CSSTransition
            in={bootupComponent === 'migrating'}
            classNames="fade"
            component="div"
            timeout={1000}
            mountOnEnter
            unmountOnExit
          >
            <MigratingBackend />
          </CSSTransition>
          <CSSTransition
            in={bootupComponent === 'migrationFailure'}
            classNames="fade"
            component="div"
            timeout={1000}
            mountOnEnter
            unmountOnExit
          >
            <MigrationFailed />
          </CSSTransition>
          <CSSTransition
            in={bootupComponent !== 'loading' && bootupComponent !== 'migrating' && bootupComponent !== 'migrationFailure'}
            classNames="fade"
            component="div"
            timeout={1000}
            mountOnEnter
            unmountOnExit
          >
            <IncompatibleBackend incompatibleVersion={bootupComponent} />
          </CSSTransition>
        </>
      )
    }

    return (
      <div id='app' className='drag'
        style={{
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}>
        <CSSTransition
          in={apiConnection === -1}
          classNames="fade"
          component="div"
          timeout={1000}
          unmountOnExit
        >
          <AppError />
        </CSSTransition>
        <ConnectedRouter history={history}>
          <CSSTransition
            in={modal.type !== ModalType.NoModal}
            classNames='fade'
            component='div'
            timeout={300}
            unmountOnExit
          >
            <Modals type={modal.type} />
          </CSSTransition>
          <Navbar />
          <Routes />
        </ConnectedRouter>
        <Toast />
        {/*
          This adds react-tooltip to all children of the app component
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

// connect the component to the redux store
export default connectComponentToProps(
  // component
  AppComponent,
  // mapStateToProps function or object
  (state: any, ownProps: AppProps) => {
    const apiConnection = selectApiConnection(state)
    return {
      loading: apiConnection === 0 || selectSession(state).isLoading,
      session: selectSession(state),
      selections: selectSelections(state),
      apiConnection,
      modal: selectModal(state),
      bootupComponent: selectBootupComponent(state),
      ...ownProps
    }
  },
  // mapDispatchToProps function or object
  {
    push,
    setModal,
    bootstrap,
    setBootupComponent,
    pingApi
  }
)
