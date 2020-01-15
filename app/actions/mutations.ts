import {
  SET_COMMIT_TITLE,
  SET_COMMIT_MESSAGE,
  SAVE_COMPLETE
} from '../reducers/mutations'

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
