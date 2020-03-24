import { Reducer, AnyAction } from 'redux'
import { Mutations } from '../models/store'
import cloneDeep from 'clone-deep'
import { apiActionTypes } from '../utils/actionType'

const initialState: Mutations = {
  save: {
    value: {
      title: '',
      message: ''
    },
    isLoading: false,
    error: null
  },
  dataset: {
    value: undefined,
    isLoading: false,
    error: null
  },
  status: {
    value: undefined,
    isLoading: false,
    error: null
  }
}

export const [SAVE_REQ] = apiActionTypes('save')
export const SAVE_COMPLETE = 'SAVE_COMPLETE'
export const SET_COMMIT_TITLE = 'SET_COMMIT_TITLE'
export const SET_COMMIT_MESSAGE = 'SET_COMMIT_MESSAGE'
export const MUTATIONS_SET_DATASET = 'MUTATIONS_SET_DATASET'
export const MUTATIONS_RESET_DATASET = 'MUTATIONS_RESET_DATASET'
export const MUTATIONS_DATASET_MODIFIED = 'MUTATIONS_DATASET_MODIFIED'
export const MUTATIONS_SET_STATUS = 'MUTATIONS_SET_STATUS'
export const MUTATIONS_RESET_STATUS = 'MUTATIONS_RESET_STATUS'
export const MUTATIONS_DISCARD_CHANGES = 'MUTATIONS_DISCARD_CHANGES'

const mutationsReducer: Reducer = (state = initialState, action: AnyAction): Mutations => {
  switch (action.type) {
    case SET_COMMIT_TITLE:
      return {
        ...state,
        save: {
          ...state.save,
          value: {
            ...state.save.value,
            title: action.title
          }
        }
      }
    case SET_COMMIT_MESSAGE:
      return {
        ...state,
        save: {
          ...state.save,
          value: {
            ...state.save.value,
            message: action.message
          }
        }
      }
    case SAVE_REQ:
      return {
        ...state,
        save: {
          ...state.save,
          isLoading: true,
          error: null
        }
      }

    case SAVE_COMPLETE:
      return {
        ...state,
        save: {
          ...state.save,
          isLoading: false,
          error: action.err,
          value: initialState.save.value
        },
        dataset: initialState.dataset,
        status: initialState.status,
        dirty: undefined
      }
    case MUTATIONS_SET_DATASET:
      if (Object.keys(action.dataset).length === 0) {
        return {
          ...state,
          dataset: initialState.dataset,
          dirty: undefined
        }
      }
      return {
        ...state,
        dataset: {
          ...state.dataset,
          value: {
            ...state.dataset.value,
            ...action.dataset
          }
        },
        dirty: true
      }

    case MUTATIONS_RESET_DATASET:
      return {
        ...state,
        dataset: initialState.dataset,
        dirty: undefined
      }

    case MUTATIONS_SET_STATUS:
      if (Object.keys(action.status).length === 0) {
        return {
          ...state,
          status: initialState.status
        }
      }
      return {
        ...state,
        status: {
          ...state.status,
          value: action.status
        }
      }
    case MUTATIONS_RESET_STATUS:
      return {
        ...state,
        status: initialState.status
      }
    case MUTATIONS_DISCARD_CHANGES:
      if (!state.dataset.value || !state.status.value) return state
      let dataset = cloneDeep(state.dataset.value)
      let status = cloneDeep(state.status.value)
      delete dataset[action.component]
      delete status[action.component]
      if (action.component === 'body' && dataset.bodyPath) {
        delete dataset.bodyPath
      }
      if (Object.keys(dataset).length === 0) {
        return {
          ...state,
          status: initialState.status,
          dataset: initialState.dataset,
          dirty: undefined
        }
      }
      return {
        ...state,
        dataset: {
          ...state.dataset,
          value: dataset
        },
        status: {
          ...state.status,
          value: status
        },
        dirty: true
      }
    default:
      return state
  }
}

export default mutationsReducer
