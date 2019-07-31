import { Reducer, AnyAction } from 'redux'
import { CommitDetails } from '../models/store'
import { apiActionTypes } from '../store/api'

const initialState: CommitDetails = {
  path: '',
  prevPath: '',
  peername: '',
  name: '',
  status: {},
  isLoading: false,
  components: {
    body: {
      isLoading: false,
      value: undefined,
      error: ''
    },
    meta: {},
    schema: {}
  }
}

const [COMMITDATASET_REQ, COMMITDATASET_SUCC, COMMITDATASET_FAIL] = apiActionTypes('commitdataset')
const [COMMITSTATUS_REQ, COMMITSTATUS_SUCC, COMMITSTATUS_FAIL] = apiActionTypes('commitstatus')
const [COMMITBODY_REQ, COMMITBODY_SUCC, COMMITBODY_FAIL] = apiActionTypes('commitbody')

const commitDetailsReducer: Reducer = (state = initialState, action: AnyAction): CommitDetails => {
  switch (action.type) {
    case COMMITDATASET_REQ:
      return {
        ...state,
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
          body: {
            isLoading: false,
            value: undefined,
            error: ''
          },
          meta: dataset.meta,
          schema: dataset.structure.schema
        }
      }
    case COMMITDATASET_FAIL:
      return {
        ...state,
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
            ...state.body,
            isLoading: true
          }
        }
      }
    case COMMITBODY_SUCC:
      return {
        ...state,
        components: {
          ...state.components,
          body: {
            ...state.body,
            value: action.payload.data.data,
            error: '',
            isLoading: false
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
            isLoading: false
          }
        }
      }

    default:
      return state
  }
}

export default commitDetailsReducer
