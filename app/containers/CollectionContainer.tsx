import { connect } from 'react-redux'
import { setFilter } from '../actions/myDatasets'
import Collection from '../components/collection/Collection'
import { fetchMyDatasets } from '../actions/api'
import { setWorkingDataset } from '../actions/selections'
import { setSidebarWidth, setModal } from '../actions/ui'

import { RouteComponentProps } from 'react-router'

const mapStateToProps = (state: any, ownProps: RouteComponentProps) => {
  const { myDatasets, workingDataset, ui } = state
  const {
    collectionSidebarWidth: sidebarWidth,
    importFileName,
    importFileSize
  } = ui

  const { match } = ownProps
  console.log(ownProps)
  return {
    match,
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
  fetchMyDatasets
}

export default connect(mapStateToProps, actions)(Collection)
