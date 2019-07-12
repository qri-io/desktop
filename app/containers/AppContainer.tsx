import { connect } from 'react-redux'
import App from '../components/App'
import { IState } from '../reducers'

const AppContainer = connect(
  (state: IState, ownProps) => {
    return Object.assign({}, ownProps)
  },
  {}
)(App)

export default AppContainer
