import { combineReducers, Reducer } from 'redux'
import { routerReducer } from 'react-router-redux'

import uiReducer from './ui'
import selectionsReducer from './selections'
import myDatasetsReducer from './myDatasets'
import workingDatasetReducer from './workingDataset'
import commitDetailReducer from './commitDetail'

const initialSession = 'QmcASWzDc4mGG4q8kfiZ4A9KTQGyYxKvMaVh4dWZn9oFwT'

const sessionReducer: Reducer = (state = initialSession) => { // eslint-disable-line
  return state
}

const rootReducer = combineReducers({
  session: sessionReducer,
  ui: uiReducer,
  selections: selectionsReducer,
  myDatasets: myDatasetsReducer,
  workingDataset: workingDatasetReducer,
  commitDetail: commitDetailReducer,
  router: routerReducer
})

export default rootReducer
