import { CALL_API, ApiActionThunk } from '../store/api'
import { Dataset } from '../models/dataset'

import { fetchBody } from './api'

import {
  RESET_BODY
} from '../reducers/workingDataset'

// action creators for resetting the body or 'other components' when a
// difference in mtime is detected in Dataset.tsx

// resetBody() dispatches RESET_BODY which is a normal action that resets
// workingDataset.components.body to the initial state, then calls fetchBody
export const resetBody: any = () => {
  return async (dispatch: any) => {
    await dispatch({
      type: RESET_BODY
    })

    dispatch(fetchBody())
  }
}

// resetOtherComponents is the same API call as fetchWorkingDataset
// but needs to be different so the reducers don't treat it like switching WorkingDataset
// the reducers for resetOtherComponents only touch workingDataset.meta.value and workingDataset.schema.value
// this could/should live with the other api actions, but it's here because it's more aligned with resetBody()
export const resetOtherComponents = (): ApiActionThunk => {
  return async (dispatch, getState) => {
    const { selections } = getState()
    const { peername, name, isLinked } = selections

    const action = {
      type: 'resetOtherComponents',
      [CALL_API]: {
        endpoint: '',
        method: 'GET',
        params: { fsi: isLinked },
        segments: {
          peername,
          name
        },
        map: (data: Record<string, string>): Dataset => {
          return data as Dataset
        }
      }
    }

    return dispatch(action)
  }
}
