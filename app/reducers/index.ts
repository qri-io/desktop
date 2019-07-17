import { combineReducers, Reducer } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import myDatasets from './myDatasets'

const rootReducer = combineReducers({
  routing: routing as Reducer<any>,
  myDatasets
})

export default rootReducer
