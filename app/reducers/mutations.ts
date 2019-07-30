import { Reducer, AnyAction } from 'redux'
import { Mutations } from '../models/store'
import { apiActionTypes } from '../store/api'

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

export const MUTATIONS_SET_SAVE_VALUE = 'MUTATIONS_SET_SAVE_VALUE'

const [SAVE_REQ, SAVE_SUCC, SAVE_FAIL] = apiActionTypes('save')

const mutationsReducer: Reducer = (state = initialState, action: AnyAction): Mutations => {
  switch (action.type) {
    case SAVE_REQ:
      return {
        ...state,
        save: {
          ...state.save,
          isLoading: true,
          error: null
        }
      }
    case SAVE_SUCC:
      return {
        ...state,
        save: {
          value: initialState.save.value,
          isLoading: false,
          error: null
        }
      }
    case SAVE_FAIL:
      return {
        ...state,
        save: {
          ...state.save,
          isLoading: false,
          error: action.payload.err
        }
      }

    case MUTATIONS_SET_SAVE_VALUE:
      const { payload } = action
      const title = payload.name === 'title' ? payload.value : state.save.value.title
      const message = payload.name === 'message' ? payload.value : state.save.value.message

      return {
        ...state,
        save: {
          ...state.save,
          value: {
            ...state.save.value,
            title,
            message
          }
        }
      }

    default:
      return state
  }
}

export default mutationsReducer
