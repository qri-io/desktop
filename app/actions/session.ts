import { CALL_API, ApiActionThunk } from '../store/api'
import { Session } from '../models/session'

export function fetchSession (): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'session',
      [CALL_API]: {
        endpoint: 'session',
        method: 'GET',
        map: (data: Record<string, any>): Session => {
          return data as Session
        }
      }
    }
    return dispatch(action)
  }
}

export function setPeername (newPeername: string): ApiActionThunk {
  return async (dispatch, getStore) => {
    const { session } = getStore()
    if (newPeername === session.peername) {
      return new Promise(resolve => resolve())
    }
    const newSession = Object.assign({}, session, { peername: newPeername })
    const action = {
      type: 'new_peername',
      [CALL_API]: {
        endpoint: 'session',
        method: 'POST',
        body: newSession,
        map: (data: Record<string, any>): Session => {
          return data as Session
        }
      }
    }
    return dispatch(action)
  }
}
