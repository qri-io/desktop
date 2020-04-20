import { QriRef } from "../models/qriRef"
import { AnyAction } from "redux"

import { WorkbenchRoutes } from '../models/store'

const initialRef: QriRef = {
  location: '',
  username: '',
  name: ''
}

export const initialState: WorkbenchRoutes = {
  // the last ref when we were viewing the workbench history page
  historyRef: initialRef,
  // the last ref when we were visiting the workbench edit page
  editRef: initialRef,
  // the last ref when we were visiting the workbench page, can be a history or
  location: ''
}

export const WORKBENCH_ROUTES_HISTORY_REF = 'WORKBENCH_ROUTES_HISTORY_REF'
export const WORKBENCH_ROUTES_EDIT_REF = 'WORKBENCH_ROUTES_EDIT_REF'
export const WORKBENCH_ROUTES_CLEAR = 'WORKBENCH_ROUTES_CLEAR'

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case WORKBENCH_ROUTES_HISTORY_REF:
      if (state.historyRef.username !== action.qriRef.username ||
        state.historyRef.name !== action.qriRef.name) {
        return {
          ...initialState,
          historyRef: action.qriRef,
          location: action.qriRef.location
        }
      }
      return {
        ...state,
        historyRef: action.qriRef,
        location: action.qriRef.location
      }
    case WORKBENCH_ROUTES_EDIT_REF:
      if (state.editRef.username !== action.qriRef.username ||
        state.editRef.name !== action.qriRef.name) {
        return {
          ...initialState,
          editRef: action.qriRef,
          location: action.qriRef.location
        }
      }
      return {
        ...state,
        editRef: action.qriRef,
        location: action.qriRef.location
      }
    default:
      return state
  }
}
