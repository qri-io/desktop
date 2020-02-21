import { Reducer, AnyAction } from 'redux'
import { Mutations } from '../models/store'
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
  }
}

export const [SAVE_REQ] = apiActionTypes('save')
export const SAVE_COMPLETE = 'SAVE_COMPLETE'
export const SET_COMMIT_TITLE = 'SET_COMMIT_TITLE'
export const SET_COMMIT_MESSAGE = 'SET_COMMIT_MESSAGE'
export const MUTATIONS_SET_DATASET = 'MUTATIONS_SET_DATASET'
export const MUTATIONS_RESET_DATASET = 'MUTATIONS_RESET_DATASET'
export const MUTATIONS_DATASET_MODIFIED = 'MUTATIONS_DATASET_MODIFIED'

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
        dirty: undefined
      }
    case MUTATIONS_SET_DATASET:
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
    default:
      return state
  }
}

export default mutationsReducer
