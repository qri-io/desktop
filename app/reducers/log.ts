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

export const [LOG_REQ, LOG_SUCC, LOG_FAIL] = apiActionTypes('log')

const logReducer: Reducer = (state = initialState, action: AnyAction): Log | null => {
  switch (action.type) {
    case LOG_REQ:
      return {
        ...state,
        pageInfo: reducerWithPagination(action, state.pageInfo),
        value: action.pageInfo.page === 1 ? [] : state.value
      }
    case LOG_SUCC:
      return {
        ...state,
        value: [
          ...state.value,
          ...action.payload.data
        ],
        pageInfo: reducerWithPagination(action, state.pageInfo)
      }
    case LOG_FAIL:
      return {
        ...state,
        pageInfo: reducerWithPagination(action, state.pageInfo)
      }
    default:
      return state
  }
}

export default logReducer
