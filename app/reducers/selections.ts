import { AnyAction } from 'redux'
import { Selections, SelectedComponent } from '../models/store'
import localStore from '../utils/localStore'
import { apiActionTypes } from '../store/api'
import chooseDefaultComponent from '../utils/chooseDefaultComponent'

export const SELECTIONS_SET_ACTIVE_TAB = 'SELECTIONS_SET_ACTIVE_TAB'
export const SELECTIONS_SET_SELECTED_LISTITEM = 'SELECTIONS_SET_SELECTED_LISTITEM'
export const SELECTIONS_SET_WORKING_DATASET = 'SELECTIONS_SET_WORKING_DATASET'
export const SELECTIONS_CLEAR = 'SELECTIONS_CLEAR'

export const initialState: Selections = {
  peername: localStore().getItem('peername') || '',
  name: localStore().getItem('name') || '',
  isLinked: localStore().getItem('isLinked') === 'true',
  published: localStore().getItem('published') === 'true',
  activeTab: localStore().getItem('activeTab') || 'status',
  component: localStore().getItem('component') as SelectedComponent || '',
  commit: localStore().getItem('commit') || '',
  commitComponent: localStore().getItem('commitComponent') || ''
}

export const [, ADD_SUCC] = apiActionTypes('add')
export const [, INIT_SUCC] = apiActionTypes('init')
export const [, DATASET_SUCC, DATASET_FAIL] = apiActionTypes('dataset')
export const [, COMMIT_SUCC] = apiActionTypes('commitdataset')
export const [, PUBLISH_SUCC] = apiActionTypes('publish')
export const [, UNPUBLISH_SUCC] = apiActionTypes('unpublish')
export const [, SIGNIN_SUCC] = apiActionTypes('signin')
export const [, SIGNUP_SUCC] = apiActionTypes('signup')

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case DATASET_FAIL:
    case SIGNIN_SUCC:
    case SIGNUP_SUCC:
    case SELECTIONS_CLEAR:
      localStore().setItem('peername', '')
      localStore().setItem('name', '')
      localStore().setItem('isLinked', 'false')
      localStore().setItem('published', 'false')
      localStore().setItem('activeTab', 'status')
      localStore().setItem('component', '')
      localStore().setItem('commit', '')
      localStore().setItem('commitComponent', '')
      return {
        peername: '',
        name: '',
        isLinked: false,
        published: false,
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
      const newActiveTab = isLinked ? 'status' : 'history'

      localStore().setItem('peername', peername)
      localStore().setItem('name', name)
      localStore().setItem('isLinked', JSON.stringify(!!isLinked))
      localStore().setItem('published', JSON.stringify(!!published))
      localStore().setItem('activeTab', newActiveTab)

      return Object.assign({}, state, {
        peername,
        name,
        isLinked,
        published,
        activeTab: newActiveTab
      })

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
      if (action.payload.data.dataset[state.component] || (state.component === 'body' && action.payload.data.dataset['bodyPath'])) return state
      //
      return {
        ...state,
        // get the default component based on the components
        // that exist in dataset
        // can return with empty string
        component: chooseDefaultComponent(action.payload.data.dataset)
      }
      // when a dataset is successfully published, mark as published in the selections
    case PUBLISH_SUCC:
      localStore().setItem('published', 'true')
      return {
        ...state,
        published: true
      }
      // when a dataset is successfully unpublished, mark as unpublished in the selections
    case UNPUBLISH_SUCC:
      localStore().setItem('published', 'false')
      return {
        ...state,
        published: false
      }
      // when a new dataset is added from the network, make it the selected dataset
    case ADD_SUCC:
      localStore().setItem('peername', action.payload.data.peername)
      localStore().setItem('name', action.payload.data.name)
      localStore().setItem('isLinked', JSON.stringify(!!action.payload.data.isLinked))
      localStore().setItem('published', JSON.stringify(!!action.payload.data.published))
      localStore().setItem('activeTab', 'history')
      return {
        ...state,
        peername: action.payload.data.peername,
        name: action.payload.data.name,
        isLinked: !!action.payload.data.isLinked,
        published: !!action.payload.data.published,
        activeTab: 'history'
      }
      // when a new dataset is created, make it the selected dataset
    case INIT_SUCC:
      localStore().setItem('peername', action.payload.data.peername)
      localStore().setItem('name', action.payload.data.name)
      localStore().setItem('isLinked', JSON.stringify(!!action.payload.data.isLinked))
      localStore().setItem('published', JSON.stringify(!!action.payload.data.published))
      localStore().setItem('activeTab', 'status')
      return {
        ...state,
        peername: action.payload.data.peername,
        name: action.payload.data.name,
        isLinked: !!action.payload.data.isLinked,
        published: !!action.payload.data.published,
        activeTab: 'status'
      }

    default:
      return state
  }
}
