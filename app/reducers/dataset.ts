import { Reducer, AnyAction } from 'redux'
import { DatasetStore } from '../models/store'
import { apiActionTypes } from '../utils/actionType'
import { reducerWithPagination, initialPageInfo } from '../utils/pagination'
import bodyValue from '../utils/bodyValue'
import {
  DATASET_REQ
} from './workingDataset'
import { REMOVE_SUCC } from './selections'

const initialState: DatasetStore = {
  path: '',
  prevPath: '',
  peername: '',
  name: '',
  status: {},
  isLoading: false,
  components: {
    commit: {
      value: {}
    },
    body: {
      value: [],
      pageInfo: initialPageInfo
    },
    meta: {
      value: {}
    },
    structure: {
      value: {}
    },
    readme: {
      value: {}
    },
    transform: {
      value: {}
    },
    stats: {
      value: {}
    }
  },
  stats: []
}

export const [COMMITDATASET_REQ, COMMITDATASET_SUCC, COMMITDATASET_FAIL] = apiActionTypes('commitdataset')
const [COMMITSTATUS_REQ, COMMITSTATUS_SUCC, COMMITSTATUS_FAIL] = apiActionTypes('commitstatus')
const [COMMITBODY_REQ, COMMITBODY_SUCC, COMMITBODY_FAIL] = apiActionTypes('commitbody')
const [COMMITSTATS_REQ, COMMITSTATS_SUCC, COMMITSTATS_FAIL] = apiActionTypes('commitstats')

export const CLEAR_DATASET_HEAD = 'CLEAR_DATASET_HEAD'

const DatasetReducer: Reducer = (state = initialState, action: AnyAction): DatasetStore => {
  switch (action.type) {
    case DATASET_REQ:
      if (action.segments.username !== state.peername || action.segments.name !== state.name) {
        return initialState
      }
      return state
    case COMMITDATASET_REQ:
      return {
        ...state,
        peername: action.segments.username,
        name: action.segments.name,
        isLoading: true
      }
    case COMMITDATASET_SUCC:
      const { name, path, peername, published, dataset } = action.payload.data
      return {
        ...state,
        name,
        path,
        peername,
        published,
        isLoading: false,
        components: {
          body: state.components.body,
          meta: {
            value: dataset.meta
          },
          structure: {
            value: dataset.structure
          },
          commit: {
            value: dataset.commit
          },
          readme: {
            value: dataset.readme
          },
          stats: {
            value: dataset.stats
          },
          transform: {
            value: dataset && dataset.transform && dataset.transform.scriptBytes && atob(dataset.transform.scriptBytes)
          }
        }
      }

    case COMMITDATASET_FAIL:
      return initialState

    case COMMITSTATUS_REQ:
      return state
    case COMMITSTATUS_SUCC:
      const statusObject = action.payload.data.reduce((acc: Record<string, Record<string, any>>, d: Record<string, any>) => {
        acc[d.component] = d
        delete d.component
        return acc
      }, {})
      return Object.assign({}, state, { status: statusObject })
    case COMMITSTATUS_FAIL:
      return state

    case COMMITBODY_REQ:
      return {
        ...state,
        components: {
          ...state.components,
          body: {
            ...state.components.body,
            pageInfo: reducerWithPagination(action, state.components.body.pageInfo)
          }
        }
      }
    case COMMITBODY_SUCC:
      return {
        ...state,
        components: {
          ...state.components,
          body: {
            ...state.components.body,
            value: bodyValue(state.components.body.value, action.payload.data, action.payload.request.pageInfo),
            pageInfo: reducerWithPagination(action, state.components.body.pageInfo)
          }
        }
      }
    case COMMITBODY_FAIL:
      return {
        ...state,
        components: {
          ...state.components,
          body: {
            ...state.body,
            pageInfo: reducerWithPagination(action, state.components.body.pageInfo)
          }
        }
      }

    case COMMITSTATS_REQ:
      if (state.peername === action.segments.peername && state.name === action.segments.name) {
        return state
      }
      return {
        ...state,
        stats: []
      }
    case COMMITSTATS_SUCC:
      return {
        ...state,
        stats: action.payload.data
      }
    case COMMITSTATS_FAIL:
      return {
        ...state,
        stats: []
      }

    case CLEAR_DATASET_HEAD:
      return {
        ...initialState,
        peername: action.username,
        name: action.name
      }

    case REMOVE_SUCC:
      if (state.peername === action.payload.request.segments.username && state.name === action.payload.request.segments.name) {
        return initialState
      }
      return state

    default:
      return state
  }
}

export default DatasetReducer
