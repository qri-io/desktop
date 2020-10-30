import React from 'react'
import { Action } from 'redux'
import { CSSTransition } from 'react-transition-group'
import { ConnectedRouter, push } from 'connected-react-router'
import fs from 'fs'
import ReactTooltip from 'react-tooltip'

// platform specific imports
import {
  addRendererListener,
  removeRendererListener,
  sendElectronEventToMain,
  saveDialogSync,
  reloadWindow
} from './platformSpecific/App.TARGET_PLATFORM'

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
import NavSidebar from './nav/NavSidebar'
import AppError from './AppError'
import AppLoading from './AppLoading'
import Modals from './modals/Modals'
import Routes from '../routes'
import MigratingBackend from './MigratingBackend'
import MigrationFailed from './MigrationFailed'
import IncompatibleBackend from './IncompatibleBackend'

const defaultPhoto = require('../assets/default_46x46.png') //eslint-disable-line

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

    this.handleNewDataset = this.handleNewDataset.bind(this)
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

  private handleNewDataset () {
    this.props.setModal({ type: ModalType.NewDataset })
  }

  private handlePullDataset () {
    this.props.setModal({ type: ModalType.PullDataset })
  }

  private handlePush (e: any, route: string) {
    this.props.push(route)
  }

  private handleReload () {
    reloadWindow()
  }

  private handleSetDebugLogPath (_e: any, path: string) {
    this.setState({ debugLogPath: path })
  }

  private handleExportDebugLog () {
    const exportFilename: string | undefined = saveDialogSync({
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

  private handleIncompatibleBackend (_: any, ver: string) {
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
    addRendererListener('create-dataset', this.handleNewDataset)
    addRendererListener('pull-dataset', this.handlePullDataset)
    addRendererListener('history-push', this.handlePush)
    addRendererListener('set-debug-log-path', this.handleSetDebugLogPath)
    addRendererListener('export-debug-log', this.handleExportDebugLog)
    addRendererListener('reload', this.handleReload)
    addRendererListener('incompatible-backend', this.handleIncompatibleBackend)

    // listen for communication from the main process
    addRendererListener('migrating-backend', this.handleMigratingBackend)
    addRendererListener('migration-failed', this.handleMigrationFailure)
    addRendererListener('starting-backend', this.handleStartingBackend)

    sendElectronEventToMain('app-fully-loaded')

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
    removeRendererListener('create-dataset', this.handleNewDataset)
    removeRendererListener('pull-dataset', this.handlePullDataset)
    removeRendererListener('history-push', this.handlePush)
    removeRendererListener('set-debug-log-path', this.handleSetDebugLogPath)
    removeRendererListener('reload', this.handleReload)
    removeRendererListener('incompatible-backend', this.handleIncompatibleBackend)
    removeRendererListener('migrating-backend', this.handleMigratingBackend)
    removeRendererListener('migration-failed', this.handleMigrationFailure)
    removeRendererListener('starting-backend', this.handleStartingBackend)
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
          <NavSidebar />
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
          delayShow={1000}
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
