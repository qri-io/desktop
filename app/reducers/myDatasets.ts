import { Reducer, AnyAction } from 'redux'
import { MyDatasets, DatasetSummary } from '../models/store'
import { apiActionTypes } from '../store/api'

export const MYDATASETS_SET_FILTER = 'MYDATASETS_SET_FILTER'

const initialState: MyDatasets = {
  pageInfo: {
    isFetching: false,
    pageCount: 0,
    fetchedAll: false,
    error: ''
  },
  value: [],
  filter: ''
}

const [LIST_REQ, LIST_SUCC, LIST_FAIL] = apiActionTypes('list')
const [LINKS_REQ, LINKS_SUCC, LINKS_FAIL] = apiActionTypes('links')

const myDatasetsReducer: Reducer = (state = initialState, action: AnyAction): MyDatasets => {
  switch (action.type) {
    case MYDATASETS_SET_FILTER:
      const { filter } = action.payload
      return Object.assign({}, state, { filter })

    case LIST_REQ:
      return Object.assign({}, state, {
        pageInfo: {
          isFetching: true,
          // TODO (b5) - update pagination details!
          pageCount: 0,
          fetchedAll: false,
          error: ''
        }
      })
    case LIST_SUCC:
      return {
        pageInfo: {
          isFetching: false,
          // TODO (b5) - update pagination details!
          pageCount: 1,
          fetchedAll: false,
          error: ''
        },
        value: action.payload.data,
        filter: ''
      }
    case LIST_FAIL:
      return Object.assign({}, state, {
        pageInfo: {
          isFetching: true,
          // TODO (b5) - update pagination details!
          pageCount: 0,
          fetchedAll: false,
          error: ''
        }
      })

    // the links reducer is temporarily used to complement /list, adding 'isLinked' to each dataset
    case LINKS_REQ:
      return state
    case LINKS_SUCC:
      const linkedDatasets = action.payload.data.map((d: {alias: string}): string => d.alias)
      // for each dataset in state.value, lookup title in the array of linked datasets
      let datasets = Object.assign([], state.value)
      datasets = datasets.map((dataset: DatasetSummary) => {
        // see if dataset.title is in linkedDatasets
        dataset.isLinked = linkedDatasets.includes(dataset.title)
        return dataset
      })
      return Object.assign({}, state, {
        value: datasets
      })
    case LINKS_FAIL:
      return state
  }

  return state
}

export default myDatasetsReducer
