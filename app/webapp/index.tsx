import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'regenerator-runtime/runtime'
import { Provider } from 'react-redux'
// import ErrorHandler from '../components/ErrorHandler'
import Webapp from './webapp'
import configureStore from './configureStore.webapp'

import '../app.global.scss'

ReactDOM.render(
  <Provider store={configureStore()}>
    <Webapp name={"Kasey"}/>
  </Provider>,
  document.getElementById('root')
)
