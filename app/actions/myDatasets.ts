import { MYDATASETS_SET_FILTER } from '../reducers/myDatasets'

export const setFilter = (filter: string) => {
  return {
    type: MYDATASETS_SET_FILTER,
    payload: { filter }
  }
}
