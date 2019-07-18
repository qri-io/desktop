import { Reducer, AnyAction } from 'redux'
import { WorkingDataset } from '../models/store'
import { apiActionTypes } from '../store/api'

const initialState: WorkingDataset = {
  path: '',
  prevPath: '',
  peername: '',
  name: '',
  pages: {},
  diff: {},
  value: {},
  status: {
    meta: {
      filepath: 'meta.json',
      status: 'unchanged',
      errors: [],
      warnings: []
    },
    schema: {
      filepath: 'schema.json',
      status: 'unchanged',
      errors: [],
      warnings: []
    },
    body: {
      filepath: 'body.csv',
      status: 'unchanged',
      errors: [],
      warnings: []
    }
  },
  history: {
    pageInfo: {
      isFetching: false,
      pageCount: 0,
      fetchedAll: false,
      error: ''
    },
    value: []
  }
}

const [DATASET_REQ, DATASET_SUCC, DATASET_FAIL] = apiActionTypes('dataset')
const [DATASET_HISTORY_REQ, DATASET_HISTORY_SUCC, DATASET_HISTORY_FAIL] = apiActionTypes('history')

const workingDatasetsReducer: Reducer = (state = initialState, action: AnyAction): WorkingDataset => {
  switch (action.type) {
    case DATASET_REQ:
      return state
    case DATASET_SUCC:
      return Object.assign({}, state, action.payload.data)
    case DATASET_FAIL:
      return state

    case DATASET_HISTORY_REQ:
      return state
    case DATASET_HISTORY_SUCC:
      return Object.assign({}, state, {
        history: {
          value: action.payload.data
        }
      })
    case DATASET_HISTORY_FAIL:
      return state

    default:
      return state
  }
}

export default workingDatasetsReducer
