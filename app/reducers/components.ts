import { AnyAction } from 'redux'
import { apiActionTypes } from '../store/api'

import { SELECTIONS_SET_ACTIVE_TAB, SELECTIONS_SET_SELECTED_LISTITEM } from './selections'

const initialState = {
  body: {
    isLoading: false,
    value: undefined,
    error: ''
  }
}

const [DATASET_BODY_REQ, DATASET_BODY_SUCC, DATASET_BODY_FAIL] = apiActionTypes('body')

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case DATASET_BODY_REQ:
      return {
        ...state,
        body: {
          ...state.body,
          isLoading: true
        }
      }
    case DATASET_BODY_SUCC:
      return {
        ...state,
        body: {
          ...state.body,
          value: action.payload.data.data,
          error: '',
          isLoading: false
        }
      }
    case DATASET_BODY_FAIL:
      return {
        ...state,
        body: {
          ...state.body,
          error: action.payload.err,
          isLoading: false
        }
      }

    // when the user switches tabs, clear out body
    case SELECTIONS_SET_ACTIVE_TAB:
      return {
        ...state,
        body: {
          ...state.body,
          value: undefined,
          error: '',
          isLoading: false
        }
      }

    // when the user switches, commits, clear out body
    case SELECTIONS_SET_SELECTED_LISTITEM:
      const { type } = action.payload
      if (type === 'commit') {
        return {
          ...state,
          body: {
            ...state.body,
            value: undefined,
            error: '',
            isLoading: false
          }
        }
      } else {
        return state
      }

    default:
      return state
  }
}
