import { Reducer, AnyAction } from 'redux'
import { MyDatasets } from '../models/store'
import { apiActionTypes } from '../store/api'

const initialState: MyDatasets = {
  pageInfo: {
    isFetching: false,
    pageCount: 0,
    fetchedAll: false,
    error: ''
  },
  value: [],
  filter: ''
}

const [LIST_REQ, LIST_SUCC, LIST_FAIL] = apiActionTypes('list')

const myDatasetsReducer: Reducer = (state = initialState, action: AnyAction): MyDatasets => {
  switch (action.type) {
    case LIST_REQ:
      return Object.assign({}, state, {
        pageInfo: {
          isFetching: true,
          // TODO (b5) - update pagination details!
          pageCount: 0,
          fetchedAll: false,
          error: ''
        }
      })
    case LIST_SUCC:
      return {
        pageInfo: {
          isFetching: false,
          // TODO (b5) - update pagination details!
          pageCount: 1,
          fetchedAll: false,
          error: ''
        },
        value: action.payload,
        filter: ''
      }
    case LIST_FAIL:
      return Object.assign({}, state, {
        pageInfo: {
          isFetching: true,
          // TODO (b5) - update pagination details!
          pageCount: 0,
          fetchedAll: false,
          error: ''
        }
      })
  }

  return state
}

export default myDatasetsReducer
