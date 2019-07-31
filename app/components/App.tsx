import * as React from 'react'
import { Action } from 'redux'
import { CSSTransition } from 'react-transition-group'

// import components
import Toast from './Toast'
import Onboard from './Onboard'
import AppError from './AppError'
import AppLoading from './AppLoading'
import NoDatasets from './NoDatasets'
import CreateDataset from './modals/CreateDataset'
import AddDataset from './modals/AddDataset'
import DatasetContainer from '../containers/DatasetContainer'

// import models
import { ApiAction } from '../store/api'
import { Modal, ModalType, NoModal } from '../models/modals'
import { Toast as IToast } from '../models/store'

interface AppProps {
  hasDatasets: boolean
  loading: boolean
  sessionID: string
  peername: string
  apiConnection?: number
  hasAcceptedTOS: boolean
  hasSetPeername: boolean
  toast: IToast
  fetchSession: () => Promise<ApiAction>
  fetchMyDatasetsAndLinks: () => Promise<ApiAction>
  addDataset: (peername: string, name: string) => Promise<ApiAction>
  initDataset: (path: string, name: string, format: string) => Promise<ApiAction>
  acceptTOS: () => Action
  setHasSetPeername: () => Action
  setPeername: (newPeername: string) => Promise<ApiAction>
  closeToast: () => Action
  setApiConnection: (status: number) => Action
  pingApi: () => Promise<ApiAction>
}

interface AppState {
  currentModal: Modal
  sessionID: string
}

export default class App extends React.Component<AppProps, AppState> {
  constructor (props: AppProps) {
    super(props)

    this.state = {
      currentModal: NoModal,
      sessionID: this.props.sessionID
    }

    this.renderModal = this.renderModal.bind(this)
    this.renderNoDatasets = this.renderNoDatasets.bind(this)
    this.renderAppLoading = this.renderAppLoading.bind(this)
    this.renderAppError = this.renderAppError.bind(this)
  }

  componentDidMount () {
    if (this.props.apiConnection === 0) {
      var iter = 0
      const pingTimer = setInterval(() => {
        if (iter > 30) {
          this.props.setApiConnection(-1)
          clearInterval(pingTimer)
        }
        this.props.pingApi()
        iter++
      }, 850)
    }
    this.props.fetchSession()
    this.props.fetchMyDatasetsAndLinks()
  }

  static getDerivedStateFromProps (NextProps: AppProps, PrevState: AppState) {
    if (PrevState.sessionID !== NextProps.sessionID) {
      return { sessionID: NextProps.sessionID }
    }
    return null
  }

  private renderModal (): JSX.Element | null {
    // Hide any dialogs while we're displaying an error
    // if (errors) {
    //   return null
    // }
    const Modal = this.state.currentModal

    return (
      <div >
        <CSSTransition
          in={ModalType.CreateDataset === Modal.type}
          classNames='fade'
          component='div'
          timeout={300}
          unmountOnExit
        >
          <CreateDataset onSubmit={this.props.initDataset} onDismissed={() => this.setState({ currentModal: NoModal })}/>
        </CSSTransition>
        <CSSTransition
          in={ModalType.AddDataset === Modal.type}
          classNames='fade'
          component='div'
          timeout={300}
          unmountOnExit
        >
          <AddDataset onSubmit={this.props.addDataset} onDismissed={() => this.setState({ currentModal: NoModal })}/>
        </CSSTransition>
      </div>
    )
  }

  private renderNoDatasets () {
    console.log(this.props.hasDatasets)
    return (
      <CSSTransition
        in={!this.props.hasDatasets}
        classNames="fade"
        component="div"
        timeout={1000}
        unmountOnExit
      >
        < NoDatasets setModal={(modal: Modal) => this.setState({ currentModal: modal })}/>
      </CSSTransition>
    )
  }

  private renderAppLoading () {
    console.log(this.props.loading)
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
      hasSetPeername,
      hasAcceptedTOS,
      peername,
      acceptTOS,
      setPeername,
      toast,
      closeToast,
      setHasSetPeername
    } = this.props
    return (<div style={{
      height: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {this.renderAppLoading()}
      {this.renderAppError()}
      {this.renderModal()}
      <Onboard
        peername={peername}
        hasAcceptedTOS={hasAcceptedTOS}
        hasSetPeername={hasSetPeername}
        setHasSetPeername={setHasSetPeername}
        setPeername={setPeername}
        acceptTOS={acceptTOS}
      />
      {this.renderNoDatasets()}
      { this.props.hasDatasets && <DatasetContainer /> }
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.visible}
        timeout={3000}
        onClose={closeToast}
      />
    </div>)
  }
}
