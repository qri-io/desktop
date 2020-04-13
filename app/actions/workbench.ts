import { LaunchedFetchesAction, ApiActionThunk } from '../store/api'
import fnv from 'fnv-plus'
import cloneDeep from 'clone-deep'

import {
  setCommitTitle,
  setCommitMessage,
  setMutationsStatus,
  setMutationsDataset
} from './mutations'

import {
  fetchBody,
  fetchCommitBody,
  fetchCommitDataset,
  fetchCommitStats,
  fetchCommitStatus,
  fetchHistory,
  fetchStats,
  fetchWorkingDataset,
  fetchWorkingStatus,
  fsiWrite
} from './api'
import { setCommit } from './selections'
import { Dataset } from '../models/dataset'
import { Status } from '../models/store'
import { selectWorkingDataset, selectStatusFromMutations } from '../selections'
import { QriRef } from '../models/qriRef'

// fetchworkBench makes the necessary API requests to populate the workbench
// based on what we know about the working dataset from the state tree
// the returned promise resolves to true if loading thunks have been kicked off
export function fetchWorkbench (qriRef: QriRef): LaunchedFetchesAction {
  return async (dispatch, getState) => {
    console.log('in fetchWorkbench')
    console.log(qriRef)
    const { workingDataset, selections, commitDetails } = getState()
    const { username, name, path = '' } = qriRef

    if (!username || !name) {
      return false
    }
    const head = commitDetails
    const history = workingDataset.history
    let fetching: boolean = true

    if (!workingDataset.isLoading &&
       (selections.peername !== workingDataset.peername ||
        selections.name !== workingDataset.name)) {
      dispatch(fetchHistory(username, name))
      dispatch(fetchWorkingDataset(username, name))
      dispatch(fetchWorkingStatus(username, name))
      dispatch(fetchStats(username, name))
      dispatch(fetchBody(username, name, -1))
      dispatch(setCommitTitle(''))
      dispatch(setCommitMessage(''))
      return fetching
    }

    if (!head.isLoading &&
        (selections.peername !== head.peername ||
         selections.name !== head.name ||
         selections.commit !== head.path)) {
      dispatch(fetchCommitDataset(username, name, path))
      dispatch(fetchCommitStats(username, name, path))
      dispatch(fetchCommitStatus(username, name, path))
      dispatch(fetchCommitBody(username, name, path, -1))
      return fetching
    }

    if (selections.commit === '' && history.value.length !== 0) {
      dispatch(setCommit(history.value[0].path))
    }

    return false
  }
}

export function writeDataset (peername: string, name: string, writeDataset: Dataset): ApiActionThunk {
  return async (dispatch, getState) => {
    const state = getState()
    const head = selectWorkingDataset(state)
    const prevStatus = selectStatusFromMutations(state)
    const newStatus = determineMutationsStatus(head, writeDataset, prevStatus)
    if (state.workingDataset.fsiPath !== '') {
      fsiWrite(peername, name, writeDataset)(dispatch, getState)
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
