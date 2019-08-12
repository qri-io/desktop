import { AnyAction } from 'redux'
import { Selections } from '../models/store'
import store from '../utils/localStore'
import { apiActionTypes } from '../store/api'

export const SELECTIONS_SET_ACTIVE_TAB = 'SELECTIONS_SET_ACTIVE_TAB'
export const SELECTIONS_SET_SELECTED_LISTITEM = 'SELECTIONS_SET_SELECTED_LISTITEM'
export const SELECTIONS_SET_WORKING_DATASET = 'SELECTIONS_SET_WORKING_DATASET'

const initialState: Selections = {
  peername: store().getItem('peername') || '',
  name: store().getItem('name') || '',
  isLinked: store().getItem('isLinked') === 'true',
  activeTab: store().getItem('activeTab') || 'status',
  component: store().getItem('component') || '',
  commit: store().getItem('commit') || '',
  commitComponent: store().getItem('commitComponent') || ''
}

const [, LIST_SUCC] = apiActionTypes('list')

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
      const { peername, name, isLinked } = action.payload
      store().setItem('peername', peername)
      store().setItem('name', name)
      store().setItem('isLinked', isLinked)
      return Object.assign({}, state, { peername, name, isLinked })

    case LIST_SUCC:
      // if there is no peername + name in selections, use the first one on the list
      if (state.peername === '' && state.name === '') {
        if (action.payload.data.length === 0) return state
        const { peername: firstPeername, name: firstName, isLinked: firstIsLinked } = action.payload.data[0]
        store().setItem('peername', firstPeername)
        store().setItem('name', firstName)
        store().setItem('isLinked', firstIsLinked)
        return Object.assign({}, state, { peername: firstPeername, name: firstName, isLinked: firstIsLinked })
      } else {
        return state
      }

    default:
      return state
  }
}
