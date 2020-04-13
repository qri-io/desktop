import { Reducer, AnyAction } from 'redux'

import { Log } from '../models/store'
import { apiActionTypes } from '../utils/actionType'
import { reducerWithPagination } from '../utils/pagination'

const initialState: Log = {
  pageInfo: {
    isFetching: true,
    page: 0,
    fetchedAll: false,
    pageSize: 0
  },
  value: []
}

export const [HISTORY_REQ, HISTORY_SUCC, HISTORY_FAIL] = apiActionTypes('history')

const logReducer: Reducer = (state = initialState, action: AnyAction): Log | null => {
  switch (action.type) {
    case HISTORY_REQ:
      return {
        ...state,
        pageInfo: reducerWithPagination(action, state.pageInfo),
        value: action.pageInfo.page === 1 ? [] : state.value
      }
    case HISTORY_SUCC:
      return {
        ...state,
        value: [
          ...state.value,
          ...action.payload.data
        ],
        pageInfo: reducerWithPagination(action, state.pageInfo)
      }
    case HISTORY_FAIL:
      return {
        ...state,
        pageInfo: reducerWithPagination(action, state.log.pageInfo)
      }
    default:
      return state
  }
}

export default logReducer
