import { connect } from 'react-redux'

import { setFilter } from '../actions/myDatasets'
import Collection from '../components/collection/Collection'
import { fetchMyDatasets, importFile } from '../actions/api'
import { setWorkingDataset } from '../actions/selections'
import { setSidebarWidth, openToast, closeToast } from '../actions/ui'

import { Modal } from '../models/modals'

interface CollectionContainerProps {
  setModal: (modal: Modal) => void
}

const mapStateToProps = (state: any, ownProps: CollectionContainerProps) => {
  const { myDatasets, workingDataset, ui } = state
  const {
    collectionSidebarWidth: sidebarWidth,
    importFileName,
    importFileSize
  } = ui

  const { setModal } = ownProps
  return {
    myDatasets,
    workingDataset,
    setModal,
    sidebarWidth,
    importFileName,
    importFileSize
  }
}

const actions = {
  setFilter,
  setWorkingDataset,
  setSidebarWidth,
  fetchMyDatasets,

  openToast,
  closeToast,
  importFile
}

export default connect(mapStateToProps, actions)(Collection)
