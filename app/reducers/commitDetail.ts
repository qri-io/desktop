import { Reducer, AnyAction } from 'redux'
import { CommitDetails } from '../models/store'
import { apiActionTypes } from '../store/api'

const initialState: CommitDetails = {
  path: '',
  prevPath: '',
  peername: '',
  name: '',
  status: {},
  isLoading: true,
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
  }
}

const [COMMITDATASET_REQ, COMMITDATASET_SUCC, COMMITDATASET_FAIL] = apiActionTypes('commitdataset')
const [COMMITSTATUS_REQ, COMMITSTATUS_SUCC, COMMITSTATUS_FAIL] = apiActionTypes('commitstatus')
const [COMMITBODY_REQ, COMMITBODY_SUCC, COMMITBODY_FAIL] = apiActionTypes('commitbody')

const commitDetailsReducer: Reducer = (state = initialState, action: AnyAction): CommitDetails => {
  switch (action.type) {
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
        isLoading: false,
        components: {
          body: {
            ...state.components.body
          },
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
            ...state.components.body,
            pageInfo: {
              ...state.components.body.pageInfo,
              isFetching: true
            }
          }
        }
      }
    case COMMITBODY_SUCC:
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
    case COMMITBODY_FAIL:
      return {
        ...state,
        components: {
          ...state.components,
          body: {
            ...state.body,
            error: action.payload.err,
            pageInfo: {
              ...state.body.pageInfo,
              isFetching: false
            }
          }
        }
      }

    default:
      return state
  }
}

export default commitDetailsReducer
