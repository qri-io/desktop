import { Action, AnyAction } from 'redux'
import { push } from 'connected-react-router'

import {
  mapDataset,
  mapRecord,
  mapVersionInfo,
  mapStatus,
  mapBody,
  mapHistory
} from './mappingFuncs'
import { SelectedComponent, VersionInfo } from '../models/store'
import {
  setSaveComplete,
  resetMutationsDataset,
  resetMutationsStatus,
  discardMutationsChanges
} from './mutations'
import Dataset from '../models/dataset'
import { pathToDataset, pathToCollection, pathToChangeReport } from '../paths'
import { CLEAR_DATASET_HEAD } from '../reducers/dataset'
import { selectWorkingDatasetBodyPageInfo,
  selectFsiPath,
  selectMutationsCommit,
  selectSessionUsername,
  selectMyDatasetsPageInfo,
  selectDatasetBodyPageInfo,
  selectLogPageInfo,
  selectMutationsDataset,
  selectLog
} from '../selections'
import { CALL_API, ApiAction, ApiActionThunk, chainSuccess } from '../store/api'
import { openToast, setBulkActionExecuting } from './ui'
import { actionWithPagination } from '../utils/pagination'
import { getActionType } from '../utils/actionType'
import { datasetConvertStringToScriptBytes } from '../utils/datasetConvertStringToScriptBytes'
import { QriRef, refStringFromQriRef } from '../models/qriRef'

const pageSizeDefault = 100
export const bodyPageSizeDefault = 50

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
export function fetchWorkingDatasetDetails (username: string, name: string): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    let response: AnyAction
    response = await fetchWorkingDataset(username, name)(dispatch, getState)
    // if the response returned in error, check the error
    // if it's 422, it means the dataset exists, it's just not linked to the filesystem
    // we still need the working dataset because it contains the history
    if (getActionType(response) === 'failure') {
      if (response.payload.err.code !== 422) {
        return response
      }
      response = await fetchWorkingDataset(username, name)(dispatch, getState)
    }
    if (response.payload.data.fsiPath) {
      response = await whenOk(fetchWorkingStatus(username, name))(response)
    }
    response = await whenOk(fetchBody(username, name, -1))(response)
    response = await whenOk(fetchStats(username, name))(response)
    response = await whenOk(fetchLog(username, name, -1))(response)

    return response
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

