import { ThunkAction } from 'redux-thunk'
import { CALL_API, ApiAction } from '../store/api'
import { DatasetSummary } from '../models/store'

export function fetchMyDatasets (): ThunkAction<Promise<void>, any, any, any> {
  return async (dispatch) => {
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
