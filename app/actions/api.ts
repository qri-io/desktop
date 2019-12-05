import { Action, AnyAction } from 'redux'

import { CALL_API, ApiAction, ApiActionThunk, chainSuccess, ApiResponseAction } from '../store/api'
import { DatasetSummary, SelectedComponent, MyDatasets } from '../models/store'
import { actionWithPagination } from '../utils/pagination'
import { openToast, setImportFileDetails } from './ui'
import { setWorkingDataset, setSelectedListItem, setActiveTab, setRoute } from './selections'
import {
  mapDataset,
  mapRecord,
  mapDatasetSummary,
  mapStatus,
  mapHistory,
  mapBody
} from './mappingFuncs'
import { getActionType } from '../utils/actionType'

const pageSizeDefault = 50
export const bodyPageSizeDefault = 50

const DEFAULT_SELECTED_COMPONENT = 'body'

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
    response = await whenOk(fetchBody(-1))(response)
    response = await whenOk(fetchStats())(response)
    response = await whenOk(fetchWorkingHistory(-1))(response)

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
        query: { fsi: !!fsiPath },
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
        query: { fsi: !!fsiPath },
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

// to invalidate pagination, set page to -1
export function fetchMyDatasets (page: number = 1, pageSize: number = pageSizeDefault): ApiActionThunk {
  return async (dispatch, getState) => {
    const state = getState()
    const { page: confirmedPage, doNotFetch } = actionWithPagination(page, state.myDatasets.pageInfo)

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
        query: { fsi },
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
    response = await whenOk(fetchCommitBody(-1))(response)
    response = await whenOk(fetchCommitStats())(response)

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

// to invalidate pagination, set page to -1
export function fetchWorkingHistory (page: number = 1, pageSize: number = pageSizeDefault): ApiActionThunk {
  return async (dispatch, getState) => {
    const state = getState()

    const { page: confirmedPage, doNotFetch } = actionWithPagination(page, state.workingDataset.history.pageInfo)

    // we need to emit a 'success' type, or our chainSuccess functions will fail
    if (doNotFetch) return new Promise(resolve => resolve({ type: 'SUCCESS' }))

    const { selections, myDatasets } = getState()
    const { peername, name } = selections

    const fsi = lookupFsi(peername, name, myDatasets)

    const action = {
      type: 'history',
      [CALL_API]: {
        endpoint: 'history',
        method: 'GET',
        query: { fsi },
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
        query: { fsi: !!fsiPath },
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

// to invalidate pagination, set page to -1
export function fetchBody (page: number = 1, pageSize: number = bodyPageSizeDefault): ApiActionThunk {
  return async (dispatch, getState) => {
    const { workingDataset, selections } = getState()
    const { peername, name } = selections
    const { path, fsiPath } = workingDataset

    const { page: confirmedPage, doNotFetch } = actionWithPagination(page, workingDataset.components.body.pageInfo)

    // we need to emit a 'success' type, or our chainSuccess functions will fail
    if (doNotFetch) return new Promise(resolve => resolve({ type: 'SUCCESS' }))

    const action = {
      type: 'body',
      [CALL_API]: {
        endpoint: 'body',
        method: 'GET',
        pageInfo: {
          page: confirmedPage,
          pageSize
        },
        query: { fsi: !!fsiPath },
        segments: {
          peername,
          name,
          path
        },
        map: mapBody
      }
    }

    return dispatch(action)
  }
}

// to invalidate pagination, set page to -1
export function fetchCommitBody (page: number = 1, pageSize: number = bodyPageSizeDefault): ApiActionThunk {
  return async (dispatch, getState) => {
    const { selections, commitDetails } = getState()
    let { peername, name, commit: path } = selections

    const { page: confirmedPage, doNotFetch } = actionWithPagination(page, commitDetails.components.body.pageInfo)

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
          peername,
          name,
          path
        },
        map: mapBody
      }
    }
    return dispatch(action)
  }
}

export function fetchStats ():
ApiActionThunk {
  return async (dispatch, getState) => {
    const { selections, workingDataset } = getState()

    const response = await dispatch({
      type: 'stats',
      [CALL_API]: {
        endpoint: 'stats',
        method: 'GET',
        segments: {
          peername: selections.peername,
          name: selections.name
        },
        query: {
          fsi: !!workingDataset.fsiPath
        }
      }
    })

    return response
  }
}

export function fetchCommitStats ():
ApiActionThunk {
  return async (dispatch, getState) => {
    const { selections } = getState()

    const response = await dispatch({
      type: 'commitstats',
      [CALL_API]: {
        endpoint: 'stats',
        method: 'GET',
        segments: {
          peername: selections.peername,
          name: selections.name,
          path: selections.commit
        },
        query: {
          fsi: false
        }
      }
    })

    return response
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
        query: {
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

export function saveWorkingDatasetAndFetch (): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    let response: Action

    response = await saveWorkingDataset()(dispatch, getState)
    response = await whenOk(fetchWorkingDatasetDetails())(response)

    return response
  }
}

export function addDataset (peername: string, name: string, path: string): ApiActionThunk {
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
        query: {
          dir: path
        },
        map: mapDataset
      }
    }
    return dispatch(action)
  }
}

export function addDatasetAndFetch (peername: string, name: string, path: string): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    let response: Action

    try {
      response = await addDataset(peername, name, path)(dispatch, getState)
      // reset pagination
      response = await whenOk(fetchMyDatasets(-1))(response)
      dispatch(setWorkingDataset(peername, name))
      dispatch(setActiveTab('history'))
      dispatch(setSelectedListItem('component', DEFAULT_SELECTED_COMPONENT))
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
        query: {
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
      // reset pagination
      response = await whenOk(fetchMyDatasets(-1))(response)
      const action = response as ApiResponseAction
      const { data } = action.payload
      const { peername } = data.find((dataset: DatasetSummary) => dataset.name === name)
      dispatch(setWorkingDataset(peername, name))
      dispatch(setActiveTab('status'))
      dispatch(setSelectedListItem('component', DEFAULT_SELECTED_COMPONENT))
      dispatch(setRoute('/dataset'))
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
      await whenOk(fetchWorkingDataset())(response)
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
      await whenOk(fetchWorkingDataset())(response)
    } catch (action) {
      throw action
    }
    // return response
    return dispatch(openToast('success', 'dataset unpublished'))
  }
}

