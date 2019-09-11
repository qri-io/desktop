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

export const [SAVE_REQ, SAVE_SUCC, SAVE_FAIL] = apiActionTypes('save')

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

    default:
      return state
  }
}

export default mutationsReducer
