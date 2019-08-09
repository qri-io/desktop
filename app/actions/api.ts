import { CALL_API, ApiAction, ApiActionThunk, chainSuccess } from '../store/api'
import { DatasetSummary, ComponentStatus, ComponentState } from '../models/store'
import { Dataset, Commit } from '../models/dataset'
import { Action } from 'redux'

import { setSelectedListItem } from './selections'

const pageSizeDefault = 15
const bodyPageSizeDefault = 100

// use NO_ACTION when you need to skip/debounce unneccessary calls to the api
// it will still register as a success
export const NO_ACTION: Action = { type: 'NO_ACTION_SUCCESS' }

export function pingApi (): ApiActionThunk {
  return async (dispatch) => {
    const pingAction: ApiAction = {
      type: 'health',
      [CALL_API]: {
        endpoint: 'health',
        method: 'GET',
        map: (data: Record<string, string>): any => { //eslint-disable-line
          return data
        }
      }
    }
    return dispatch(pingAction)
  }
}

// fetchWorkingDatasetDetails grabs the working dataset status, and history
export function fetchWorkingDatasetDetails (): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    let response: Action

    response = await fetchWorkingDataset()(dispatch, getState)
    response = await whenOk(fetchWorkingHistory())(response)
    response = await whenOk(fetchWorkingStatus())(response)
    response = await whenOk(fetchBody())(response)

    // set selected commit to be the first on the list
    const { workingDataset, selections } = getState()
    const { history } = workingDataset
    const { commit } = selections

    if (commit === '' || !history.value.some(c => c.path === commit)) {
      await dispatch(setSelectedListItem('commit', history.value[0].path))
    }
    return response
  }
}

export function fetchMyDatasets (page: number = 1, pageSize: number = pageSizeDefault): ApiActionThunk {
  return async (dispatch, getState) => {
    const state = getState()
    if (page !== 1 &&
          state &&
          state.myDatasets &&
          state.myDatasets.pageInfo &&
          state.myDatasets.pageInfo.fetchedAll) {
      return new Promise(resolve => resolve(NO_ACTION))
    }
    const listAction: ApiAction = {
      type: 'list',
      [CALL_API]: {
        endpoint: 'list',
        method: 'GET',
        pageInfo: {
          page,
          pageSize
        },
        map: (data: any[]): DatasetSummary[] => {
          return data.map((ref: any) => ({
            title: (ref.dataset && ref.dataset.title) || `${ref.peername}/${ref.name}`,
            peername: ref.peername,
            name: ref.name,
            path: ref.path,
            isLinked: !!ref.fsiPath
          }))
        }
      }
    }

    return dispatch(listAction)
  }
}

export function fetchWorkingDataset (): ApiActionThunk {
  return async (dispatch, getState) => {
    const { selections, myDatasets } = getState()
    const { peername, name } = selections

    // find the selected dataset in myDatasets to determine isLinked
    const match = myDatasets.value.find((d) => d.name === name && d.peername === peername)

    const params = (match && match.isLinked) ? { fsi: true } : {}

    const action = {
      type: 'dataset',
      [CALL_API]: {
        endpoint: 'dataset',
        method: 'GET',
        params,
        segments: {
          peername: selections.peername,
          name: selections.name
        },
        map: (data: Record<string, string>): Dataset => {
          return data as Dataset
        }
      }
    }

    return dispatch(action)
  }
}

export function fetchCommitDetail (): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    let response: Action

    response = await fetchCommitDataset()(dispatch, getState)
    response = await whenOk(fetchCommitStatus())(response)
    response = await whenOk(fetchCommitBody())(response)

    return response
  }
}

export function fetchCommitDataset (): ApiActionThunk {
  return async (dispatch, getState) => {
    const { selections } = getState()
    const { commit } = selections

    const response = await dispatch({
      type: 'commitdataset',
      [CALL_API]: {
        endpoint: 'dataset',
        method: 'GET',
        segments: {
          peername: selections.peername,
          name: selections.name,
          path: commit
        },
        map: (data: Record<string, string>): Dataset => {
          return data as Dataset
        }
      }
    })

    return response
  }
}

export function fetchCommitStatus (): ApiActionThunk {
  return async (dispatch, getState) => {
    const { selections } = getState()
    const { commit } = selections

    const response = await dispatch({
      type: 'commitstatus',
      [CALL_API]: {
        endpoint: 'status',
        method: 'GET',
        segments: {
          peername: selections.peername,
          name: selections.name,
          path: commit
        },
        map: (data: Array<Record<string, string>>): ComponentStatus[] => {
          return data.map((d) => {
            return {
              filepath: d.sourceFile,
              component: d.component,
              status: d.type as ComponentState
            }
          })
        }
      }
    })

    return response
  }
}

