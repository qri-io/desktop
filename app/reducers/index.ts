import { combineReducers, Reducer } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

const rootReducer = combineReducers({
  routing: routing as Reducer<any>
})

export default rootReducer
