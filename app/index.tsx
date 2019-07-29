import * as React from 'react'
import * as ReactDOM from 'react-dom'
import AppContainer from './containers/AppContainer'
import { Provider } from 'react-redux'
import './app.global.scss'

const { configureStore } = require('./store/configureStore') // eslint-disable-line
const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
)
