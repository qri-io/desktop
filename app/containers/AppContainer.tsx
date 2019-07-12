import { connect } from 'react-redux'
import App from '../components/App'
import { setSidebarTab } from '../actions/app'
import { IState } from '../reducers'

const AppContainer = connect(
  (state: IState, ownProps) => {
    return Object.assign({
      activeTab: state.app.activeTab
    }, ownProps)
  },
  {
    setSidebarTab
  }
)(App)

export default AppContainer
