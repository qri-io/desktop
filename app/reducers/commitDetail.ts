import { Reducer, AnyAction } from 'redux'
import { CommitDetail } from '../models/store'
import { apiActionTypes } from '../store/api'

const initialState: CommitDetail = {
  path: '',
  prevPath: '',
  peername: '',
  name: '',
  pages: {},
  diff: {},
  value: {},
  status: {
    meta: {
      filepath: 'meta.json',
      status: 'unmodified',
      errors: [],
      warnings: []
    },
    schema: {
      filepath: 'schema.json',
      status: 'unmodified',
      errors: [],
      warnings: []
    },
    body: {
      filepath: 'body.csv',
      status: 'unmodified',
      errors: [],
      warnings: []
    }
  }
}

const [COMMITDETAIL_REQ, COMMITDETAIL_SUCC, COMMITDETAIL_FAIL] = apiActionTypes('commitDetail')

const commitDetailReducer: Reducer = (state = initialState, action: AnyAction): CommitDetail => {
  switch (action.type) {
    case COMMITDETAIL_REQ:
      return state
    case COMMITDETAIL_SUCC:
      const { name, path, peername, published, dataset: value } = action.payload.data
      return Object.assign({}, state, { name, path, peername, published, value })
    case COMMITDETAIL_FAIL:
      return state

    default:
      return state
  }
}

export default commitDetailReducer
