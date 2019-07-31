import { combineReducers, Reducer, AnyAction } from 'redux'
import { routerReducer } from 'react-router-redux'
import { apiActionTypes } from '../store/api'

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
const [SET_PEERNAME_REQ, SET_PEERNAME_SUCC, SET_PEERNAME_FAIL] = apiActionTypes('set_peername')

const sessionReducer: Reducer = (state = initialSession, action: AnyAction) => { // eslint-disable-line
  switch (action.type) {
    case SESSION_REQ || SET_PEERNAME_REQ:
      return state
    case SESSION_SUCC || SET_PEERNAME_SUCC:
      return Object.assign({}, state, action.payload.data)
    case SESSION_FAIL || SET_PEERNAME_FAIL:
      return state
    default:
      return state
  }
}

const rootReducer = combineReducers({
  session: sessionReducer,
  ui: uiReducer,
  selections: selectionsReducer,
  myDatasets: myDatasetsReducer,
  workingDataset: workingDatasetReducer,
  commitDetails: commitDetailReducer,
  mutations: mutationsReducer,
  router: routerReducer
})

export default rootReducer
