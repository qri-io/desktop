import { Reducer, AnyAction } from 'redux'
import { WorkingDataset, DatasetStatus, ComponentStatus } from '../models/store'
import { apiActionTypes } from '../utils/actionType'
import { withPagination } from './page'
import { ipcRenderer } from 'electron'
import bodyValue from '../utils/bodyValue'

const initialState: WorkingDataset = {
  path: '',
  prevPath: '',
  peername: '',
  name: '',
  status: {},
  isLoading: true,
  fsiPath: '',
  published: true,
  hasHistory: true,
  structure: null,
  components: {
    body: {
      value: [],
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

export const [DATASET_REQ, DATASET_SUCC, DATASET_FAIL] = apiActionTypes('dataset')
const [DATASET_HISTORY_REQ, DATASET_HISTORY_SUCC, DATASET_HISTORY_FAIL] = apiActionTypes('history')
export const [DATASET_STATUS_REQ, DATASET_STATUS_SUCC, DATASET_STATUS_FAIL] = apiActionTypes('status')
const [DATASET_BODY_REQ, DATASET_BODY_SUCC, DATASET_BODY_FAIL] = apiActionTypes('body')
const [RESETOTHERCOMPONENTS_REQ, RESETOTHERCOMPONENTS_SUCC, RESETOTHERCOMPONENTS_FAIL] = apiActionTypes('resetOtherComponents')

export const RESET_BODY = 'RESET_BODY'

const workingDatasetsReducer: Reducer = (state = initialState, action: AnyAction): WorkingDataset | null => {
  switch (action.type) {
    case DATASET_REQ:
      return {
        ...initialState,
        peername: action.segments.peername,
        name: action.segments.name
      }
    case DATASET_SUCC: // when adding a new dataset, set it as the new workingDataset
      const { name, path, peername, published, dataset, fsiPath } = action.payload.data

      // set electron menus
      ipcRenderer.send('block-menus', false) // unblock menus once we have a working dataset
      // some menus are contextual based on linked and published status
      ipcRenderer.send('set-working-dataset', {
        fsiPath,
        published
      })

      return {
        ...state,
        name,
        path,
        peername,
        published,
        fsiPath: fsiPath || '',
        structure: dataset && dataset.structure ? dataset.structure : {},
        isLoading: false,
        components: {
          body: initialState.components.body,
          meta: {
            value: dataset && dataset.meta ? dataset.meta : {}
          },
          schema: {
            value: dataset && dataset.structure && dataset.structure.schema ? dataset.structure.schema : {}
          }
        }
      }
    case DATASET_FAIL:
      // if the error is 422, we are going to rerequest this
      // dataset using 'fsi=false'
      if (action.payload.err.code === 422) {
        return state
      }
      return {
        ...initialState,
        isLoading: false
      }

    case DATASET_HISTORY_REQ:
      return {
        ...state,
        history: {
          ...state.history,
          pageInfo: withPagination(action, state.history.pageInfo),
          value: action.pageInfo.page === 1 ? [] : state.history.value
        }
      }
    case DATASET_HISTORY_SUCC:
      return {
        ...state,
        hasHistory: true,
        history: {
          ...state.history,
          value: [
            ...state.history.value,
            ...action.payload.data
          ],
          pageInfo: withPagination(action, state.history.pageInfo)
        }
      }
    case DATASET_HISTORY_FAIL:
      return {
        ...state,
        hasHistory: !action.payload.err.message.includes('no history'),
        history: {
          ...state.history,
          pageInfo: withPagination(action, state.history.pageInfo)
        }
      }

    case DATASET_STATUS_REQ:
      return state
    case DATASET_STATUS_SUCC:
      const statusObject: DatasetStatus = action.payload.data
        .reduce((obj: any, item: any): ComponentStatus => {
          const { component, filepath, status, mtime } = item
          obj[component] = { filepath, status, mtime }
          return obj
        }, {})
      return {
        ...state,
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
            value: action.pageInfo.page === 1 ? [] : state.components.body.value,
            pageInfo: withPagination(action, state.components.body.pageInfo)
          }
        }
      }
    case DATASET_BODY_SUCC:
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
    case DATASET_BODY_FAIL:
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

    case RESET_BODY:
      return {
        ...state,
        components: {
          ...state.components,
          body: initialState.components.body
        }
      }

    case RESETOTHERCOMPONENTS_REQ:
      return {
        ...state,
        components: {
          ...state.components,
          meta: initialState.components.meta,
          schema: initialState.components.schema
        }
      }

    case RESETOTHERCOMPONENTS_SUCC:
      const { dataset: newDataset } = action.payload.data
      return {
        ...state,
        components: {
          ...state.components,
          meta: {
            value: newDataset.meta || {}
          },
          schema: {
            value: newDataset.structure.schema
          }
        }
      }

    case RESETOTHERCOMPONENTS_FAIL:
      return {
        ...state,
        components: {
          ...state.components,
          meta: {
            ...state.components.meta,
            error: action.payload.err
          },
          schema: {
            ...state.components.schema,
            error: action.payload.err
          }
        }
      }

    default:
      return state
  }
}

export default workingDatasetsReducer
