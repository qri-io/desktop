import { connect } from 'react-redux'
import Network, { NetworkProps } from '../components/network/Network'

import { Modal } from '../models/modals'
import Store from '../models/store'

import { setSidebarWidth } from '../actions/ui'
// import { } from '../actions/api'

import {
  setActiveTab,
  setSelectedListItem
} from '../actions/selections'
import { DetailsType } from '../models/details'

const mergeProps = (props: any, actions: any): NetworkProps => {
  return { ...props, ...actions }
}

interface NetworkContainerProps {
  setModal: (modal: Modal) => void
}

const NetworkContainer = connect(
  (state: Store, ownProps: NetworkContainerProps) => {
    const {
      ui,
      selections,
      workingDataset,
      mutations,
      myDatasets,
      session
    } = state
    const hasDatasets = myDatasets.value.length !== 0
    const { setModal } = ownProps
    const showDetailsBar = ui.detailsBar.type !== DetailsType.NoDetails

    return Object.assign({
      ui,
      selections,
      workingDataset,
      mutations,
      setModal,
      hasDatasets,
      session,
      showDetailsBar
    }, ownProps)
  },
  {
    setActiveTab,
    setSidebarWidth,
    setSelectedListItem
  },
  mergeProps
)(Network)

export default NetworkContainer
