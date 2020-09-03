import * as React from 'react'
import { Action } from 'redux'
import { CSSTransition } from 'react-transition-group'
import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

// import constants
import { DEFAULT_POLL_INTERVAL } from '../constants'

// import models
import { history } from './configureStore.webapp'
import { ApiAction } from '../store/api'
import { Selections, ApiConnection, BootupComponentType } from '../models/store'
import { Session } from '../models/session'

// import util funcs
import { connectComponentToProps } from '../utils/connectComponentToProps'

// import actions
import { pingApi } from '../actions/api'
import { bootstrap } from '../actions/session'

// import selections
import { selectApiConnection, selectSession } from '../selections'

// import components
import Toast from '../components/Toast'
import AppError from '../components/AppError'
import AppLoading from '../components/AppLoading'

// declare interface for props
export interface AppProps {
  loading: boolean
  session: Session
  selections: Selections
  apiConnection?: ApiConnection
  children: JSX.Element[] | JSX.Element

  push: (path: string) => void
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
  }

  componentDidMount () {
    setInterval(() => {
      if (this.props.apiConnection !== 1) {
        this.props.pingApi()
      }
    }, DEFAULT_POLL_INTERVAL)

    if (this.props.apiConnection === 1) {
      this.props.bootstrap()
    }
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
    const { apiConnection, loading } = this.props

    if (loading) {
      return <AppLoading />
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
          {/* <Navbar /> */}
          <Switch>
            <Route path='/' component={HelloWorld} />
          </Switch>
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
      ...ownProps,
      loading: apiConnection === 0 || selectSession(state).isLoading,
      session: selectSession(state),
      apiConnection
    }
  },
  // mapDispatchToProps function or object
  {
    bootstrap,
    pingApi
  }
)

const HelloWorld: React.FunctionComponent<> = () => {
  return <div>HELLO WORLD!</div>
}
