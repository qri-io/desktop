import { connect } from 'react-redux'
import App from '../components/App'
import Store from '../models/store'

const AppContainer = connect(
  (state: Store) => {
    const { ui } = state
    return { ui }
  },
  {}
)(App)

export default AppContainer
