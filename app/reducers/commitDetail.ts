import { Reducer, AnyAction } from 'redux'
import { CommitDetails } from '../models/store'
import { apiActionTypes } from '../store/api'
import { withPagination } from './page'
import bodyValue from '../utils/bodyValue'
import {
  DATASET_REQ
} from './workingDataset'

const initialState: CommitDetails = {
  path: '',
  prevPath: '',
  peername: '',
  name: '',
  status: {},
  isLoading: true,
  structure: null,
  components: {
    body: {
      value: undefined,
      pageInfo: {
        isFetching: true,
        page: 0,
        pageSize: 0,
        fetchedAll: false
      }
    },
    meta: {
      value: {}
    },
    schema: {
      value: {}
    }
  }
}

const [COMMITDATASET_REQ, COMMITDATASET_SUCC, COMMITDATASET_FAIL] = apiActionTypes('commitdataset')
const [COMMITSTATUS_REQ, COMMITSTATUS_SUCC, COMMITSTATUS_FAIL] = apiActionTypes('commitstatus')
const [COMMITBODY_REQ, COMMITBODY_SUCC, COMMITBODY_FAIL] = apiActionTypes('commitbody')

const commitDetailsReducer: Reducer = (state = initialState, action: AnyAction): CommitDetails => {
  switch (action.type) {
    case DATASET_REQ:
      if (action.segments.peername !== state.peername || action.segments.name !== state.name) {
        return initialState
      }
      return state
    case COMMITDATASET_REQ:
      return initialState
    case COMMITDATASET_SUCC:
      const { name, path, peername, published, dataset } = action.payload.data
      return {
        ...state,
        name,
        path,
        peername,
        published,
        structure: dataset.structure,
        isLoading: false,
        components: {
          body: initialState.components.body,
          meta: {
            value: dataset.meta
          },
          schema: {
            value: dataset.structure.schema
          }
        }
      }
    case COMMITDATASET_FAIL:
      return {
        ...initialState,
        isLoading: false
      }

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
            value: action.pageInfo.page === 1 ? undefined : state.components.body.value,
            pageInfo: withPagination(action, state.components.body.pageInfo)
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
            value: bodyValue(state.components.body.value, action.payload.data.data),
            pageInfo: withPagination(action, state.components.body.pageInfo)
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
            pageInfo: withPagination(action, state.components.body.pageInfo)
          }
        }
      }

    default:
      return state
  }
}

export default commitDetailsReducer
