import { AnyAction } from 'redux'
import { Selections, SelectedComponent } from '../models/store'
import localStore from '../utils/localStore'
import { apiActionTypes } from '../utils/actionType'
import chooseDefaultComponent from '../utils/chooseDefaultComponent'

import {
  HISTORY_SUCC
} from '../reducers/log'

export const SELECTIONS_SET_ACTIVE_TAB = 'SELECTIONS_SET_ACTIVE_TAB'
export const SELECTIONS_SET_SELECTED_LISTITEM = 'SELECTIONS_SET_SELECTED_LISTITEM'
export const SELECTIONS_SET_WORKING_DATASET = 'SELECTIONS_SET_WORKING_DATASET'
export const SELECTIONS_CLEAR = 'SELECTIONS_CLEAR'
export const SELECTIONS_SET_LAST_EDIT_ROUTE = 'SELECTIONS_SET_LAST_EDIT_ROUTE'
export const SELECTIONS_SET_LAST_HISTORY_ROUTE = 'SELECTIONS_SET_LAST_HISTORY_ROUTE'
export const SELECTIONS_SET_LAST_SELECTED_COMPONENT = 'SELECTIONS_SET_LAST_SELECTED_COMPONENT'
export const SELECTIONS_SET_CLEAR_LIST_ROUTES = 'SELECTIONS_SET_CLEAR_LIST_ROUTES'

export const initialState: Selections = {
  peername: localStore().getItem('peername') || '',
  name: localStore().getItem('name') || '',
  activeTab: localStore().getItem('activeTab') || 'status',
  component: localStore().getItem('component') as SelectedComponent || '',
  commit: '',
  commitComponent: localStore().getItem('commitComponent') || ''
}

export const [, ADD_SUCC] = apiActionTypes('add')
export const [, REMOVE_SUCC] = apiActionTypes('remove')
export const [, INIT_SUCC] = apiActionTypes('init')
export const [, IMPORT_SUCC] = apiActionTypes('import')
export const [, DATASET_SUCC, DATASET_FAIL] = apiActionTypes('dataset')
export const [, COMMIT_SUCC] = apiActionTypes('commitdataset')
export const [, PUBLISH_SUCC] = apiActionTypes('publish')
export const [, UNPUBLISH_SUCC] = apiActionTypes('unpublish')
export const [, SIGNIN_SUCC] = apiActionTypes('signin')
export const [, SIGNUP_SUCC] = apiActionTypes('signup')
export const [, , HISTORY_FAIL] = apiActionTypes('history')
export const [, RENAME_SUCC] = apiActionTypes('rename')

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case REMOVE_SUCC:
    case DATASET_FAIL:
    case SIGNIN_SUCC:
    case SIGNUP_SUCC:
    case SELECTIONS_CLEAR:
      // if the given peername and name don't match the selected peername and name return early
      // otherwise, fall through to clearing the selection
      if (action.type === REMOVE_SUCC) {
        if (!(action.payload.request.segments.peername === state.peername && action.payload.request.segments.name === state.name)) {
          return state
        }
      }
      // if the error code is 422, that means the dataset exists
      // but is not linked to the filesystem.
      // otherwise fall through
      if (action.type === DATASET_FAIL && action.payload.err.code === 422) {
        return state
      }
      localStore().setItem('peername', '')
      localStore().setItem('name', '')
      localStore().setItem('activeTab', 'status')
      localStore().setItem('component', '')
      localStore().setItem('commitComponent', '')
      return {
        peername: '',
        name: '',
        activeTab: 'status',
        component: '',
        commit: '',
        commitComponent: ''
      }
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
        return Object.assign({}, state, { commit: selectedListItem })
      }
      if (type === 'commitComponent') {
        localStore().setItem('commitComponent', selectedListItem)
        return Object.assign({}, state, { commitComponent: selectedListItem })
      }
      return state

    case SELECTIONS_SET_WORKING_DATASET:
      const { peername, name } = action.payload

      if (peername === state.peername && name === state.name) return state

      localStore().setItem('peername', peername)
      localStore().setItem('name', name)

      return Object.assign({}, state, {
        peername,
        name,
        commit: ''
      })

    case HISTORY_SUCC:
      if (state.commit === '') {
        if (action.payload.data && action.payload.data.length > 0) {
          return {
            ...state,
            commit: action.payload.data[0].path
          }
        }
      }
      return state

    case COMMIT_SUCC:
      // if the selected commitComponent exists on dataset, no changes needed
      if (action.payload.data.dataset[state.commitComponent] || (state.commitComponent === 'body' && action.payload.data.dataset['bodyPath'])) return state
      //
      return {
        ...state,
        // get the default component based on the components
        // that exist in dataset
        // can return with empty string
        commitComponent: chooseDefaultComponent(action.payload.data.dataset)
      }

    case DATASET_SUCC:
      // if the selected component exists on dataset, no changes needed
      if (
        action.payload.data.dataset[state.component] ||
        (state.component === 'body' && action.payload.data.dataset['bodyPath']) ||
        state.component === 'commit'
      ) return state
      return {
        ...state,
        // get the default component based on the components
        // that exist in dataset
        // can return with empty string
        component: chooseDefaultComponent(action.payload.data.dataset)
      }

    // if dataset history fails, set active tab to status
    case HISTORY_FAIL:
      return {
        ...state,
        activeTab: 'status'
      }

    case RENAME_SUCC:
      localStore().setItem('name', action.payload.data.name)
      return {
        ...state,
        name: action.payload.data.name
      }

    default:
      return state
  }
}
