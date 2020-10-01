import { Reducer, AnyAction } from 'redux'

import { ProgressStore, ProgressDetails } from '../models/store'

export const PROGRESS_UPDATE = 'PROGRESS_UPDATE'
export const PROGRESS_COMPLETE = 'PROGRESS_COMPLETE'

const initialState: ProgressStore = {
  progress: []
}

const progressReducer: Reducer = (state = initialState, action: AnyAction): ProgressStore => {
  switch (action.type) {
    case PROGRESS_UPDATE:
      let p = action.payload.progress
      let percentComplete = 0
      if (p.progress.length > 0) {
        percentComplete = p.progress.reduce((a: number, b: number) => a + b) / p.progress.length
      }
      let progressDetails: ProgressDetails = {
        username: p.dsref.username,
        name: p.dsref.name,
        path: p.dsref.path,
        profileID: p.dsref.profileID,
        initID: p.dsref.initID,
        type: p.type,
        isComplete: false,
        percentComplete: percentComplete
      }
      let i = state.progress.findIndex(pd => pd.path === progressDetails.path && pd.type === progressDetails.type)
      if (i === -1) {
        state.progress.push(progressDetails)
        return {
          ...state,
          progress: state.progress
        }
      } else {
        state.progress[i] = progressDetails
        return {
          ...state,
          progress: state.progress
        }
      }
    case PROGRESS_COMPLETE:
      p = action.payload.progress
      progressDetails = {
        username: p.dsref.username,
        name: p.dsref.name,
        path: p.dsref.path,
        profileID: p.dsref.profileID,
        initID: p.dsref.initID,
        type: p.type,
        isComplete: true,
        percentComplete: 100
      }
      i = state.progress.findIndex(pd => pd.path === progressDetails.path && pd.type === progressDetails.type)
      if (i === -1) {
        return state
      } else {
        state.progress[i] = progressDetails
        return {
          ...state,
          progress: state.progress
        }
      }
  }
  return state
}

export default progressReducer
