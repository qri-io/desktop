import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { createHashHistory } from 'history'
import { routerMiddleware, push } from 'react-router-redux'
// import { createLogger } from 'redux-logger'
import rootReducer from '../reducers'
import { apiMiddleware } from './api'

declare const window: Window & {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?(a: any): void
}

declare const module: NodeModule & {
  hot?: {
    accept(...args: any[]): any
  }
}

const actionCreators = Object.assign({},
  { push }
)

const history = createHashHistory()
const router = routerMiddleware(history)

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */
const composeEnhancers: typeof compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
    actionCreators,
    actionsBlacklist: [
      'API_STATUS_REQUEST',
      'API_STATUS_SUCCESS',
      'API_HEALTH_REQUEST',
      'API_HEALTH_SUCCESS'
    ]
  }) as any
  : compose
/* eslint-enable no-underscore-dangle */
const enhancer = composeEnhancers(
  applyMiddleware(thunk, router, apiMiddleware)
)

const configureStore = (initialState: Object | void) => {
  const store = createStore(rootReducer, initialState as any, enhancer)

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
    )
  }

  return store
}

export default configureStore()
