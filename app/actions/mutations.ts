import {
  MUTATIONS_SET_SAVE_VALUE
} from '../reducers/mutations'

export const setSaveValue = (name: string, value: string) => {
  return {
    type: MUTATIONS_SET_SAVE_VALUE,
    payload: { name, value }
  }
}
