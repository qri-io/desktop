import { CALL_API, ApiActionThunk, chainSuccess } from '../store/api'
import { Session } from '../models/session'
import { Action } from 'redux'
import { fetchWorkingDatasetDetails, fetchMyDatasets } from './api'

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

export function bootstrap (): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    let response: Action

    response = await fetchSession()(dispatch, getState)
    response = await whenOk(fetchMyDatasets(-1))(response)
    response = await whenOk(fetchWorkingDatasetDetails())(response)
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
