import { Action, AnyAction } from 'redux'

import { CALL_API, ApiAction, ApiActionThunk, chainSuccess, ApiResponseAction } from '../store/api'
import { DatasetSummary, ComponentType, PageInfo, MyDatasets } from '../models/store'
import { openToast } from './ui'
import { setWorkingDataset, setSelectedListItem, setActiveTab } from './selections'
import {
  mapDataset,
  mapRecord,
  mapDatasetSummary,
  mapStatus,
  mapHistory
} from './mappingFuncs'
import getActionType from '../utils/actionType'

const pageSizeDefault = 50
const bodyPageSizeDefault = 100

// look up the peername/name in myDatasets, return boolean for existence of fsiPath
const lookupFsi = (peername: string | null, name: string | null, myDatasets: MyDatasets) => {
  const dataset = myDatasets.value.find((dataset) => {
    return dataset.peername === peername && dataset.name === name
  })

  return dataset && !!dataset.fsiPath
}

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

// fetchWorkingDatasetDetails grabs the working dataset status, and history
export function fetchWorkingDatasetDetails (): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    let response: AnyAction

    response = await fetchWorkingDataset()(dispatch, getState)

    // if the response returned in error, check the error
    // if it's 422, it means the dataset exists, it's just not linked to the filesystem
    if (getActionType(response) === 'failure') {
      if (response.payload.err.code !== 422) {
        return response
      }
      response = await fetchWorkingDataset(false)(dispatch, getState)
    }
    response = await whenOk(fetchWorkingStatus())(response)
    response = await whenOk(fetchBody())(response)
    response = await whenOk(fetchWorkingHistory())(response)
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
    const { path, fsiPath } = workingDataset
    const { peername, name } = selections

    let response: Action

    const resetComponents = {
      type: 'resetComponents',
      [CALL_API]: {
        endpoint: '',
        method: 'GET',
        params: { fsi: !!fsiPath },
        segments: {
          peername,
          name
        },
        map: mapDataset
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
        params: { fsi: !!fsiPath },
        segments: {
          peername,
          name,
          path
        },
        map: mapDataset
      }
    }
    response = await dispatch(resetBody)

    return response
  }
}

function actionWithPagination (invalidatePagination: boolean, page: number, pageInfo: PageInfo): ActionWithPaginationRes {
  // if we aren't invalidating the pagination,
  // and we have already fetched this page,
  // or we've already fetched all the entries
  // bail early!
  if (
    invalidatePagination && (
      page <= pageInfo.page ||
    pageInfo.fetchedAll)
  ) {
    return { page: 0, bailEarly: true }
  }
  // if we are invalidating the pagination, start the pagination at 1!
  if (invalidatePagination) return { page: 1, bailEarly: true }
  return { page, bailEarly: false }
}

export function fetchMyDatasets (page: number = 1, pageSize: number = pageSizeDefault, invalidatePagination: boolean = false): ApiActionThunk {
  return async (dispatch, getState) => {
    const state = getState()
    const { page: confirmedPage, bailEarly } = actionWithPagination(invalidatePagination, page, state.myDatasets.pageInfo)

    if (bailEarly) return new Promise(resolve => resolve())

    const listAction: ApiAction = {
      type: 'list',
      [CALL_API]: {
        endpoint: 'list',
        method: 'GET',
        pageInfo: {
          page: confirmedPage,
          pageSize
        },
        map: mapDatasetSummary
      }
    }

    return dispatch(listAction)
  }
}

export function fetchWorkingDataset (fsi: boolean = true): ApiActionThunk {
  return async (dispatch, getState) => {
    const { selections } = getState()
    const { peername, name } = selections

    if (peername === '' || name === '') {
      return Promise.reject(new Error('no peername or name selected'))
    }

    const action = {
      type: 'dataset',
      [CALL_API]: {
        endpoint: '',
        method: 'GET',
        params: { fsi },
        segments: {
          peername,
          name
        },
        map: mapDataset
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
        endpoint: '',
        method: 'GET',
        segments: {
          peername: selections.peername,
          name: selections.name,
          path: commit
        },
        map: mapDataset
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
        map: mapStatus
      }
    })

    return response
  }
}

