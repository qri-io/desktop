import * as React from 'react'
import { Redirect } from 'react-router'
import { ApiAction } from '../store/api'
import { CSSTransition } from 'react-transition-group'
import CreateDataset from './modals/CreateDataset'
import AddDataset from './modals/AddDataset'
import NoDatasets from './NoDatasets'
import { Modal, ModalType, NoModal } from '../models/modals'
import AppLoading from './AppLoading'

interface AppProps {
  fetchSession: () => Promise<ApiAction>
  fetchMyDatasets: () => Promise<ApiAction>
  hasDatasets: boolean
  loading: boolean
  children: any
  sessionID: string
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
    this.props.fetchMyDatasets()
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
          <CreateDataset onSubmit={() => this.setState({ currentModal: NoModal })} onDismissed={() => this.setState({ currentModal: NoModal })}/>
        )
      case ModalType.AddDataset:
        return (
          <AddDataset onSubmit={() => this.setState({ currentModal: NoModal })} onDismissed={() => this.setState({ currentModal: NoModal })}/>
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
    if (!this.props.hasAcceptedTOS || !this.props.hasSetPeername) {
      return <Redirect to='/onboard' />
    }
    const { children } = this.props
    return (<div style={{ height: '100%' }}>
      {this.renderAppLoading()}
      {this.renderModal()}
      {this.renderNoDatasets()}
      {children}
    </div>)
  }
}
