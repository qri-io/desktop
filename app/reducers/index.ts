import { combineReducers, Reducer, AnyAction } from 'redux'
import { routerReducer } from 'react-router-redux'
import { apiActionTypes } from '../utils/actionType'

import connectionReducer from './connection'
import uiReducer from './ui'
import selectionsReducer from './selections'
import myDatasetsReducer from './myDatasets'
import workingDatasetReducer from './workingDataset'
import commitDetailReducer from './commitDetail'
import mutationsReducer from './mutations'

import { Session } from '../models/session'

const initialSession: Session = {
  peername: '',
  id: '',
  created: '',
  updated: ''
}

const [SESSION_REQ, SESSION_SUCC, SESSION_FAIL] = apiActionTypes('session')
const [SIGNUP_REQ, SIGNUP_SUCC, SIGNUP_FAIL] = apiActionTypes('signup')
const [SIGNIN_REQ, SIGNIN_SUCC, SIGNIN_FAIL] = apiActionTypes('signin')

const sessionReducer: Reducer = (state = initialSession, action: AnyAction) => { // eslint-disable-line
  switch (action.type) {
    case SESSION_REQ:
    case SIGNUP_REQ:
    case SIGNIN_REQ:
      return state
    case SESSION_SUCC:
    case SIGNUP_SUCC:
    case SIGNIN_SUCC:
      return {
        ...state,
        ...action.payload.data
      }
    case SESSION_FAIL:
    case SIGNUP_FAIL:
    case SIGNIN_FAIL:
      return state
    default:
      return state
  }
}

const rootReducer = combineReducers({
  session: sessionReducer,
  connection: connectionReducer,
  ui: uiReducer,
  selections: selectionsReducer,
  myDatasets: myDatasetsReducer,
  workingDataset: workingDatasetReducer,
  commitDetails: commitDetailReducer,
  mutations: mutationsReducer,
  router: routerReducer
})

export default rootReducer
