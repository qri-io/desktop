import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createHashHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from '../reducers'
import { apiMiddleware } from './api'
import wsMiddleware from './wsMiddleware'

const history = createHashHistory()
const router = routerMiddleware(history)
const enhancer = applyMiddleware(thunk, router, apiMiddleware, wsMiddleware)

const configureStore = (initialState: Object | void) => {
  return createStore(createRootReducer(history), initialState as any, enhancer)
}

export default configureStore()
