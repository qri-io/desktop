import { LaunchedFetchesAction, ApiActionThunk } from '../store/api'
import fnv from 'fnv-plus'
import cloneDeep from 'clone-deep'

import {
  setCommitTitle,
  setCommitMessage,
  setMutationsStatus,
  setMutationsDataset,
  resetMutationsDataset,
  resetMutationsStatus
} from './mutations'

import {
  fetchBody,
  fetchCommitBody,
  fetchCommitDataset,
  fetchCommitStatus,
  fetchLog,
  fetchWorkingDataset,
  fetchWorkingStatus,
  fsiWrite
} from './api'

import { Dataset } from '../models/dataset'
import { Status } from '../models/store'
import { selectWorkingDataset, selectStatusFromMutations, selectWorkingDatasetIsLoading, selectWorkingDatasetUsername, selectWorkingDatasetName, selectDatasetIsLoading, selectDatasetPath, selectDatasetName, selectDatasetUsername } from '../selections'
import { QriRef } from '../models/qriRef'

// fetchworkBench makes the necessary API requests to populate the workbench
// based on what we know about the working dataset from the state tree
// the returned promise resolves to true if loading thunks have been kicked off
export function fetchWorkbench (qriRef: QriRef): LaunchedFetchesAction {
  return async (dispatch, getState) => {
    const state = getState()
    const workingIsLoading = selectWorkingDatasetIsLoading(state)
    const workingUsername = selectWorkingDatasetUsername(state)
    const workingName = selectWorkingDatasetName(state)
    const { username: routeUsername, name: routeName, path: routePath = '' } = qriRef

    if (!routeUsername || !routeName) {
      return false
    }

    let fetching: boolean = true

    if (!workingIsLoading &&
       (routeUsername !== workingUsername ||
        routeName !== workingName)) {
      fetchLog(routeUsername, routeName)(dispatch, getState)
      dispatch(resetMutationsDataset())
      dispatch(resetMutationsStatus())
      dispatch(fetchWorkingDataset(routeUsername, routeName))
      dispatch(fetchWorkingStatus(routeUsername, routeName))
      dispatch(fetchBody(routeUsername, routeName, -1))
      dispatch(setCommitTitle(''))
      dispatch(setCommitMessage(''))
      if (routePath === '') {
        return fetching
      }
    }

    const versionIsLoading = selectDatasetIsLoading(state)
    const versionUsername = selectDatasetUsername(state)
    const versionName = selectDatasetName(state)
    const versionPath = selectDatasetPath(state)

    if (!versionIsLoading &&
        routePath !== '' &&
        (routeUsername !== versionUsername ||
         routeName !== versionName ||
         routePath !== versionPath)) {
      dispatch(fetchCommitDataset(routeUsername, routeName, routePath))
      dispatch(fetchCommitStatus(routeUsername, routeName, routePath))
      dispatch(fetchCommitBody(routeUsername, routeName, routePath, -1))
      return fetching
    }

    return false
  }
}

export function writeDataset (username: string, name: string, writeDataset: Dataset): ApiActionThunk {
  return async (dispatch, getState) => {
    const state = getState()
    const head = selectWorkingDataset(state)
    const prevStatus = selectStatusFromMutations(state)
    const newStatus = determineMutationsStatus(head, writeDataset, prevStatus)
    if (state.workingDataset.fsiPath !== '') {
      fsiWrite(username, name, writeDataset)(dispatch, getState)
    }
    dispatch(setMutationsStatus(newStatus))
    return dispatch(setMutationsDataset(writeDataset))
  }
}

/**
 * determineMutationsStatus compares the hash of each dataset component of the
 * head dataset to the proposed mutation dataset. Any change is recorded in status
 */
function determineMutationsStatus (head: Dataset, mutation: Dataset, prevStatus: Status): Status {
  let s = cloneDeep(prevStatus)
  let d = { ...mutation }
  Object.keys(d).forEach((componentName: string) => {
    if (!head[componentName]) {
      s[componentName] = { ...s[componentName], filepath: componentName, status: 'add' }
      return
    }
    /**
     * TODO (ramfox): in the near future, let's keep hashes of each dataset
     * component in the state tree so we don't have to calculate it each time
     * perhaps as a key value field on workingDataset `componentHashes`?
     * Don't want to alter the state tree until methodologies are more settled
     */
    const headHash = fnv.hash(head[componentName])
    const mutationHash = fnv.hash(mutation[componentName])
    if (headHash.value === mutationHash.value) {
      s[componentName] = { ...s[componentName], filepath: componentName, status: 'unmodified' }
      return
    }
    s[componentName] = { ...s[componentName], filepath: componentName, status: 'modified' }
  })

  // if there is a bodyPath, adjust the body status
  /**
   * TODO (ramfox): We don't know at this current state if the underlying contents
   * of the body file and the given body are the same, but that is an outlying
   * error I feel comfortable punting on for now
   */
  if (s.bodyPath) {
    // if bodyPath is empty then there is no
    s.body = { ...s.body, status: d.bodyPath === '' ? 'unmodified' : 'modified' }
    delete s.bodyPath
  }
  return s
}
