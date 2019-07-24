import { Reducer, AnyAction } from 'redux'
import { WorkingDataset, DatasetStatus, ComponentStatus } from '../models/store'
import { apiActionTypes } from '../store/api'

const initialState = {
  path: '',
  prevPath: '',
  peername: '',
  name: '',
  pages: {},
  diff: {},
  value: {},
  status: {},
  loading: false,
  bodyLoading: false,
  linkpath: null
}

const [DATASET_REQ, DATASET_SUCC, DATASET_FAIL] = apiActionTypes('dataset')
const [DATASET_HISTORY_REQ, DATASET_HISTORY_SUCC, DATASET_HISTORY_FAIL] = apiActionTypes('history')
const [DATASET_STATUS_REQ, DATASET_STATUS_SUCC, DATASET_STATUS_FAIL] = apiActionTypes('status')
const [DATASET_BODY_REQ, DATASET_BODY_SUCC, DATASET_BODY_FAIL] = apiActionTypes('body')

const workingDatasetsReducer: Reducer = (state = initialState, action: AnyAction): WorkingDataset | null => {
  switch (action.type) {
    case DATASET_REQ:
      return Object.assign({}, state, {
        value: Object.assign({}, state.value, {
          body: undefined
        }),
        loading: true
      })
    case DATASET_SUCC:
      const { name, path, peername, published, dataset: value } = action.payload.data
      return Object.assign({}, state, {
        name,
        path,
        peername,
        published,
        // DATASET_SUCCESS and BODY_SUCCESS both affect 'value'
        // can't simply assign because state.value doesn't exist on by default
        value: Object.assign({}, state.value, value),
        loading: false
      })
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
          const { component, filepath, status } = item
          obj[component] = { filepath, status }
          return obj
        }, {})
      // check filepath in the first element in the payload to determine whether the
      // dataset is linked
      let linkpath = null
      const { filepath } = action.payload.data[0]
      if (filepath !== 'repo') {
        linkpath = filepath.substring(0, (filepath.lastIndexOf('/')))
      }

      return Object.assign({}, state, {
        linkpath,
        status: statusObject
      })
    case DATASET_STATUS_FAIL:
      return state

    case DATASET_BODY_REQ:
      return Object.assign({}, state, {
        bodyLoading: true
      })
    case DATASET_BODY_SUCC:
      return Object.assign({}, state, {
        value: Object.assign({}, state.value, { body: action.payload.data }),
        bodyLoading: false
      })
    case DATASET_BODY_FAIL:
      return state

    default:
      return state
  }
}

export default workingDatasetsReducer
