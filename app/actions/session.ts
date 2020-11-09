import { CALL_API, ApiActionThunk } from '../store/api'
import { Session } from '../models/session'
import { AnyAction } from 'redux'
import { fetchMyDatasets } from './api'
import { wsConnect } from '../store/wsMiddleware'
import { SESSION_SUCC } from '../reducers/index'

export function fetchSession (): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'session',
      [CALL_API]: {
        endpoint: 'me',
        method: 'GET',
        map: (data: Record<string, any>): Session => {
          return data as Session
        }
      }
    }
    return dispatch(action)
  }
}

export function noSession (): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: SESSION_SUCC,
      payload: {
        data: {
          peername: '',
          id: '',
          created: '',
          updated: ''
        }
      }
    }
    return dispatch(action)
  }
}

export function bootstrap (): ApiActionThunk {
  return async (dispatch, getState) => {
    let response: AnyAction

    const sessionFunc = __BUILD__.REMOTE
      ? noSession
      : fetchSession
    response = await sessionFunc()(dispatch, getState)
      .then(() => dispatch(wsConnect()))
      .then(async () => fetchMyDatasets(-1)(dispatch, getState))
    return response
  }
}

export function signup (username: string, email: string, password: string): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'signup',
      [CALL_API]: {
        endpoint: 'registry/profile/new',
        method: 'POST',
        body: {
          username,
          email,
          password
        },
        map: (data: Record<string, any>): Session => {
          return data as Session
        }
      }
    }
    return dispatch(action)
  }
}

export function signin (username: string, password: string): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'signin',
      [CALL_API]: {
        endpoint: 'registry/profile/prove',
        method: 'POST',
        body: {
          username,
          password
        },
        map: (data: Record<string, any>): Session => {
          return data as Session
        }
      }
    }
    return dispatch(action)
  }
}
