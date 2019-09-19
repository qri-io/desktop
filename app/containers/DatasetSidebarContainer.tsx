import { connect } from 'react-redux'
import DatasetSidebar, { DatasetSidebarProps } from '../components/DatasetSidebar'

import { Modal } from '../models/modals'
import Store from '../models/store'

import {
  setHideCommitNudge
} from '../actions/ui'

import {
  fetchWorkingHistory,
  discardChanges
} from '../actions/api'

import {
  setActiveTab,
  setSelectedListItem
} from '../actions/selections'

const mergeProps = (props: any, actions: any): DatasetSidebarProps => {
  return { ...props, ...actions }
}

interface DatasetSidebarContainerProps {
  setModal: (modal: Modal) => void
}

const DatasetSidebarContainer = connect(
  (state: Store, ownProps: DatasetSidebarContainerProps) => {
    const {
      selections,
      workingDataset,
      commitDetails,
      ui
    } = state

    const { hideCommitNudge } = ui

    const { setModal } = ownProps
    return Object.assign({
      selections,
      workingDataset,
      setModal,
      hideCommitNudge,
      commitDetails
    }, ownProps)
  },
  {
    setActiveTab,
    setSelectedListItem,
    fetchWorkingHistory,
    discardChanges,
    setHideCommitNudge
  },
  mergeProps
)(DatasetSidebar)

export default DatasetSidebarContainer
