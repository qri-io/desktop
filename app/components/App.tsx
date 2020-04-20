import * as React from 'react'
import { Action, Dispatch, bindActionCreators } from 'redux'
import { CSSTransition } from 'react-transition-group'
import { ConnectedRouter, push } from 'connected-react-router'
import { ipcRenderer, remote } from 'electron'
import fs from 'fs'
import ReactTooltip from 'react-tooltip'
import { connect } from 'react-redux'

// import constants
import { DEFAULT_POLL_INTERVAL } from '../constants'

// import models
import { history } from '../store/configureStore.development'
import { ApiAction } from '../store/api'
import { Modal, ModalType } from '../models/modals'
import { Selections, ApiConnection } from '../models/store'
import { Session } from '../models/session'

// import actions
import { setModal } from '../actions/ui'
import { pingApi } from '../actions/api'
import { bootstrap } from '../actions/session'

// import selections
import { selectSelections, selectModal, selectApiConnection, selectSession } from '../selections'

// import components
import Toast from './Toast'
import Navbar from './Navbar'
import AppError from './AppError'
import AppLoading from './AppLoading'
import Modals from './modals/Modals'
import RoutesContainer from '../containers/RoutesContainer'

export interface AppProps {
  loading: boolean
  session: Session
  selections: Selections
  apiConnection?: ApiConnection
  modal: Modal
  children: JSX.Element[] | JSX.Element

  push: (path: string) => void
  setModal: (modal: Modal) => Action

  bootstrap: () => Promise<ApiAction>
  pingApi: () => Promise<ApiAction>
}

interface AppState {
  showDragDrop: boolean
  debugLogPath: string
}

class AppComponent extends React.Component<AppProps, AppState> {
  constructor (props: AppProps) {
    super(props)

    this.state = {
      showDragDrop: false,
      debugLogPath: ''
    }

    this.handleCreateDataset = this.handleCreateDataset.bind(this)
    this.handleAddDataset = this.handleAddDataset.bind(this)
    this.handlePush = this.handlePush.bind(this)
    this.handleReload = this.handleReload.bind(this)
    this.handleSetDebugLogPath = this.handleSetDebugLogPath.bind(this)
    this.handleExportDebugLog = this.handleExportDebugLog.bind(this)
  }

  private handleCreateDataset () {
    this.props.setModal({ type: ModalType.CreateDataset })
  }

  private handleAddDataset () {
    this.props.setModal({ type: ModalType.AddDataset })
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

  componentDidMount () {
    // handle ipc events from electron menus
    ipcRenderer.on('create-dataset', this.handleCreateDataset)
    ipcRenderer.on('add-dataset', this.handleAddDataset)
    ipcRenderer.on('history-push', this.handlePush)
    ipcRenderer.on('set-debug-log-path', this.handleSetDebugLogPath)
    ipcRenderer.on('export-debug-log', this.handleExportDebugLog)
    ipcRenderer.on('reload', this.handleReload)

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
    ipcRenderer.removeListener('add-dataset', this.handleAddDataset)
    ipcRenderer.removeListener('history-push', this.handlePush)
    ipcRenderer.removeListener('set-debug-log-path', this.handleSetDebugLogPath)
    ipcRenderer.removeListener('reload', this.handleReload)
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
    const { apiConnection, modal, loading } = this.props

    if (loading) {
      return (
        <CSSTransition
          in={loading}
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
          <RoutesContainer />
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

const mapStateToProps = (state: any, ownProps: AppProps) => {
  const apiConnection = selectApiConnection(state)
  return {
    loading: apiConnection === 0 || selectSession(state).isLoading,
    session: selectSession(state),
    selections: selectSelections(state),
    apiConnection,
    modal: selectModal(state),
    ...ownProps
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    push,
    setModal,
    bootstrap,
    pingApi
  }, dispatch)
}

const mergeProps = (props: any, actions: any): AppProps => {
  return { ...props, ...actions }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AppComponent)
