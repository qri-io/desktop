import {
  SET_COMMIT_TITLE,
  SET_COMMIT_MESSAGE,
  SAVE_COMPLETE,
  MUTATIONS_SET_DATASET,
  MUTATIONS_RESET_DATASET,
  MUTATIONS_SET_STATUS,
  MUTATIONS_RESET_STATUS,
  MUTATIONS_DATASET_MODIFIED,
  MUTATIONS_DISCARD_CHANGES
} from '../reducers/mutations'
import Dataset from '../models/dataset'
import { Status } from '../models/store'

export function setCommitTitle (title: string) {
  return {
    type: SET_COMMIT_TITLE,
    title
  }
}

export function setCommitMessage (message: string) {
  return {
    type: SET_COMMIT_MESSAGE,
    message
  }
}

export function setSaveComplete (error?: string) {
  return {
    type: SAVE_COMPLETE,
    error
  }
}

export function resetMutationsDataset () {
  return {
    type: MUTATIONS_RESET_DATASET
  }
}

export function resetMutationsStatus () {
  return {
    type: MUTATIONS_RESET_STATUS
  }
}

export function setMutationsStatus (status: Status) {
  return {
    type: MUTATIONS_SET_STATUS,
    status
  }
}

export function setMutationsDataset (data: Dataset) {
  return {
    type: MUTATIONS_SET_DATASET,
    dataset: data
  }
}

export function discardMutationsChanges (component: string) {
  return {
    type: MUTATIONS_DISCARD_CHANGES,
    component
  }
}

export function datasetModified (modified: boolean) {
  return {
    type: MUTATIONS_DATASET_MODIFIED,
    modified
  }
}
