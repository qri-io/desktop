import { Reducer, AnyAction } from 'redux'
import { IChangeReport } from '../models/changes'
import { apiActionTypes } from '../utils/actionType'

interface IChangesReducer {
  isLoading: boolean
  changes: IChangeReport | undefined
  error: string
}

const initialState: IChangesReducer = {
  isLoading: true,
  error: '',
  changes: undefined
}

export const [CHANGES_REQ, CHANGES_SUCC, CHANGES_FAIL] = apiActionTypes('changes')

const ChangesReducer: Reducer = (state = initialState, action: AnyAction): IChangesReducer => {
  switch (action.type) {
    case CHANGES_REQ:
      return initialState
    case CHANGES_SUCC:
      return {
        isLoading: false,
        error: '',
        changes: action.payload.data
      }
    case CHANGES_FAIL:
      console.log("FAILED")
      if (action.payload.err.code === 404) {
        return {
          isLoading: false,
          error: 'Cannot get the Change Report. Are you using the most up-to-date version of the Qri backend?',
          changes: undefined
        }
      }
      return {
        isLoading: false,
        error: action.payload.err.message,
        changes: undefined
      }
    default:
      return state
  }
}

export default ChangesReducer
