import * as React from 'react'
import { ApiAction } from '../store/api'
import { CSSTransition } from 'react-transition-group'
import CreateDataset from './modals/CreateDataset'
import AddDataset from './modals/AddDataset'
import NoDatasets from './NoDatasets'
import Onboard from './Onboard'
import { Modal, ModalType, NoModal } from '../models/modals'
import AppLoading from './AppLoading'
import { Action } from 'redux'

interface AppProps {
  fetchSession: () => Promise<ApiAction>
  fetchMyDatasetsAndLinks: () => Promise<ApiAction>
  addDataset: (peername: string, name: string) => Promise<ApiAction>
  initDataset: (path: string, name: string, format: string) => Promise<ApiAction>
  acceptTOS: () => Action
  setPeername: () => Action
  hasDatasets: boolean
  loading: boolean
  children: any
  sessionID: string
  peername: string
  hasAcceptedTOS: boolean
  hasSetPeername: boolean
}

interface AppState {
  currentModal: Modal
  sessionID: string
}

export default class App extends React.Component<AppProps, AppState> {
  readonly state = { currentModal: NoModal, sessionID: this.props.sessionID }

  componentDidMount () {
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

    switch (Modal.type) {
      case ModalType.CreateDataset:
        return (
          <CreateDataset onSubmit={this.props.initDataset} onDismissed={() => this.setState({ currentModal: NoModal })}/>
        )
      case ModalType.AddDataset:
        return (
          <AddDataset onSubmit={this.props.addDataset} onDismissed={() => this.setState({ currentModal: NoModal })}/>
        )
      default:
        return null
    }
  }

  private renderNoDatasets () {
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

  render () {
    const {
      children,
      hasSetPeername,
      hasAcceptedTOS,
      peername,
      acceptTOS,
      setPeername
    } = this.props
    return (<div style={{ height: '100%' }}>
      {this.renderAppLoading()}
      {this.renderModal()}
      <Onboard
        peername={peername}
        hasAcceptedTOS={hasAcceptedTOS}
        hasSetPeername={hasSetPeername}
        setPeername={setPeername}
        acceptTOS={acceptTOS}
      />
      {this.renderNoDatasets()}
      {children}
    </div>)
  }
}
