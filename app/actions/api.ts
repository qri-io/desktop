import { CALL_API, ApiAction, ApiActionThunk, chainSuccess } from '../store/api'
import { DatasetSummary, ComponentStatus, ComponentState } from '../models/store'
import { Dataset, Commit } from '../models/dataset'
import { Action } from 'redux'

import { setSelectedListItem } from './selections'

export function pingApi (): ApiActionThunk {
  return async (dispatch) => {
    const pingAction: ApiAction = {
      type: 'ping',
      [CALL_API]: {
        endpoint: 'ping',
        method: 'GET',
        map: (data: Record<string, string>): any => { //eslint-disable-line
          return data
        }
      }
    }
    return dispatch(pingAction)
  }
}

// fetchMyDatasetsAndLinks fetches the user's dataset list and linked datasets
// these two responses combined can indicate whether a given dataset is linked
// these will be combined into a single call in the future
export function fetchMyDatasetsAndLinks (): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    let response: Action

    response = await fetchMyDatasets()(dispatch, getState)
    response = await whenOk(fetchMyLinks())(response)

    return response
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

    // set selected commit to be the first on the list
    const { workingDataset } = getState()
    const { history } = workingDataset
    await dispatch(setSelectedListItem('commit', history.value[0].path))

    return response
  }
}

export function fetchMyDatasets (): ApiActionThunk {
  return async (dispatch) => {
    const listAction: ApiAction = {
      type: 'list',
      [CALL_API]: {
        endpoint: 'list',
        method: 'GET',
        map: (data: any[]): DatasetSummary[] => {
          return data.map((ref: any) => ({
            title: ref.dataset.title || `${ref.peername}/${ref.name}`,
            peername: ref.peername,
            name: ref.name,
            path: ref.path,
            hash: '',
            isLinked: false,
            changed: false
          }))
        }
      }
    }

    return dispatch(listAction)
  }
}

// TODO remove, calls /fsilinks, which will be combined with /list
export function fetchMyLinks (): ApiActionThunk {
  return async (dispatch) => {
    const listAction: ApiAction = {
      type: 'links',
      [CALL_API]: {
        endpoint: 'fsilinks',
        method: 'GET'
      }
    }

    return dispatch(listAction)
  }
}

export function fetchWorkingDataset (): ApiActionThunk {
  return async (dispatch, getState) => {
    const { selections } = getState()
    const action = {
      type: 'dataset',
      [CALL_API]: {
        endpoint: 'dataset',
        method: 'GET',
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

export function fetchWorkingHistory (): ApiActionThunk {
  return async (dispatch, getState) => {
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

export function fetchBody (): ApiActionThunk {
  return async (dispatch, getState) => {
    const { workingDataset } = getState()
    const { peername, name, path } = workingDataset

    const action = {
      type: 'body',
      [CALL_API]: {
        endpoint: 'body',
        method: 'GET',
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

export function fetchCommitBody (): ApiActionThunk {
  return async (dispatch, getState) => {
    const { selections } = getState()
    let { peername, name, commit: path } = selections

    const action = {
      type: 'commitBody',
      [CALL_API]: {
        endpoint: 'body',
        method: 'GET',
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
