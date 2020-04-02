import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'regenerator-runtime/runtime'
import { Provider } from 'react-redux'
import ErrorHandler from './components/ErrorHandler'
import App from './components/App'

import './app.global.scss'

if ((module as any).hot) {
  (module as any).hot.accept()
}

const { store } = require('./store/configureStore') // eslint-disable-line

ReactDOM.render(
  <Provider store={store}>
    <ErrorHandler>
      <App />
    </ErrorHandler>
  </Provider>,
  document.getElementById('root')
)
