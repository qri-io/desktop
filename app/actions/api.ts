import { CALL_API, ApiAction, ApiActionThunk } from '../store/api'
import { DatasetSummary } from '../models/store'
import Dataset from '../models/dataset'

export function fetchMyDatasets (): ApiActionThunk {
  return async (dispatch) => {
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

    return dispatch(action)
  }
}

export function fetchWorkingDataset (): ApiActionThunk {
  return async (dispatch, getState) => {
    const { selections } = getState()

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

    return dispatch(action)
  }
}
