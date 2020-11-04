import React from 'react'
import ReactDOM from 'react-dom'
import 'regenerator-runtime/runtime'
import { Provider } from 'react-redux'
import ErrorHandler from '../components/ErrorHandler'
import App from '../components/App'
import configureStore from '../store/configureStore.webapp'

import '../app.global.scss'

ReactDOM.render(
  <Provider store={configureStore()}>
    <ErrorHandler>
      <App />
    </ErrorHandler>
  </Provider>,
  document.getElementById('root')
)
