import { Reducer, AnyAction } from 'redux'
import deepEqual from 'deep-equal'
import { WorkingDataset, Status, StatusInfo } from '../models/store'
import { apiActionTypes } from '../utils/actionType'
import { reducerWithPagination, initialPageInfo } from '../utils/pagination'
import { ipcRenderer } from 'electron'
import bodyValue from '../utils/bodyValue'

import {
  REMOVE_SUCC
} from './selections'

const initialState: WorkingDataset = {
  path: '',
  prevPath: '',
  peername: '',
  name: '',
  status: {},
  isSaving: false,
  isWriting: false,
  isLoading: false,
  fsiPath: '',
  published: true,
  components: {
    readme: {
      value: ''
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
    transform: {
      value: ''
    }
  },
  stats: []
}

export const [DATASET_REQ, DATASET_SUCC, DATASET_FAIL] = apiActionTypes('dataset')
export const [DATASET_STATUS_REQ, DATASET_STATUS_SUCC, DATASET_STATUS_FAIL] = apiActionTypes('status')
const [DATASET_BODY_REQ, DATASET_BODY_SUCC, DATASET_BODY_FAIL] = apiActionTypes('body')
const [, RESETOTHERCOMPONENTS_SUCC, RESETOTHERCOMPONENTS_FAIL] = apiActionTypes('resetOtherComponents')
const [STATS_REQ, STATS_SUCC, STATS_FAIL] = apiActionTypes('stats')
export const [, RENAME_SUCC] = apiActionTypes('rename')
export const [FSIWRITE_REQ, FSIWRITE_SUCC, FSIWRITE_FAIL] = apiActionTypes('fsiWrite')
export const [SAVE_REQ, SAVE_SUCC, SAVE_FAIL] = apiActionTypes('save')

export const RESET_BODY = 'RESET_BODY'

const workingDatasetsReducer: Reducer = (state = initialState, action: AnyAction): WorkingDataset | null => {
  switch (action.type) {
    case DATASET_REQ:
      if (action.segments.peername === state.peername && action.segments.name === state.name) {
        return state
      }
      return {
        ...initialState,
        isLoading: true
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
          readme: {
            value: dataset && dataset.readme ? atob(dataset.readme.scriptBytes) : undefined
          },
          body: state.components.body,
          meta: {
            value: dataset && dataset.meta ? dataset.meta : undefined
          },
          structure: {
            value: dataset && dataset.structure ? dataset.structure : undefined
          },
          transform: {
            value: dataset && dataset.transform && dataset.transform.scriptBytes ? atob(dataset.transform.scriptBytes) : undefined
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
        ...initialState
      }

    case DATASET_STATUS_REQ:
      return state

    case FSIWRITE_REQ:
      return {
        ...state,
        isWriting: true
      }
    case FSIWRITE_FAIL:
      return {
        ...state,
        isWriting: false
      }
    case FSIWRITE_SUCC:
    case DATASET_STATUS_SUCC:
      const statusObject: Status = action.payload.data
        .reduce((obj: any, item: any): StatusInfo => {
          const { component } = item
          obj[component] = { ...item }
          return obj
        }, {})

      // if the new status deeply equals the current state, return current
      // state to prevent unecessary re-rendering
      return deepEqual(state.status, statusObject) ? state : {
        ...state,
        status: statusObject,
        isWriting: false
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
            pageInfo: reducerWithPagination(action, state.components.body.pageInfo)
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
            value: bodyValue(state.components.body.value, action.payload.data, action.payload.request.pageInfo),
            pageInfo: reducerWithPagination(action, state.components.body.pageInfo)
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
            pageInfo: reducerWithPagination(action, state.components.body.pageInfo)
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

    case RESETOTHERCOMPONENTS_SUCC:
      const { dataset: newDataset } = action.payload.data
      return {
        ...state,
        components: {
          ...state.components,
          meta: {
            value: newDataset.meta || {}
          },
          structure: {
            value: newDataset.structure || {}
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
          structure: {
            ...state.components.structure,
            error: action.payload.err
          }
        }
      }

    case REMOVE_SUCC:
      if (state.peername === action.payload.request.segments.peername && state.name === action.payload.request.segments.name) {
        return initialState
      }
      return state

    case STATS_REQ:
      if (state.peername === action.segments.peername && state.name === action.segments.name) {
        return state
      }
      return {
        ...state,
        stats: []
      }
    case STATS_SUCC:
      return {
        ...state,
        stats: action.payload.data
      }
    case STATS_FAIL:
      return {
        ...state,
        stats: []
      }

    case RENAME_SUCC:
      return {
        ...state,
        name: action.payload.data.name
      }

    case SAVE_REQ:
      return {
        ...state,
        isSaving: true
      }
    case SAVE_SUCC:
    case SAVE_FAIL:
      return {
        ...state,
        isSaving: false
      }
    default:
      return state
  }
}

export default workingDatasetsReducer
