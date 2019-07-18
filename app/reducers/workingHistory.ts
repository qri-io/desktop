import { AnyAction } from 'redux'

const initialState = {}

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    default:
      return state
  }
}
