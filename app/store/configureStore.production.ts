import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from '../reducers'
import { apiMiddleware } from './api'

const history = createBrowserHistory()
const router = routerMiddleware(history)
const enhancer = applyMiddleware(thunk, router, apiMiddleware)

const configureStore = (initialState: Object | void) => {
  return createStore(createRootReducer(history), initialState as any, enhancer)
}

export default configureStore()
