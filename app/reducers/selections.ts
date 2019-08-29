import { AnyAction } from 'redux'
import { Selections, SelectedComponent } from '../models/store'
import localStore from '../utils/localStore'
import { apiActionTypes } from '../store/api'

export const SELECTIONS_SET_ACTIVE_TAB = 'SELECTIONS_SET_ACTIVE_TAB'
export const SELECTIONS_SET_SELECTED_LISTITEM = 'SELECTIONS_SET_SELECTED_LISTITEM'
export const SELECTIONS_SET_WORKING_DATASET = 'SELECTIONS_SET_WORKING_DATASET'

const initialState: Selections = {
  peername: localStore().getItem('peername') || '',
  name: localStore().getItem('name') || '',
  isLinked: localStore().getItem('isLinked') === 'true',
  published: localStore().getItem('published') === 'true',
  activeTab: localStore().getItem('activeTab') || 'status',
  component: localStore().getItem('component') as SelectedComponent || '',
  commit: localStore().getItem('commit') || '',
  commitComponent: localStore().getItem('commitComponent') || ''
}

const [, LIST_SUCC] = apiActionTypes('list')
const [, ADD_SUCC] = apiActionTypes('add')

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SELECTIONS_SET_ACTIVE_TAB:
      const { activeTab } = action.payload
      localStore().setItem('activeTab', activeTab)
      return Object.assign({}, state, { activeTab })

    case SELECTIONS_SET_SELECTED_LISTITEM:
      const { type, selectedListItem } = action.payload
      if (type === 'component') {
        localStore().setItem('component', selectedListItem)
        return Object.assign({}, state, { component: selectedListItem })
      }
      if (type === 'commit') {
        localStore().setItem('commit', selectedListItem)
        return Object.assign({}, state, { commit: selectedListItem })
      }
      if (type === 'commitComponent') {
        localStore().setItem('commitComponent', selectedListItem)
        return Object.assign({}, state, { commitComponent: selectedListItem })
      }
      return state

    case SELECTIONS_SET_WORKING_DATASET:
      const { peername, name, isLinked, published } = action.payload
      localStore().setItem('peername', peername)
      localStore().setItem('name', name)
      localStore().setItem('isLinked', isLinked)
      localStore().setItem('published', published)

      const newActiveTab = isLinked ? 'status' : 'history'

      return Object.assign({}, state, {
        peername,
        name,
        isLinked,
        published,
        activeTab: newActiveTab
      })

    case LIST_SUCC:
      // if there is no peername + name in selections, use the first one on the list
      if (state.peername === '' && state.name === '') {
        if (action.payload.data.length === 0) return state
        const { peername: firstPeername, name: firstName, isLinked: firstIsLinked, published } = action.payload.data[0]
        localStore().setItem('peername', firstPeername)
        localStore().setItem('name', firstName)
        localStore().setItem('isLinked', firstIsLinked)
        localStore().setItem('published', published)
        return Object.assign({}, state, { peername: firstPeername, name: firstName, isLinked: firstIsLinked, published })
      } else {
        return state
      }

      // when a new dataset is added via the modal, make it the selected dataset
    case ADD_SUCC:
      const { peername: newPeername, name: newName } = action.payload.data
      localStore().setItem('peername', newPeername)
      localStore().setItem('name', newName)
      return {
        ...state,
        peername: newPeername,
        name: newName
      }

    default:
      return state
  }
}
