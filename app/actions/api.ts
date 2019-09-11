import { Action, AnyAction } from 'redux'

import { CALL_API, ApiAction, ApiActionThunk, chainSuccess, ApiResponseAction } from '../store/api'
import { DatasetSummary, ComponentStatus, ComponentState, WorkingDataset, ComponentType } from '../models/store'
import { Dataset, Commit } from '../models/dataset'
import { openToast } from './ui'
import { setWorkingDataset, setSelectedListItem, clearSelection, setActiveTab } from './selections'

import { RESET_MY_DATASETS } from '../reducers/myDatasets'
import getActionType from '../utils/actionType'

const pageSizeDefault = 50
const bodyPageSizeDefault = 100

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
    response = await whenOk(fetchWorkingStatus())(response)
    response = await whenOk(fetchBody())(response)
    response = await whenOk(fetchWorkingHistory())(response)

    // set selected commit to be the first on the list
    const { workingDataset, selections } = getState()
    const { history } = workingDataset
    const { commit } = selections

    // if history length changes, select the latest commit
    if (history.value.length !== 0 && (commit === '' || !history.value.some(c => c.path === commit))) {
      await dispatch(setSelectedListItem('commit', history.value[0].path))
    }
    return response
  }
}

export function fetchModifiedComponents (): ApiActionThunk {
  return async (dispatch, getState) => {
    const { selections, workingDataset } = getState()
    const { path } = workingDataset
    const { peername, name, isLinked } = selections

    let response: Action

    const resetComponents = {
      type: 'resetComponents',
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
    response = await dispatch(resetComponents)

    const resetBody = {
      type: 'resetBody',
      [CALL_API]: {
        endpoint: 'body',
        method: 'GET',
        pageInfo: {
          page: 1,
          pageSize: bodyPageSizeDefault
        },
        params: { fsi: isLinked },
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
    response = await dispatch(resetBody)

    return response
  }
}

// clears the dataset list
function resetMyDatasets (): Action {
  return {
    type: RESET_MY_DATASETS
  }
}

export function fetchMyDatasets (page: number = 1, pageSize: number = pageSizeDefault, invalidatePagination: boolean = false): ApiActionThunk {
  return async (dispatch, getState) => {
    if (invalidatePagination) {
      dispatch(resetMyDatasets())
    }
    const state = getState()
    if (page !== 1 &&
          state &&
          state.myDatasets &&
          state.myDatasets.pageInfo &&
          state.myDatasets.pageInfo.fetchedAll) {
      return new Promise(resolve => resolve())
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
            isLinked: !!ref.fsiPath,
            published: ref.published
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
    const { peername, name, isLinked } = selections

    if (peername === '' || name === '') {
      return Promise.reject(new Error('no peername or name selected'))
    }

    const action = {
      type: 'dataset',
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
    // the action being dispatched will be intercepted by api middleware and return a promise
    // typescript requires we first cast to unknown to drop the stated return type of the dispatch function
    const result = (dispatch(action) as unknown) as Promise<AnyAction>
    return new Promise((resolve, reject) => {
      result.then(action => {
        if (getActionType(action) === 'failure') {
          if (action.payload.err.code === 404 || action.payload.err.code === 500) {
            // if the working dataset isn't found, we have dataset selection that no longer exists. clear the selection.
            dispatch(clearSelection())
            reject(action)
          }
        }
        resolve(action)
      })
    })
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
        endpoint: '',
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
      return new Promise(resolve => resolve())
    }
    const { selections } = getState()
    const { peername, name, isLinked } = selections
    const action = {
      type: 'history',
      [CALL_API]: {
        endpoint: 'history',
        method: 'GET',
        params: { fsi: isLinked },
        segments: {
          peername: peername,
          name: name
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
    const { workingDataset } = getState()
    const { peername, name, linkpath } = workingDataset
    const action = {
      type: 'status',
      [CALL_API]: {
        endpoint: 'status',
        method: 'GET',
        params: { fsi: linkpath !== '' },
        segments: {
          peername: peername,
          name: name
        },
        map: (data: Array<Record<string, string>>): ComponentStatus[] => {
          return data.map((d) => {
            return {
              filepath: d.sourceFile,
              component: d.component,
              status: d.type as ComponentState,
              mtime: new Date(d.mtime)
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
    const { peername, name, isLinked } = selections
    const { path } = workingDataset

    if (workingDataset.components.body.pageInfo.fetchedAll) {
      return new Promise(resolve => resolve())
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
        params: { fsi: isLinked },
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
      return new Promise(resolve => resolve())
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
      const action = response as ApiResponseAction
      const { isLinked, published } = action.payload.data.find((dataset: DatasetSummary) => dataset.name === name && dataset.peername === peername)
      dispatch(setWorkingDataset(peername, name, isLinked, published))
      dispatch(setActiveTab('history'))
      dispatch(setSelectedListItem('component', 'meta'))
    } catch (action) {
      throw action
    }
    return response
  }
}

export function initDataset (sourcebodypath: string, name: string, dir: string, mkdir: string): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'init',
      [CALL_API]: {
        endpoint: 'init/',
        method: 'POST',
        params: {
          sourcebodypath,
          name,
          dir,
          mkdir
        }
      }
    }
    return dispatch(action)
  }
}

export function initDatasetAndFetch (sourcebodypath: string, name: string, dir: string, mkdir: string): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    let response: Action

    try {
      response = await initDataset(sourcebodypath, name, dir, mkdir)(dispatch, getState)
      response = await whenOk(fetchMyDatasets())(response)
      const action = response as ApiResponseAction
      const { data } = action.payload
      const { peername, isLinked, published } = data.find((dataset: DatasetSummary) => dataset.name === name)
      dispatch(setWorkingDataset(peername, name, isLinked, published))
      dispatch(setActiveTab('status'))
      dispatch(setSelectedListItem('component', 'meta'))
    } catch (action) {
      throw action
    }
    return response
  }
}

export function publishDataset (dataset: WorkingDataset): ApiActionThunk {
  const { peername, name } = dataset
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    const action = {
      type: 'publish',
      [CALL_API]: {
        endpoint: 'publish',
        method: 'POST',
        segments: {
          peername,
          name
        }
      }
    }

    try {
      let response: Action
      response = await dispatch(action)
      await whenOk(fetchWorkingDataset())(response)
      response = await dispatch(setWorkingDataset(dataset.peername, dataset.name, dataset.linkpath !== 'repo', true))
    } catch (action) {
      throw action
    }
    // return response
    return dispatch(openToast('success', 'dataset published'))
  }
}

export function unpublishDataset (dataset: WorkingDataset): ApiActionThunk {
  const { peername, name } = dataset
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    const action = {
      type: 'unpublish',
      [CALL_API]: {
        endpoint: 'publish',
        method: 'DELETE',
        segments: {
          peername,
          name
        }
      }
    }

    try {
      let response: Action
      response = await dispatch(action)
      await whenOk(fetchWorkingDataset())(response)
      response = await dispatch(setWorkingDataset(dataset.peername, dataset.name, dataset.linkpath !== 'repo', false))
    } catch (action) {
      throw action
    }
    // return response
    return dispatch(openToast('success', 'dataset unpublished'))
  }
}

export function linkDataset (peername: string, name: string, dir: string): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    let response: Action

    try {
      const action = {
        type: 'checkout',
        [CALL_API]: {
          endpoint: 'checkout',
          method: 'POST',
          segments: {
            peername,
            name
          },
          params: {
            dir
          }
        }
      }
      response = await dispatch(action)
      response = await whenOk(fetchWorkingDatasetDetails())(response)
      response = await whenOk(fetchMyDatasets(1, pageSizeDefault, true))(response) // non-paginated
    } catch (action) {
      throw action
    }
    return response
  }
}

export function discardChanges (component: ComponentType): ApiActionThunk {
  return async (dispatch, getState) => {
    const { selections } = getState()
    const { peername, name } = selections
    let response: Action

    try {
      const action = {
        type: 'restore',
        [CALL_API]: {
          endpoint: 'restore',
          method: 'POST',
          segments: {
            peername,
            name
          },
          params: {
            component
          }
        }
      }
      response = await dispatch(action)
    } catch (action) {
      throw action
    }
    return response
  }
}

export function removeDataset (peername: string, name: string): ApiActionThunk {
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
