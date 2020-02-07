import { connect } from 'react-redux'
import Network, { NetworkProps } from '../components/network/Network'

import Store from '../models/store'
import { qriRefFromRoute, QriRef } from '../models/qriRef'
import { setSidebarWidth, openToast } from '../actions/ui'
import { addDatasetAndFetch } from '../actions/api'

import {
  setActiveTab,
  setSelectedListItem
} from '../actions/selections'

import { RouteComponentProps } from 'react-router-dom'

const mergeProps = (props: any, actions: any): NetworkProps => {
  return { ...props, ...actions }
}

const NetworkContainer = connect(
  (state: Store, ownProps: RouteComponentProps<QriRef>) => {
    const { ui } = state
    const { networkSidebarWidth } = ui
    return {
      sidebarWidth: networkSidebarWidth,
      qriRef: qriRefFromRoute(ownProps)
    }
  },
  {
    openToast,
    addDatasetAndFetch,
    setActiveTab,
    setSidebarWidth,
    setSelectedListItem
  },
  mergeProps
)(Network)

export default NetworkContainer
