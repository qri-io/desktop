import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import AppContainer from './containers/AppContainer'

import './app.global.scss'

if ((module as any).hot) {
  (module as any).hot.accept()
}

const { store } = require('./store/configureStore') // eslint-disable-line

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
)
