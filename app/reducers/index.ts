import { combineReducers, Reducer } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import myDatasets from './myDatasets'
import workingDataset from './workingDataset'

const rootReducer = combineReducers({
  routing: routing as Reducer<any>,
  myDatasets,
  workingDataset
})

export default rootReducer
