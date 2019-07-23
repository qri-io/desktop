import { selections } from './initalState'
import { AnyAction } from 'redux'

export const SELECTIONS_SET_ACTIVE_TAB = 'SELECTIONS_SET_ACTIVE_TAB'
export const SELECTIONS_SET_SELECTED_LISTITEM = 'SELECTIONS_SET_SELECTED_LISTITEM'
export const SELECTIONS_SET_WORKING_DATASET = 'SELECTIONS_SET_WORKING_DATASET'

const initialState = selections

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SELECTIONS_SET_ACTIVE_TAB:
      const { activeTab } = action.payload
      return Object.assign({}, state, { activeTab })

    case SELECTIONS_SET_SELECTED_LISTITEM:
      const { type, selectedListItem } = action.payload
      if (type === 'component') return Object.assign({}, state, { component: selectedListItem })
      if (type === 'commit') return Object.assign({}, state, { commit: selectedListItem })
      if (type === 'commitComponent') return Object.assign({}, state, { commitComponent: selectedListItem })
      return state

    case SELECTIONS_SET_WORKING_DATASET:
      const { peername, name } = action.payload
      return Object.assign({}, state, { peername, name })

    default:
      return state
  }
}