export function fetchWorkingHistory (page: number = 1, pageSize: number = pageSizeDefault, invalidatePagination: boolean = false): ApiActionThunk {
  return async (dispatch, getState) => {
    const state = getState()

    const { page: confirmedPage, bailEarly } = actionWithPagination(invalidatePagination, page, state.workingDataset.history.pageInfo)

    if (bailEarly) return new Promise(resolve => resolve())

    const { selections, myDatasets } = getState()
    const { peername, name } = selections

    const fsi = lookupFsi(peername, name, myDatasets)

    const action = {
      type: 'history',
      [CALL_API]: {
        endpoint: 'history',
        method: 'GET',
        params: { fsi },
        segments: {
          peername: peername,
          name: name
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

export function fetchWorkingStatus (): ApiActionThunk {
  return async (dispatch, getState) => {
    const { workingDataset } = getState()
    const { peername, name, fsiPath } = workingDataset
    const action = {
      type: 'status',
      [CALL_API]: {
        endpoint: 'status',
        method: 'GET',
        params: { fsi: !!fsiPath },
        segments: {
          peername: peername,
          name: name
        },
        map: mapStatus
      }
    }

    return dispatch(action)
  }
}

interface ActionWithPaginationRes {
  page: number
  bailEarly: boolean
}

export function fetchBody (page: number = 1, pageSize: number = bodyPageSizeDefault, invalidatePagination: boolean = false): ApiActionThunk {
  return async (dispatch, getState) => {
    const { workingDataset, selections } = getState()
    const { peername, name } = selections
    const { path, fsiPath } = workingDataset

    const { page: confirmedPage, bailEarly } = actionWithPagination(invalidatePagination, page, workingDataset.components.body.pageInfo)

    if (bailEarly) return new Promise(resolve => resolve())

    const action = {
      type: 'body',
      [CALL_API]: {
        endpoint: 'body',
        method: 'GET',
        pageInfo: {
          page: confirmedPage,
          pageSize
        },
        params: { fsi: !!fsiPath },
        segments: {
          peername,
          name,
          path
        },
        map: mapDataset
      }
    }

    return dispatch(action)
  }
}

export function fetchCommitBody (page: number = 1, pageSize: number = bodyPageSizeDefault, invalidatePagination: boolean = false): ApiActionThunk {
  return async (dispatch, getState) => {
    const { selections, commitDetails } = getState()
    let { peername, name, commit: path } = selections

    const { page: confirmedPage, bailEarly } = actionWithPagination(invalidatePagination, page, commitDetails.components.body.pageInfo)

    if (bailEarly) return new Promise(resolve => resolve())

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
          peername,
          name,
          path
        },
        map: mapDataset
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
        },
        map: mapDataset
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
      dispatch(setWorkingDataset(peername, name))
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
        },
        map: mapDataset
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
      const { peername } = data.find((dataset: DatasetSummary) => dataset.name === name)
      dispatch(setWorkingDataset(peername, name))
      dispatch(setActiveTab('status'))
      dispatch(setSelectedListItem('component', 'meta'))
    } catch (action) {
      throw action
    }
    return response
  }
}

export function publishDataset (): ApiActionThunk {
  return async (dispatch, getState) => {
    const { workingDataset } = getState()
    const { peername, name } = workingDataset
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
      await whenOk(fetchWorkingDatasetDetails())(response)
      response = await dispatch(setWorkingDataset(peername, name))
    } catch (action) {
      throw action
    }
    // return response
    return dispatch(openToast('success', 'dataset published'))
  }
}

export function unpublishDataset (): ApiActionThunk {
  return async (dispatch, getState) => {
    const { workingDataset } = getState()
    const { peername, name } = workingDataset
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
      await whenOk(fetchWorkingDatasetDetails())(response)
      response = await dispatch(setWorkingDataset(peername, name))
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

export function removeDataset (peername: string, name: string, removeFiles: boolean = false): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'remove',
      [CALL_API]: {
        endpoint: 'remove',
        method: 'DELETE',
        segments: {
          peername,
          name
        },
        params: {
          files: removeFiles
        }
      }
    }
    return dispatch(action)
  }
}

// remove the specified dataset, then refresh the dataset list
export function removeDatasetAndFetch (peername: string, name: string, removeFiles: boolean): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    let response: Action

    try {
      response = await removeDataset(peername, name, removeFiles)(dispatch, getState)
      response = await whenOk(fetchMyDatasets())(response)
    } catch (action) {
      throw action
    }
    return response
  }
}
