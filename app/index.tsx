import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Routes from './Routes'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import './app.global.scss'

const { configureStore } = require('./store/configureStore');
const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Routes/>
    </Router>
  </Provider>,
  document.getElementById('root')
)