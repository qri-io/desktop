import { combineReducers, Reducer } from 'redux'
import { routerReducer } from 'react-router-redux'

import uiReducer from './ui'
import selectionsReducer from './selections'
import myDatasetsReducer from './myDatasets'
import workingDatasetReducer from './workingDataset'
// import { workingHistoryReducer } from './workingHistory'

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
  // workingHistory: workingHistoryReducer
  router: routerReducer
})

export default rootReducer
