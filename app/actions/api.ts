import { CALL_API, ApiAction, ApiActionThunk, chainSuccess } from '../store/api'
import { DatasetSummary, ComponentStatus, ComponentState } from '../models/store'
import { Dataset, Commit } from '../models/dataset'
import { Action } from 'redux'

import { setSelectedListItem } from './selections'

// fetchMyDatasetsAndWorkbench attempts to fetch all details needed to intialize
// the working dataset container
export function fetchMyDatasetsAndWorkbench (): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    let response: Action

    response = await fetchMyDatasets()(dispatch, getState)
    response = await whenOk(fetchWorkingDatasetDetails())(response)

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
      type: 'api_action',
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

export function fetchWorkingDataset (): ApiActionThunk {
  return async (dispatch, getState) => {
    const { selections } = getState()
    const action = {
      type: 'api_action',
      [CALL_API]: {
        endpoint: 'dataset',
        method: 'GET',
        params: {
          // TODO (b5) - these 'default' values are just placeholders for checking
          // the api call when we have no proper default state. should fix
          peername: selections.peername || 'me',
          name: selections.name || 'world_bank_population'
        },
        // TODO (b5): confirm this works, if so we may want to remove this
        // map func entirely
        map: (data: Record<string, string>): Dataset => {
          return data as Dataset
        }
      }
    }

    return dispatch(action)
  }
}

export function fetchWorkingHistory (): ApiActionThunk {
  return async (dispatch, getState) => {
    const { selections } = getState()
    const action = {
      type: 'api_action',
      [CALL_API]: {
        endpoint: 'history',
        method: 'GET',
        params: {
          // TODO (b5) - these 'default' values are just placeholders for checking
          // the api call when we have no proper default state. should fix
          peername: selections.peername || 'me',
          name: selections.name || 'world_bank_population'
        },
        map: (data: any[]): Commit[] => data.map((ref): Commit => ref.dataset.commit)
      }
    }

    return dispatch(action)
  }
}

export function fetchWorkingStatus (): ApiActionThunk {
  return async (dispatch, getState) => {
    const { selections } = getState()
    const action = {
      type: 'api_action',
      [CALL_API]: {
        endpoint: 'status',
        method: 'GET',
        params: {
          // TODO (b5) - these 'default' values are just placeholders for checking
          // the api call when we have no proper default state. should fix
          peername: selections.peername || 'me',
          name: selections.name || 'world_bank_population'
        },
        map: (data: Array<Record<string, string>>): ComponentStatus[] => {
          return data.map((d) => {
            return {
              filepath: d.sourceFile,
              path: d.path,
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
      type: 'api_action',
      [CALL_API]: {
        endpoint: 'body',
        method: 'GET',
        params: {
          peername,
          name,
          path
        },
        // TODO (b5): confirm this works, if so we may want to remove this
        // map func entirely
        map: (data: Record<string, string>): Dataset => {
          return data as Dataset
        }
      }
    }

    return dispatch(action)
  }
}
