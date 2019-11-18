import { connect } from 'react-redux'
import { setFilter } from '../actions/myDatasets'
import Collection from '../components/Collection'
import { fetchMyDatasets } from '../actions/api'
import { setWorkingDataset } from '../actions/selections'
import { setSidebarWidth } from '../actions/ui'

import { Modal } from '../models/modals'

interface CollectionContainerProps {
  setModal: (modal: Modal) => void
}

const mapStateToProps = (state: any, ownProps: CollectionContainerProps) => {
  const { myDatasets, workingDataset, ui } = state
  const { collectionSidebarWidth: sidebarWidth } = ui

  const { setModal } = ownProps
  return {
    myDatasets,
    workingDataset,
    setModal,
    sidebarWidth
  }
}

const actions = {
  setFilter,
  setWorkingDataset,
  setSidebarWidth,
  fetchMyDatasets
}

export default connect(mapStateToProps, actions)(Collection)