export function fetchWorkingHistory (page: number = 1, pageSize: number = pageSizeDefault): ApiActionThunk {
  return async (dispatch, getState) => {
    const state = getState()
    // if page === 1, this is a new history
    if (page !== 1 &&
        state &&
        state.workingDataset &&
        state.workingDataset.history &&
        state.workingDataset.history.pageInfo &&
        state.workingDataset.history.pageInfo.fetchedAll) {
      return new Promise(resolve => resolve(NO_ACTION))
    }
    const { selections } = getState()
    const action = {
      type: 'history',
      [CALL_API]: {
        endpoint: 'history',
        method: 'GET',
        segments: {
          peername: selections.peername,
          name: selections.name
        },
        pageInfo: {
          page,
          pageSize
        },
        map: (data: any[]): Commit[] => data.map((ref): Commit => {
          const { author, message, timestamp, title } = ref.dataset.commit
          return {
            author,
            message,
            timestamp,
            title,
            path: ref.path
          }
        })
      }
    }

    return dispatch(action)
  }
}

export function fetchWorkingStatus (): ApiActionThunk {
  return async (dispatch, getState) => {
    const { selections } = getState()
    const action = {
      type: 'status',
      [CALL_API]: {
        endpoint: 'status',
        method: 'GET',
        segments: {
          peername: selections.peername,
          name: selections.name
        },
        map: (data: Array<Record<string, string>>): ComponentStatus[] => {
          return data.map((d) => {
            return {
              filepath: d.sourceFile,
              component: d.component,
              status: d.type as ComponentState
            }
          })
        }
      }
    }

    return dispatch(action)
  }
}

export function fetchBody (page: number = 1, pageSize: number = bodyPageSizeDefault): ApiActionThunk {
  return async (dispatch, getState) => {
    const { workingDataset, selections } = getState()
    const { peername, name } = selections
    const { path } = workingDataset

    if (workingDataset.components.body.pageInfo.fetchedAll) {
      return new Promise(resolve => resolve(NO_ACTION))
    }

    const action = {
      type: 'body',
      [CALL_API]: {
        endpoint: 'body',
        method: 'GET',
        pageInfo: {
          page,
          pageSize
        },
        segments: {
          peername,
          name,
          path
        },
        map: (data: Record<string, string>): Dataset => {
          return data as Dataset
        }
      }
    }

    return dispatch(action)
  }
}

export function fetchCommitBody (page: number = 1, pageSize: number = bodyPageSizeDefault): ApiActionThunk {
  return async (dispatch, getState) => {
    const { selections, commitDetails } = getState()
    let { peername, name, commit: path } = selections

    if (commitDetails.components.body.pageInfo.fetchedAll) {
      return new Promise(resolve => resolve(NO_ACTION))
    }

    const action = {
      type: 'commitBody',
      [CALL_API]: {
        endpoint: 'body',
        method: 'GET',
        pageInfo: {
          page,
          pageSize
        },
        segments: {
          peername,
          name,
          path
        },
        map: (data: Record<string, string>): Dataset => {
          return data as Dataset
        }
      }
    }

    return dispatch(action)
  }
}

export function saveWorkingDataset (): ApiActionThunk {
  return async (dispatch, getState) => {
    const { workingDataset, mutations } = getState()
    const { peername, name } = workingDataset
    const { title, message } = mutations.save.value
    const action = {
      type: 'save',
      [CALL_API]: {
        endpoint: 'save',
        method: 'POST',
        segments: {
          peername,
          name
        },
        params: {
          fsi: true
        },
        body: {
          commit: {
            title,
            message
          }
        }
      }
    }

    return dispatch(action)
  }
}

export function addDataset (peername: string, name: string): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'add',
      [CALL_API]: {
        endpoint: 'add',
        method: 'POST',
        segments: {
          peername,
          name
        }
      }
    }
    return dispatch(action)
  }
}

export function addDatasetAndFetch (peername: string, name: string): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    let response: Action

    try {
      response = await addDataset(peername, name)(dispatch, getState)
      response = await whenOk(fetchMyDatasets())(response)
    } catch (action) {
      throw action
    }
    return response
  }
}

export function initDataset (filepath: string, name: string, format: string): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'init',
      [CALL_API]: {
        endpoint: 'init',
        method: 'POST',
        params: {
          filepath,
          name,
          format
        }
      }
    }
    return dispatch(action)
  }
}

export function initDatasetAndFetch (filepath: string, name: string, format: string): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    let response: Action

    try {
      response = await initDataset(filepath, name, format)(dispatch, getState)
      response = await whenOk(fetchMyDatasets())(response)
    } catch (action) {
      throw action
    }
    return response
  }
}
