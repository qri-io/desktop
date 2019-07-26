import { Reducer, AnyAction } from 'redux'
import { CommitDetails } from '../models/store'
import { apiActionTypes } from '../store/api'

const initialState: CommitDetails = {
  path: '',
  prevPath: '',
  peername: '',
  name: '',
  pages: {},
  diff: {},
  value: {},
  status: {}
}

const [COMMITDATASET_REQ, COMMITDATASET_SUCC, COMMITDATASET_FAIL] = apiActionTypes('commitdataset')
const [COMMITSTATUS_REQ, COMMITSTATUS_SUCC, COMMITSTATUS_FAIL] = apiActionTypes('commitstatus')

const commitDetailsReducer: Reducer = (state = initialState, action: AnyAction): CommitDetails => {
  switch (action.type) {
    case COMMITDATASET_REQ:
      return state
    case COMMITDATASET_SUCC:
      const { name, path, peername, published, dataset: value } = action.payload.data
      return Object.assign({}, state, { name, path, peername, published, value })
    case COMMITDATASET_FAIL:
      return state

    case COMMITSTATUS_REQ:
      return state
    case COMMITSTATUS_SUCC:
      const statusObject = action.payload.data.reduce((acc: Record<string, Record<string, any>>, d: Record<string, any>) => {
        acc[d.component] = d
        delete d.component
        return acc
      }, {})
      return Object.assign({}, state, { status: statusObject })
    case COMMITSTATUS_FAIL:
      return state

    default:
      return state
  }
}

export default commitDetailsReducer
