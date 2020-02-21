import {
  SET_COMMIT_TITLE,
  SET_COMMIT_MESSAGE,
  SAVE_COMPLETE,
  MUTATIONS_SET_DATASET,
  MUTATIONS_RESET_DATASET,
  MUTATIONS_DATASET_MODIFIED
} from '../reducers/mutations'
import Dataset from '../models/dataset'

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

export function resetDataset () {
  return {
    type: MUTATIONS_RESET_DATASET
  }
}

export function setDataset (data: Dataset) {
  return {
    type: MUTATIONS_SET_DATASET,
    dataset: data
  }
}

export function datasetModified (modified: boolean) {
  return {
    type: MUTATIONS_DATASET_MODIFIED,
    modified
  }
}
