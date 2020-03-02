import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'regenerator-runtime/runtime'
import { Provider } from 'react-redux'
import ErrorHandler from './components/ErrorHandler'
import AppContainer from './containers/AppContainer'

import './app.global.scss'

if ((module as any).hot) {
  (module as any).hot.accept()
}

const { store } = require('./store/configureStore') // eslint-disable-line

ReactDOM.render(
  <Provider store={store}>
    <ErrorHandler>
      <AppContainer />
    </ErrorHandler>
  </Provider>,
  document.getElementById('root')
)
