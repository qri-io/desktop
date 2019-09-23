import { Reducer, AnyAction } from 'redux'
import { MyDatasets } from '../models/store'
import { apiActionTypes } from '../utils/actionType'
import { reducerWithPagination, initialPageInfo } from '../utils/pagination'

export const MYDATASETS_SET_FILTER = 'MYDATASETS_SET_FILTER'
export const RESET_MY_DATASETS = 'RESET_MY_DATASETS'

const initialState: MyDatasets = {
  pageInfo: initialPageInfo,
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
          pageInfo: reducerWithPagination(action)
        }
      }
      return {
        ...state,
        pageInfo: reducerWithPagination(action, state.pageInfo)
      }
    case LIST_SUCC:
      return {
        ...state,
        pageInfo: reducerWithPagination(action, state.pageInfo),
        value: state.value.concat(action.payload.data),
        filter: ''
      }
    case LIST_FAIL:
      return {
        ...state,
        pageInfo: reducerWithPagination(action, state)
      }

    case RESET_MY_DATASETS:
      return initialState
  }

  return state
}

export default myDatasetsReducer
