import { Action } from 'redux'

import { CALL_API, ApiAction, ApiActionThunk, chainSuccess } from '../store/api'
import { actionWithPagination } from '../utils/pagination'
import {
  mapDataset,
  mapRecord,
  mapVersionInfo,
  mapStatus,
  mapBody,
  mapHistory
} from '../actions/mappingFuncs'

import { selectMyDatasetsPageInfo, selectDatasetBodyPageInfo, selectLogPageInfo } from '../selections'
import { Session } from '../models/session'

const pageSizeDefault = 100
export const bodyPageSizeDefault = 50
export const CLEAR_DATASET_HEAD = 'CLEAR_DATASET_HEAD'

export function pingApi (): ApiActionThunk {
  return async (dispatch) => {
    const pingAction: ApiAction = {
      type: 'health',
      [CALL_API]: {
        endpoint: 'health',
        method: 'GET',
        map: mapRecord
      }
    }
    return dispatch(pingAction)
  }
}

// to invalidate pagination, set page to -1
export function fetchMyDatasets (page: number = 1, pageSize: number = pageSizeDefault): ApiActionThunk {
  return async (dispatch, getState) => {
    const pageInfo = selectMyDatasetsPageInfo(getState())
    const { page: confirmedPage, doNotFetch } = actionWithPagination(page, pageInfo)

    // we need to emit a 'success' type, or our chainSuccess functions will fail
    if (doNotFetch) return new Promise(resolve => resolve({ type: 'SUCCESS' }))

    const listAction: ApiAction = {
      type: 'list',
      [CALL_API]: {
        endpoint: 'list',
        method: 'GET',
        pageInfo: {
          page: confirmedPage,
          pageSize
        },
        map: mapVersionInfo
      }
    }

    return dispatch(listAction)
  }
}

export function fetchCommitDetail (username: string, name: string, path: string): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    let response: Action

    response = await fetchCommitDataset(username, name, path)(dispatch, getState)
    response = await whenOk(fetchCommitStatus(username, name, path))(response)
    response = await whenOk(fetchCommitBody(username, name, path, -1))(response)
    response = await whenOk(fetchCommitStats(username, name, path))(response)

    return response
  }
}

export function fetchCommitDataset (username: string, name: string, path: string): ApiActionThunk {
  return async (dispatch) => {
    if (path === '') {
      return dispatch({
        type: CLEAR_DATASET_HEAD,
        username,
        name
      })
    }

    const response = await dispatch({
      type: 'commitdataset',
      [CALL_API]: {
        endpoint: '',
        method: 'GET',
        segments: {
          username,
          name,
          path
        },
        map: mapDataset
      }
    })

    return response
  }
}

export function fetchCommitStatus (username: string, name: string, path: string): ApiActionThunk {
  return async (dispatch) => {
    if (path === '') {
      return dispatch({
        type: CLEAR_DATASET_HEAD,
        username,
        name
      })
    }

    const response = await dispatch({
      type: 'commitstatus',
      [CALL_API]: {
        endpoint: 'whatchanged',
        method: 'GET',
        segments: {
          username,
          name,
          path
        },
        map: mapStatus
      }
    })

    return response
  }
}

// to invalidate pagination, set page to -1
export function fetchLog (username: string, name: string, page: number = 1, pageSize: number = pageSizeDefault): ApiActionThunk {
  return async (dispatch, getState) => {
    const pageInfo = selectLogPageInfo(getState())
    const { page: confirmedPage, doNotFetch } = actionWithPagination(page, pageInfo)

    // we need to emit a 'success' type, or our chainSuccess functions will fail
    if (doNotFetch) return new Promise(resolve => resolve({ type: 'SUCCESS' }))

    const action = {
      type: 'log',
      [CALL_API]: {
        endpoint: 'history',
        method: 'GET',
        segments: {
          username,
          name
        },
        query: {
          local: true
        },
        pageInfo: {
          page: confirmedPage,
          pageSize
        },
        map: mapHistory
      }
    }

    return dispatch(action)
  }
}

// to invalidate pagination, set page to -1
export function fetchCommitBody (username: string, name: string, path: string, page: number = 1, pageSize: number = bodyPageSizeDefault): ApiActionThunk {
  return async (dispatch, getState) => {
    const bodyPageInfo = selectDatasetBodyPageInfo(getState())

    if (path === '') {
      return dispatch({
        type: CLEAR_DATASET_HEAD,
        username,
        name
      })
    }

    const { page: confirmedPage, doNotFetch } = actionWithPagination(page, bodyPageInfo)

    // we need to emit a 'success' type, or our chainSuccess functions will fail
    if (doNotFetch) return new Promise(resolve => resolve({ type: 'SUCCESS' }))

    const action = {
      type: 'commitBody',
      [CALL_API]: {
        endpoint: 'body',
        method: 'GET',
        pageInfo: {
          page: confirmedPage,
          pageSize
        },
        segments: {
          username,
          name,
          path
        },
        map: mapBody
      }
    }
    return dispatch(action)
  }
}

export function fetchStats (username: string, name: string):
ApiActionThunk {
  return async (dispatch) => {
    const response = await dispatch({
      type: 'stats',
      [CALL_API]: {
        endpoint: 'stats',
        method: 'GET',
        segments: {
          username,
          name
        }
      }
    })

    return response
  }
}

export function fetchCommitStats (username: string, name: string, path: string):
ApiActionThunk {
  return async (dispatch) => {
    if (path === '') {
      return dispatch({
        type: CLEAR_DATASET_HEAD,
        username,
        name
      })
    }

    const response = await dispatch({
      type: 'commitstats',
      [CALL_API]: {
        endpoint: 'stats',
        method: 'GET',
        segments: {
          username,
          name,
          path
        }
      }
    })

    return response
  }
}

export function fetchReadmePreview (username: string, name: string): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'render',
      [CALL_API]: {
        endpoint: 'render',
        method: 'GET',
        segments: {
          username,
          name
        }
      }
    }
    return dispatch(action)
  }
}

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
