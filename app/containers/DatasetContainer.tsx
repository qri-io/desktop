import { connect } from 'react-redux'
import Dataset, { DatasetProps } from '../components/Dataset'
import Store from '../models/store'

import { toggleDatasetList, setSidebarWidth } from '../actions/ui'
import {
  fetchWorkingDatasetDetails,
  fetchWorkingStatus,
  fetchWorkingHistory
} from '../actions/api'
import {
  setActiveTab,
  setSelectedListItem,
  setWorkingDataset
} from '../actions/selections'
import { setFilter } from '../actions/myDatasets'

const mergeProps = (props: any, actions: any): DatasetProps => {
  return { ...props, ...actions }
}

const DatasetContainer = connect(
  (state: Store, ownProps) => {
    const {
      ui,
      selections,
      myDatasets,
      workingDataset,
      mutations
    } = state
    return Object.assign({
      ui,
      selections,
      myDatasets,
      workingDataset,
      mutations
    }, ownProps)
  },
  {
    toggleDatasetList,
    setActiveTab,
    setSidebarWidth,
    setFilter,
    setSelectedListItem,
    setWorkingDataset,
    fetchWorkingDatasetDetails,
    fetchWorkingStatus,
    fetchWorkingHistory
  },
  mergeProps
)(Dataset)

export default DatasetContainer
