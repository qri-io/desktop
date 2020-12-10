import { Reducer, AnyAction } from 'redux'
import deepEqual from 'deep-equal'

import { WorkingDataset, Status, StatusInfo } from '../models/store'
import { apiActionTypes } from '../utils/actionType'
import { reducerWithPagination, initialPageInfo } from '../utils/pagination'
import bodyValue from '../utils/bodyValue'
import { unblockDatasetMenus } from './platformSpecific/workingDataset.TARGET_PLATFORM'

import {
  REMOVE_SUCC
} from './selections'
import { COMMITDATASET_REQ } from './dataset'

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
    stats: {
      value: {}
    },
    transform: {
      value: ''
    }
  }
}

export const [DATASET_REQ, DATASET_SUCC, DATASET_FAIL] = apiActionTypes('dataset')
export const [DATASET_STATUS_REQ, DATASET_STATUS_SUCC, DATASET_STATUS_FAIL] = apiActionTypes('status')
const [DATASET_BODY_REQ, DATASET_BODY_SUCC, DATASET_BODY_FAIL] = apiActionTypes('body')
const [, RESETOTHERCOMPONENTS_SUCC, RESETOTHERCOMPONENTS_FAIL] = apiActionTypes('resetOtherComponents')
export const [, RENAME_SUCC] = apiActionTypes('rename')
export const [FSIWRITE_REQ, FSIWRITE_SUCC, FSIWRITE_FAIL] = apiActionTypes('fsiWrite')
export const [SAVE_REQ, SAVE_SUCC, SAVE_FAIL] = apiActionTypes('save')

export const RESET_BODY = 'RESET_BODY'

const workingDatasetsReducer: Reducer = (state = initialState, action: AnyAction): WorkingDataset | null => {
  switch (action.type) {
    case COMMITDATASET_REQ:
      if (action.segments.username !== state.peername || action.segments.name !== state.name) {
        return initialState
      }
      return state
    case DATASET_REQ:
      if (action.segments.username === state.peername && action.segments.name === state.name) {
        return state
      }
      return {
        ...initialState,
        peername: action.segments.username,
        name: action.segments.name,
        isLoading: true
      }
    case DATASET_SUCC: // when adding a new dataset, set it as the new workingDataset
      const { name, path, peername, published, dataset, fsiPath } = action.payload.data

      unblockDatasetMenus(fsiPath, published)

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
            value: dataset && dataset.readme && dataset.readme.scriptBytes && atob(dataset.readme.scriptBytes)
          },
          body: state.components.body,
          meta: {
            value: dataset && dataset.meta
          },
          structure: {
            value: dataset && dataset.structure
          },
          stats: {
            value: dataset && dataset.stats
          },
          transform: {
            value: dataset && dataset.transform && dataset.transform.scriptBytes && atob(dataset.transform.scriptBytes)
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
      if (state.peername === action.payload.request.segments.username && state.name === action.payload.request.segments.name) {
        return initialState
      }
      return state

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