export function linkDataset (peername: string, name: string, dir: string): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'checkout',
      [CALL_API]: {
        endpoint: 'checkout',
        method: 'POST',
        segments: {
          peername,
          name
        },
        query: {
          dir
        }
      }
    }
    return dispatch(action)
  }
}

export function linkDatasetAndFetch (peername: string, name: string, dir: string): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    let response: Action

    try {
      response = await linkDataset(peername, name, dir)(dispatch, getState)
      response = await whenOk(fetchWorkingDatasetDetails())(response)
      // reset pagination
      response = await whenOk(fetchMyDatasets(-1))(response)
    } catch (action) {
      throw action
    }
    return response
  }
}

export function discardChanges (component: SelectedComponent): ApiActionThunk {
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
          query: {
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

export function removeDataset (
  peername: string,
  name: string,
  isLinked: boolean = false,
  keepFiles: boolean = true
): ApiActionThunk {
  var query: {}
  if (isLinked) {
    if (keepFiles) {
      query = { 'keep-files': true }
    } else {
      query = { 'force': true }
    }
  }

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
        query
      }
    }

    let response: Action
    try {
      response = await dispatch(action)
      dispatch(openToast('success', `Removed ${peername}/${name}`))
    } catch (action) {
      dispatch(openToast('error', action.payload.err.message))
      throw action
    }

    return response
  }
}

// remove the specified dataset, then refresh the dataset list
export function removeDatasetAndFetch (peername: string, name: string, isLinked: boolean, keepFiles: boolean): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    let response: Action

    try {
      response = await removeDataset(peername, name, isLinked, keepFiles)(dispatch, getState)
      // reset pagination
      response = await whenOk(fetchMyDatasets(-1))(response)
    } catch (action) {
      throw action
    }
    return response
  }
}

export function fsiWrite (peername: string, name: string, dataset: any): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'fsiWrite',
      [CALL_API]: {
        endpoint: 'fsi/write',
        method: 'POST',
        segments: {
          peername,
          name
        },
        body: dataset
      }
    }
    return dispatch(action)
  }
}

export function fsiWriteAndFetch (peername: string, name: string, dataset: any): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    let response: Action

    response = await fsiWrite(peername, name, dataset)(dispatch, getState)
    // reset pagination
    response = await whenOk(fetchWorkingDatasetDetails())(response)
    return response
  }
}

export function fetchReadmePreview (peername: string, name: string): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'render',
      [CALL_API]: {
        endpoint: 'render',
        method: 'GET',
        query: { fsi: true },
        segments: {
          peername,
          name
        }
      }
    }
    return dispatch(action)
  }
}

// peername and name are the dataset to be renamed
// newName is the new dataset's name, which will be in the user's namespace
export function renameDataset (peername: string, name: string, newName: string): ApiActionThunk {
  return async (dispatch, getState) => {
    const { peername: newPeername } = getState().session
    const whenOk = chainSuccess(dispatch, getState)
    const action = {
      type: 'rename',
      [CALL_API]: {
        endpoint: 'rename',
        method: 'POST',
        body: {
          current: `${peername}/${name}`,
          new: `${newPeername}/${newName}`
        }
      }
    }
    let response: Action
    try {
      response = await dispatch(action)
      response = await whenOk(fetchMyDatasets(-1))(response)
      dispatch(openToast('success', `Dataset renamed`))
    } catch (action) {
      dispatch(openToast('error', action.payload.err.message))
      throw action
    }
    return response
  }
}

export function importFile (filePath: string, fileName: string, fileSize: number): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    const action = {
      type: 'import',
      [CALL_API]: {
        endpoint: 'save',
        method: 'POST',
        query: {
          bodypath: filePath,
          new: true
        },
        body: {}
      }
    }
    let response: Action
    try {
      dispatch(setImportFileDetails(fileName, fileSize))
      response = await dispatch(action)
      const { peername, name } = response.payload.data
      
      response = await whenOk(fetchMyDatasets(-1))(response)
      dispatch(setWorkingDataset(peername, name))
      dispatch(setActiveTab('history'))
      dispatch(setSelectedListItem('component', DEFAULT_SELECTED_COMPONENT))
      dispatch(setRoute('/dataset'))
      dispatch(setImportFileDetails('', 0))
    } catch (action) {
      dispatch(setImportFileDetails('', 0))
      dispatch(openToast('error', action.payload.err.message))
      throw action
    }
    return response
  }
}