export function fetchWorkingDataset (username: string, name: string): ApiActionThunk {
  return async (dispatch) => {
    if (username === '' || name === '') {
      return Promise.reject(new Error('no username or name selected'))
    }

    const action = {
      type: 'dataset',
      [CALL_API]: {
        endpoint: 'get',
        method: 'GET',
        segments: {
          username,
          name
        },
        map: mapDataset
      }
    }
    return dispatch(action)
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
        endpoint: 'get',
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

export function fetchWorkingStatus (username: string, name: string): ApiActionThunk {
  return async (dispatch) => {
    if (username === '' || name === '') {
      return Promise.reject(new Error('no username or name selected'))
    }
    const action = {
      type: 'status',
      [CALL_API]: {
        endpoint: 'status',
        method: 'GET',
        segments: {
          username,
          name
        },
        map: mapStatus
      }
    }

    return dispatch(action)
  }
}

// to invalidate pagination, set page to -1
export function fetchBody (username: string, name: string, page: number = 1, pageSize: number = bodyPageSizeDefault): ApiActionThunk {
  return async (dispatch, getState) => {
    const bodyPageInfo = selectWorkingDatasetBodyPageInfo(getState())

    const { page: confirmedPage, doNotFetch } = actionWithPagination(page, bodyPageInfo)

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
        segments: {
          username,
          name
        },
        map: mapBody
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

export function saveWorkingDataset (username: string, name: string): ApiActionThunk {
  return async (dispatch, getState) => {
    const state = getState()
    const fsiPath = selectFsiPath(state)
    const commit = selectMutationsCommit(state)
    const mutationsDataset = selectMutationsDataset(state)
    let dataset: Dataset

    // When a dataset is linked, qri will look to the filesystem to pull the dataset save
    // therefore we only need to send over the contents of the commit in order to save
    // correctly
    if (fsiPath) {
      dataset = {
        commit
      }
    } else {
      dataset = {
        ...mutationsDataset,
        commit
      }
    }

    const action = {
      type: 'save',
      [CALL_API]: {
        endpoint: 'save',
        method: 'POST',
        segments: {
          username,
          name
        },
        body: datasetConvertStringToScriptBytes(dataset)
      }
    }

    return dispatch(action)
  }
}

export function saveWorkingDatasetAndDirectToChangeReport (username: string, name: string): ApiActionThunk {
  return async (dispatch, getState) => {
    let path: string
    const log = selectLog(getState())

    return saveWorkingDataset(username, name)(dispatch, getState)
      .then(async (response) => {
        if (getActionType(response) === 'failure') throw response
        path = response.payload.data.path
        response = await fetchWorkingDatasetDetails(username, name)(dispatch, getState)
        return response
      })
      .then((response) => {
        if (getActionType(response) === 'success') {
          dispatch(setSaveComplete())
          dispatch(fetchMyDatasets(-1))
          dispatch(openToast('success', 'commit', 'commit success!'))
          if (log.length === 0) {
            dispatch(push(pathToDataset(username, name, path)))
            return response
          }
          const prevRef = log[0]
          const newRef = { ...prevRef, path }
          dispatch(push(pathToChangeReport(prevRef, newRef)))
        }
        return response
      })
      .catch((action) => {
        dispatch(setSaveComplete(action.payload.err.message))
        dispatch(openToast('error', 'commit', action.payload.err.message))
        return action
      })
  }
}

export function pullDatasets (refs: VersionInfo[]): ApiActionThunk {
  return async (dispatch) => {
    return Promise.all(
      refs.map(async (ref) => pullDataset(ref.username, ref.name)(dispatch))
    )
  }
}

export function pullDataset (username: string, name: string): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'pull',
      [CALL_API]: {
        endpoint: 'pull',
        method: 'POST',
        segments: {
          username,
          name
        },
        map: mapDataset
      }
    }
    return dispatch(action)
  }
}

export function pullDatasetAndFetch (username: string, name: string): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    let response: Action

    try {
      response = await pullDataset(username, name)(dispatch, getState)
      // reset pagination
      const path = response.payload.data.dataset.path
      response = await whenOk(fetchMyDatasets(-1))(response)
      dispatch(push(pathToDataset(username, name, path)))
    } catch (action) {
      dispatch(openToast('error', 'add', action.payload.err.message))
      throw action
    }
    return response
  }
}

export function publishDataset (username: string, name: string): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    const action = {
      type: 'publish',
      [CALL_API]: {
        endpoint: 'push',
        method: 'POST',
        segments: {
          username,
          name
        }
      }
    }

    try {
      let response: Action
      response = await dispatch(action)
      await whenOk(fetchLog(username, name))(response)
    } catch (action) {
      throw action
    }
    // return response
    return dispatch(openToast('success', 'publish', 'dataset published'))
  }
}

export function unpublishDataset (username: string, name: string): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    const action = {
      type: 'unpublish',
      [CALL_API]: {
        endpoint: 'remove',
        method: 'DELETE',
        segments: {
          username,
          name
        },
        query: {
          remote: 'registry',
          all: true
        }
      }
    }

    try {
      let response: Action
      response = await dispatch(action)
      await whenOk(fetchLog(username, name))(response)
    } catch (action) {
      throw action
    }
    // return response
    return dispatch(openToast('success', 'unpublish', 'dataset unpublished'))
  }
}

export function linkDataset (username: string, name: string, dir: string): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'checkout',
      [CALL_API]: {
        endpoint: 'checkout',
        method: 'POST',
        segments: {
          username,
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

export function linkDatasetAndFetch (username: string, name: string, dir: string): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    let response: Action

    try {
      response = await linkDataset(username, name, dir)(dispatch, getState).then((response) => {
        dispatch(resetMutationsDataset())
        dispatch(resetMutationsStatus())
        return response
      })
      // reset pagination
      response = await whenOk(fetchMyDatasets(-1))(response)
      response = await whenOk(fetchWorkingDatasetDetails(username, name))(response)
    } catch (action) {
      throw action
    }
    return response
  }
}

export function discardChanges (username: string, name: string, component: SelectedComponent): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'restore',
      [CALL_API]: {
        endpoint: 'restore',
        method: 'POST',
        segments: {
          username,
          name
        },
        query: {
          component
        }
      }
    }
    return dispatch(action)
  }
}

