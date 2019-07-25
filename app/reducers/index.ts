import { combineReducers, Reducer } from 'redux'
import { routerReducer } from 'react-router-redux'

import uiReducer from './ui'
import selectionsReducer from './selections'
import myDatasetsReducer from './myDatasets'
import workingDatasetReducer from './workingDataset'
import commitDetailReducer from './commitDetail'

import { Session } from '../models/session'

const initialSession: Session = {
  peername: '',
  id: '',
  created: '',
  updated: ''
}

const sessionReducer: Reducer = (state = initialSession) => { // eslint-disable-line
  return state
}

const rootReducer = combineReducers({
  session: sessionReducer,
  ui: uiReducer,
  selections: selectionsReducer,
  myDatasets: myDatasetsReducer,
  workingDataset: workingDatasetReducer,
  commitDetails: commitDetailReducer,
  router: routerReducer
})

export default rootReducer
