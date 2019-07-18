import {
  SELECTIONS_SET_ACTIVE_TAB,
  SELECTIONS_SET_SELECTED_LISTITEM,
  SELECTIONS_SET_WORKING_DATASET
} from '../reducers/selections'

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

export const setWorkingDataset = (peername: string, name: string) => {
  return {
    type: SELECTIONS_SET_WORKING_DATASET,
    payload: {
      peername,
      name
    }
  }
}
