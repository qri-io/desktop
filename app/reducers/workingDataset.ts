import { Reducer, AnyAction } from 'redux'
import { WorkingDataset } from '../models/store'
import { apiActionTypes } from '../store/api'

const initialState: WorkingDataset = {
  path: '',
  prevPath: '',
  peername: '',
  name: '',
  pages: {},
  diff: {},
  value: {},
  status: {
  },
  history: {
    pageInfo: {
      isFetching: false,
      pageCount: 0,
      fetchedAll: false,
      error: ''
    },
    value: []
  }
}

const [DS_REQ, DS_SUCC, DS_FAIL] = apiActionTypes('dataset')

const workingDatasetReducer: Reducer = (state = initialState, action: AnyAction): WorkingDataset => {
  switch (action.type) {
    case DS_REQ:
      // TODO (b5) - finish
      return state
    case DS_SUCC:
      // TODO (b5) - finish
      console.log('yay fetched dataset!')
      return state
    case DS_FAIL:
      // TODO (b5) - finish
      return state
  }

  return state
}

export default workingDatasetReducer
