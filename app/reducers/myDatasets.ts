import { Reducer, AnyAction } from 'redux'
import { MyDatasets } from '../models/store'
import { apiActionTypes } from '../utils/actionType'
import { withPagination } from './page'

export const MYDATASETS_SET_FILTER = 'MYDATASETS_SET_FILTER'
export const RESET_MY_DATASETS = 'RESET_MY_DATASETS'

const initialState: MyDatasets = {
  pageInfo: {
    isFetching: false,
    page: 0,
    pageSize: 0,
    fetchedAll: false,
    error: ''
  },
  value: [],
  filter: ''
}

const [LIST_REQ, LIST_SUCC, LIST_FAIL] = apiActionTypes('list')

const myDatasetsReducer: Reducer = (state = initialState, action: AnyAction): MyDatasets => {
  switch (action.type) {
    case MYDATASETS_SET_FILTER:
      const { filter } = action.payload
      return { ...state, filter }

    case LIST_REQ:
      if (action.pageInfo.page === 1) {
        return {
          ...initialState,
          pageInfo: action.pageInfo
        }
      }
      return {
        ...state,
        pageInfo: withPagination(action, state.pageInfo)
      }
    case LIST_SUCC:
      return {
        ...state,
        pageInfo: withPagination(action, state.pageInfo),
        value: state.value.concat(action.payload.data),
        filter: ''
      }
    case LIST_FAIL:
      return {
        ...state,
        pageInfo: withPagination(action, state)
      }

    case RESET_MY_DATASETS:
      return initialState
  }

  return state
}

export default myDatasetsReducer
