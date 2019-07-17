import { ThunkAction } from 'redux-thunk'
import { CALL_API, ApiAction } from '../store/api'
import { DatasetSummary } from '../models/store'
import Dataset from '../models/dataset'

export function fetchMyDatasets (): ThunkAction<Promise<void>, any, any, any> {
  return async (dispatch) => {
    // all fetch action types must return a promise
    return new Promise((resolve) => {
      const action: ApiAction = {
        [CALL_API]: {
          endpoint: 'list',
          method: 'GET',
          map: (data: any[]): DatasetSummary[] => {
            return data.map((ref: any) => ({
              title: ref.dataset.title || `${ref.peername}/${ref.name}`,
              peername: ref.peername,
              name: ref.name,
              path: ref.path,
              hash: '',
              isLinked: false,
              changed: false
            }))
          }
        }
      }
      dispatch(action)
      // TODO (b5) - this should resolve *after* the api response has fired
      resolve()
    })
  }
}

export function fetchWorkingDataset (): ThunkAction<Promise<void>, any, any, any> {
  return async (dispatch, getState) => {
    // TODO (b5) - selections should never be empty. currently empty b/c we don't have
    // a selections reducer
    const { selections = {} } = getState()
    // all fetch action types must return a promise
    return new Promise((resolve) => {
      const action: ApiAction = {
        [CALL_API]: {
          endpoint: 'dataset',
          method: 'GET',
          params: {
            // TODO (b5) - these 'default' values are just placeholders for checking
            // the api call when we have no proper default state. should fix
            peername: selections.peername || 'me',
            name: selections.name || 'world_bank_population'
          },
          // TODO (b5): confirm this works, if so we may want to remove this
          // map func entirely
          map: (data: object): Dataset => {
            return data
          }
        }
      }

      dispatch(action)
      // TODO (b5) - this should resolve *after* the api response has fired
      resolve()
    })
  }
}
