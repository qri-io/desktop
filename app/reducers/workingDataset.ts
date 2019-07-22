import { Reducer, AnyAction } from 'redux'
import { WorkingDataset, DatasetStatus, ComponentStatus } from '../models/store'
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
      status: 'unmodified',
      errors: [],
      warnings: []
    },
    schema: {
      filepath: 'schema.json',
      status: 'unmodified',
      errors: [],
      warnings: []
    },
    body: {
      filepath: 'body.csv',
      status: 'unmodified',
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
const [DATASET_STATUS_REQ, DATASET_STATUS_SUCC, DATASET_STATUS_FAIL] = apiActionTypes('status')
const [DATASET_BODY_REQ, DATASET_BODY_SUCC, DATASET_BODY_FAIL] = apiActionTypes('body')

const workingDatasetsReducer: Reducer = (state = initialState, action: AnyAction): WorkingDataset => {
  switch (action.type) {
    case DATASET_REQ:
      return state
    case DATASET_SUCC:
      const { name, path, peername, published, dataset: value } = action.payload.data
      return Object.assign({}, state, { name, path, peername, published, value })
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

    case DATASET_STATUS_REQ:
      return state
    case DATASET_STATUS_SUCC:
      const statusObject: DatasetStatus = action.payload.data
        .reduce((obj: any, item: any): ComponentStatus => {
          const { path, filepath, status } = item
          obj[path] = { filepath, status }
          return obj
        }, {})

      // TODO (chriswhong) status endpoint does not include body, stub it in here for now
      statusObject.body = {
        filepath: 'somepath/body.csv',
        status: 'unmodified'
      }
      return Object.assign({}, state, {
        status: statusObject
      })
    case DATASET_STATUS_FAIL:
      return state

    case DATASET_BODY_REQ:
      return state
    case DATASET_BODY_SUCC:
      return Object.assign({}, state, {
        value: Object.assign({}, state.value, { body: action.payload.data })
      })
    case DATASET_BODY_FAIL:
      return state

    default:
      return state
  }
}

export default workingDatasetsReducer
