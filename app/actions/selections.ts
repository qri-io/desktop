import {
  SELECTIONS_SET_ACTIVE_TAB,
  SELECTIONS_SET_SELECTED_LISTITEM,
  SELECTIONS_SET_WORKING_DATASET,
  SELECTIONS_CLEAR
} from '../reducers/selections'
import { SelectedComponent } from '../models/store'

export const setActiveTab = (activeTab: string) => {
  return {
    type: SELECTIONS_SET_ACTIVE_TAB,
    payload: { activeTab }
  }
}

export const setSelectedListItem = (type: string, selectedListItem: string) => {
  return {
    type: SELECTIONS_SET_SELECTED_LISTITEM,
    payload: {
      type,
      selectedListItem
    }
  }
}

export const setWorkingComponent = (component: SelectedComponent) => {
  return setSelectedListItem('component', component)
}

export const setHistoryComponent = (component: SelectedComponent) => {
  return setSelectedListItem('commitComponent', component)
}

export const setWorkingDataset = (peername: string, name: string) => {
  return {
    type: SELECTIONS_SET_WORKING_DATASET,
    payload: {
      peername,
      name
    }
  }
}

export const clearSelection = () => {
  return {
    type: SELECTIONS_CLEAR
  }
}

export const setCommit = (path: string) => {
  return setSelectedListItem('commit', path)
}
