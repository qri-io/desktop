import { PROGRESS_UPDATE, PROGRESS_COMPLETE } from '../reducers/progress'
import { ProgressEvent } from '../models/store'

export const updateProgress = (progress: ProgressEvent) => {
  return {
    type: PROGRESS_UPDATE,
    payload: { progress }
  }
}

export const completeProgress = (progress: ProgressEvent) => {
  return {
    type: PROGRESS_COMPLETE,
    payload: { progress }
  }
}