export function discardChangesAndFetch (username: string, name: string, component: SelectedComponent): ApiActionThunk {
  return async (dispatch, getState) => {
    let response: Action
    response = await discardChanges(username, name, component)(dispatch, getState)
      .then((res) => {
        dispatch(discardMutationsChanges(component))
        dispatch(fetchWorkingDataset(username, name))
        dispatch(fetchWorkingStatus(username, name))
        return res
      })
    return response
  }
}

export function removeDataset (
  username: string,
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
          username,
          name
        },
        query
      }
    }

    return dispatch(action)
  }
}

// remove the specified datasets, then refresh the dataset list
export function removeDatasetsAndFetch (refs: VersionInfo[], keepFiles: boolean): ApiActionThunk {
  return async (dispatch, getState) => {
    const datasetsString = refs.length === 1 ? `${refs[0].username}/${refs[0].name}` : `${refs.length} datasets`
    try {
      dispatch(setBulkActionExecuting(true))
      dispatch(openToast('info', 'remove', `removing ${datasetsString}`))
      await Promise.all(
        refs.map(async (ref) => removeDataset(ref.username, ref.name, !!ref.fsiPath, keepFiles)(dispatch, getState))
      )
      dispatch(openToast('success', `remove-success`, `removed ${datasetsString}`))
      // reset pagination
      const res = await fetchMyDatasets(-1)(dispatch, getState)
      dispatch(push(pathToCollection()))
      dispatch(setBulkActionExecuting(false))
      return res
    } catch (action) {
      if (!action.payload.err.message.contains('directory not empty')) {
        throw action
      }
      dispatch(openToast('error', 'remove-error', `error removing ${datasetsString}: ${action.payload.err.message}`))
      dispatch(setBulkActionExecuting(false))
      return Promise.reject(action.payload.err.message)
    }
  }
}

export function fsiWrite (username: string, name: string, dataset: any): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'fsiWrite',
      [CALL_API]: {
        endpoint: 'fsi/write',
        method: 'POST',
        segments: {
          username,
          name
        },
        map: mapStatus,
        body: datasetConvertStringToScriptBytes(dataset)
      }
    }
    return dispatch(action)
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

// username and name are the dataset to be renamed
// newName is the new dataset's name, which will be in the user's namespace
export function renameDataset (username: string, name: string, newName: string): ApiActionThunk {
  return async (dispatch, getState) => {
    const state = getState()
    const sessionUsername = selectSessionUsername(state)
    if (username !== sessionUsername) {
      dispatch(openToast('error', 'rename', 'you can only change the name of a dataset in your namespace'))
      throw new Error('user is attempting to change the name of dataset that is not in their namespace')
    }
    const whenOk = chainSuccess(dispatch, getState)
    const action = {
      type: 'rename',
      [CALL_API]: {
        endpoint: 'rename',
        method: 'POST',
        body: {
          current: `${username}/${name}`,
          next: `${username}/${newName}`
        }
      }
    }
    let response: Action
    try {
      response = await dispatch(action)
      response = await whenOk(fetchMyDatasets(-1))(response)
      dispatch(push(state.router.location.pathname.replace(`${username}/${name}`, `${username}/${newName}`)))
      dispatch(openToast('success', 'rename', `Dataset renamed`))
    } catch (action) {
      dispatch(openToast('error', 'rename', action.payload.err.message))
      throw action
    }
    return response
  }
}

export function newDataset (ds: Dataset): ApiActionThunk {
  return async (dispatch, getState) => {
    const whenOk = chainSuccess(dispatch, getState)
    const action = {
      type: 'import',
      [CALL_API]: {
        endpoint: 'save',
        method: 'POST',
        query: {
          new: true
        },
        body: ds
      }
    }

    let response = await dispatch(action)
    // TODO (b5) - 'API_IMPORT_FAILURE' should be a constant
    if (response.type === 'API_IMPORT_FAILURE') {
      dispatch(openToast('error', 'import', response.payload.err.message))
      throw response.payload.err.message
    }

    try {
      const { peername, name, path } = response.payload.data
      response = await whenOk(fetchMyDatasets(-1))(response)
      dispatch(push(pathToDataset(peername, name, path)))
    } catch (err) {
      throw err.payload.err.message
    }

    return response
  }
}

export function fetchChanges (left: QriRef, right: QriRef): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'changes',
      [CALL_API]: {
        endpoint: 'changes',
        method: 'POST',
        body: {
          left: refStringFromQriRef(left, true),
          right: refStringFromQriRef(right, true)
        }
      }
    }
    return dispatch(action)
  }
}
