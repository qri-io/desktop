import {
  SELECTIONS_SET_SELECTED_LISTITEM,
  SELECTIONS_SET_WORKING_DATASET,
  SELECTIONS_CLEAR
} from '../reducers/selections'
import { SelectedComponent } from '../models/store'

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

export const setComponent = (component: SelectedComponent) => {
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
