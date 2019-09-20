import { AnyAction } from 'redux'
import { getActionType, isApiAction } from '../utils/actionType'

export const FAILED_TO_FETCH = 'FAILED_TO_FETCH'
export const SET_API_CONNECTION = 'SET_API_CONNECTION'

const initialState = {
  apiConnection: 0,
  failedToFetchCount: 0
}

export default (state = initialState, action: AnyAction) => {
  // if an api action succeeds, we are no longer in an
  // unconnected state!
  if (isApiAction(action.type) && getActionType(action) === 'success') {
    if (state.apiConnection !== 1 || state.failedToFetchCount > 0) {
      return {
        apiConnection: 1,
        failedToFetchCount: 0
      }
    }
    return state
  }
  switch (action.type) {
    case FAILED_TO_FETCH:
      if (state.failedToFetchCount >= 14) {
        return {
          failedToFetchCount: 0,
          apiConnection: -1
        }
      }
      return {
        ...state,
        failedToFetchCount: state.failedToFetchCount + 1
      }
    default:
      return state
  }
}
