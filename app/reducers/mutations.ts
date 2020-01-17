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
  }
}

export const [SAVE_REQ] = apiActionTypes('save')
export const SAVE_COMPLETE = 'SAVE_COMPLETE'
export const SET_COMMIT_TITLE = 'SET_COMMIT_TITLE'
export const SET_COMMIT_MESSAGE = 'SET_COMMIT_MESSAGE'

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
        }
      }

    default:
      return state
  }
}

export default mutationsReducer
