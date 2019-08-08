import { Reducer, AnyAction } from 'redux'
import { WorkingDataset, DatasetStatus, ComponentStatus } from '../models/store'
import { apiActionTypes } from '../store/api'
import { withPagination } from './page'

const initialState: WorkingDataset = {
  path: '',
  prevPath: '',
  peername: '',
  name: '',
  status: {},
  isLoading: true,
  linkpath: null,
  components: {
    body: {
      value: [],
      pageInfo: {
        isFetching: true,
        page: 0,
        pageSize: 100,
        fetchedAll: false
      }
    },
    meta: {
      value: {}
    },
    schema: {
      value: {}
    }
  },
  history: {
    pageInfo: {
      isFetching: true,
      page: 0,
      fetchedAll: false,
      pageSize: 0
    },
    value: []
  }
}

const [DATASET_REQ, DATASET_SUCC, DATASET_FAIL] = apiActionTypes('dataset')
const [DATASET_HISTORY_REQ, DATASET_HISTORY_SUCC, DATASET_HISTORY_FAIL] = apiActionTypes('history')
const [DATASET_STATUS_REQ, DATASET_STATUS_SUCC, DATASET_STATUS_FAIL] = apiActionTypes('status')
const [DATASET_BODY_REQ, DATASET_BODY_SUCC, DATASET_BODY_FAIL] = apiActionTypes('body')

const workingDatasetsReducer: Reducer = (state = initialState, action: AnyAction): WorkingDataset | null => {
  switch (action.type) {
    case DATASET_REQ:
      return initialState
    case DATASET_SUCC:
      const { name, path, peername, published, dataset } = action.payload.data
      return {
        ...state,
        name,
        path,
        peername,
        published,
        isLoading: false,
        components: {
          body: {
            pageInfo: {
              ...state.components.body.pageInfo
            },
            value: state.components.body.value
          },
          meta: {
            value: dataset.meta
          },
          schema: {
            value: dataset.structure.schema
          }
        }
      }
    case DATASET_FAIL:
      return {
        ...state,
        isLoading: false
      }

    case DATASET_HISTORY_REQ:
      return {
        ...state,
        history: {
          ...state.history,
          pageInfo: withPagination(action, state.history.pageInfo),
          value: action.pageInfo.page === 1 ? [] : [].concat(state.history.value)
        }
      }
    case DATASET_HISTORY_SUCC:
      return {
        ...state,
        history: {
          ...history,
          value: state.history.value
            ? state.history.value.concat(action.payload.data)
            : action.payload.data,
          pageInfo: withPagination(action, state.history.pageInfo)
        }
      }
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

      return {
        ...state,
        linkpath,
        status: statusObject
      }
    case DATASET_STATUS_FAIL:
      return state

    case DATASET_BODY_REQ:
      return {
        ...state,
        components: {
          ...state.components,
          body: {
            ...state.components.body,
            pageInfo: {
              ...state.components.body.pageInfo,
              isFetching: true,
              fetchedAll: false
            }
          }
        }
      }
    case DATASET_BODY_SUCC:
      const fetchedAll = action.payload.data.data.length < state.components.body.pageInfo.pageSize
      return {
        ...state,
        components: {
          ...state.components,
          body: {
            ...state.components.body,
            value: [
              ...state.components.body.value,
              ...action.payload.data.data
            ],
            pageInfo: {
              ...state.components.body.pageInfo,
              page: state.components.body.pageInfo.page + 1, // eslint-disable-line
              fetchedAll,
              isFetching: false
            }
          }
        }
      }
    case DATASET_BODY_FAIL:
      return {
        ...state,
        components: {
          ...state.components,
          body: {
            ...state.body,
            error: action.payload.err,
            pageInfo: {
              ...state.components.body.pageInfo,
              isFetching: false
            }
          }
        }
      }

    default:
      return state
  }
}

export default workingDatasetsReducer
