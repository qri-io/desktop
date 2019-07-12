import { combineReducers, Reducer } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import appReducer, { IAppState } from './app'

export interface IState {
  app: IAppState
  routing: Reducer<any>
}

const rootReducer = combineReducers<IState>({
  app: appReducer,
  routing: routing as Reducer<any>
})

export default rootReducer
