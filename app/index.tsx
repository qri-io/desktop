import * as React from 'react'
import * as ReactDOM from 'react-dom'
import RoutesContainer from './containers/RoutesContainer'
import { HashRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import './app.global.scss'

const { configureStore } = require('./store/configureStore') // eslint-disable-line
const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RoutesContainer/>
    </Router>
  </Provider>,
  document.getElementById('root')
)
