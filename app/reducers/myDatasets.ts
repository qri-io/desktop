import { Reducer, AnyAction } from 'redux'
import { MyDatasets } from '../models/store'

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

const myDatasetsReducer: Reducer = (state = initialState, action: AnyAction): MyDatasets => {
  if (action.type === 'API_LIST_SUCCESS') {
    return {
      pageInfo: {
        isFetching: false,
        pageCount: 0,
        fetchedAll: false,
        error: ''
      },
      value: action.payload,
      filter: ''
    }
  }

  return state
}

export default myDatasetsReducer
