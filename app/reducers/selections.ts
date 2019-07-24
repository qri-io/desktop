import { AnyAction } from 'redux'
import { Selections } from '../models/store'
import store from '../utils/localStore'

export const SELECTIONS_SET_ACTIVE_TAB = 'SELECTIONS_SET_ACTIVE_TAB'
export const SELECTIONS_SET_SELECTED_LISTITEM = 'SELECTIONS_SET_SELECTED_LISTITEM'
export const SELECTIONS_SET_WORKING_DATASET = 'SELECTIONS_SET_WORKING_DATASET'

const initialState: Selections = {
  peername: store().getItem('peername'),
  name: store().getItem('name'),
  activeTab: store().getItem('activeTab') || 'status',
  component: store().getItem('component') || '',
  commit: store().getItem('commit') || '',
  commitComponent: store().getItem('commitComponent') || ''
}

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SELECTIONS_SET_ACTIVE_TAB:
      const { activeTab } = action.payload
      store().setItem('activeTab', activeTab)
      return Object.assign({}, state, { activeTab })

    case SELECTIONS_SET_SELECTED_LISTITEM:
      const { type, selectedListItem } = action.payload
      if (type === 'component') {
        store().setItem('component', selectedListItem)
        return Object.assign({}, state, { component: selectedListItem })
      }
      if (type === 'commit') {
        store().setItem('commit', selectedListItem)
        return Object.assign({}, state, { commit: selectedListItem })
      }
      if (type === 'commitComponent') {
        store().setItem('commitComponent', selectedListItem)
        return Object.assign({}, state, { commitComponent: selectedListItem })
      }
      return state

    case SELECTIONS_SET_WORKING_DATASET:
      const { peername, name } = action.payload
      store().setItem('peername', peername)
      store().setItem('name', name)
      return Object.assign({}, state, { peername, name })

    default:
      return state
  }
}
