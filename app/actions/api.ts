import { Action, AnyAction } from 'redux'
import { push } from 'connected-react-router'

import { CALL_API, ApiAction, ApiActionThunk, chainSuccess } from '../store/api'
import { SelectedComponent, MyDatasets } from '../models/store'
import { actionWithPagination } from '../utils/pagination'
import { openToast, setImportFileDetails } from './ui'
import { setSaveComplete } from './mutations'
import { setWorkingDataset, setSelectedListItem, setActiveTab, clearSelection } from './selections'
import {
  mapDataset,
  mapRecord,
  mapVersionInfo,
  mapStatus,
  mapBody
} from './mappingFuncs'
import { getActionType } from '../utils/actionType'

import { CLEAR_DATASET_HEAD } from '../reducers/commitDetail'

const pageSizeDefault = 100
export const bodyPageSizeDefault = 50

const DEFAULT_SELECTED_COMPONENT = 'body'

// look up the username/name in myDatasets, return boolean for existence of fsiPath
function lookupFsi (username: string | null, name: string | null, myDatasets: MyDatasets) {
  const dataset = myDatasets.value.find((dataset) => {
    return dataset.username === username && dataset.name === name
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
    // we still need the working dataset because it contains the history
    if (getActionType(response) === 'failure') {
      if (response.payload.err.code !== 422) {
        return response
      }
      response = await fetchWorkingDataset()(dispatch, getState)
    }
    response = await whenOk(fetchWorkingStatus())(response)
    response = await whenOk(fetchBody(-1))(response)
    response = await whenOk(fetchStats())(response)
    response = await whenOk(fetchHistory(-1))(response)

    return response
  }
}

export function fetchWorkingDatasetAndStatus (): ApiActionThunk {
  return async (dispatch, getState) => {
    let response: AnyAction

    await fetchWorkingDataset()(dispatch, getState).then(() => {
      response = dispatch(fetchWorkingStatus())
    })

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
        map: mapVersionInfo
      }
    }

    return dispatch(listAction)
  }
}

export function fetchWorkingDataset (): ApiActionThunk {
  return async (dispatch, getState) => {
    const { selections, myDatasets } = getState()
    const { peername, name } = selections

    if (peername === '' || name === '') {
      return Promise.reject(new Error('no peername or name selected'))
    }
    // look up the peername + name in myDatasets to determine whether it is FSI linked
    const dataset = myDatasets.value.find((d) => (d.username === peername) && (d.name === name))
    if (!dataset) {
      return Promise.reject(new Error('could not find dataset in list'))
    }
    const { fsiPath } = dataset

    const action = {
      type: 'dataset',
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

    if (commit === '') {
      return dispatch({
        type: CLEAR_DATASET_HEAD,
        peername: selections.peername,
        name: selections.name
      })
    }

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

    if (commit === '') {
      return dispatch({
        type: CLEAR_DATASET_HEAD,
        peername: selections.peername,
        name: selections.name
      })
    }

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
export function fetchHistory (page: number = 1, pageSize: number = pageSizeDefault): ApiActionThunk {
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
        }
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
    const { workingDataset, selections, myDatasets } = getState()
    const { peername, name } = selections
    const { path } = workingDataset

    // look up the peername + name in myDatasets to determine whether it is FSI linked
    const dataset = myDatasets.value.find((d) => (d.username === peername) && (d.name === name))
    if (!dataset) {
      return Promise.reject(new Error('could not find dataset in list'))
    }
    const { fsiPath } = dataset

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

    if (path === '') {
      return dispatch({
        type: CLEAR_DATASET_HEAD,
        peername: selections.peername,
        name: selections.name
      })
    }

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

    if (selections.commit === '') {
      return dispatch({
        type: CLEAR_DATASET_HEAD,
        peername: selections.peername,
        name: selections.name
      })
    }

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
    let path: string
    try {
      response = await saveWorkingDataset()(dispatch, getState)
      path = response.payload.data.path
      response = await whenOk(fetchWorkingDatasetDetails())(response)
    } catch (action) {
      dispatch(setSaveComplete(action.payload.err.message))
      dispatch(openToast('error', 'commit', action.payload.err.message))
      throw action
    }
    if (getActionType(response) === 'success') {
      dispatch(setSaveComplete())
      dispatch(openToast('success', 'commit', 'commit success!'))
      dispatch(setSelectedListItem('commit', path))
      dispatch(setActiveTab('history'))
      dispatch(setSelectedListItem('commitComponent', DEFAULT_SELECTED_COMPONENT))
    }
    return response
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
      // reset pagination
      response = await whenOk(fetchMyDatasets(-1))(response)
      dispatch(setWorkingDataset(peername, name))
      dispatch(setActiveTab('history'))
      dispatch(setSelectedListItem('component', DEFAULT_SELECTED_COMPONENT))
      dispatch(push('/workbench'))
    } catch (action) {
      dispatch(openToast('error', 'add', action.payload.err.message))
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
    return dispatch(openToast('success', 'publish', 'dataset published'))
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
    return dispatch(openToast('success', 'unpublish', 'dataset unpublished'))
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
      dispatch(openToast('success', 'remove', `Removed ${peername}/${name}`))
    } catch (action) {
      dispatch(openToast('error', 'remove', action.payload.err.message))
      throw action
    }

    return response
  }
}

// remove the specified dataset, then refresh the dataset list
export function removeDatasetAndFetch (peername: string, name: string, isLinked: boolean, keepFiles: boolean): ApiActionThunk {
  return async (dispatch, getState) => {
    let response: Action

    try {
      response = await removeDataset(peername, name, isLinked, keepFiles)(dispatch, getState)
    } catch (action) {
      if (!action.payload.err.message.contains('directory not empty')) {
        throw action
      }
    }
    // reset pagination
    dispatch(clearSelection())
    response = await fetchMyDatasets(-1)(dispatch, getState)
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
      dispatch(openToast('success', 'rename', `Dataset renamed`))
    } catch (action) {
      dispatch(openToast('error', 'rename', action.payload.err.message))
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
    } catch (action) {
      dispatch(setImportFileDetails('', 0))
      dispatch(openToast('error', 'import', action.payload.err.message))
      throw action
    }
    dispatch(setActiveTab('history'))
    dispatch(setSelectedListItem('component', DEFAULT_SELECTED_COMPONENT))
    dispatch(push('workbench'))
    dispatch(setImportFileDetails('', 0))
    return response
  }
}
