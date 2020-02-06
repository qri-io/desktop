import { connect } from 'react-redux'
import Network, { NetworkProps } from '../components/network/Network'

import Store from '../models/store'
import { qriRefFromRoute, QriRef } from '../models/qriRef'
import { setSidebarWidth } from '../actions/ui'

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
    return {
      qriRef: qriRefFromRoute(ownProps)
    }
  },
  {
    setActiveTab,
    setSidebarWidth,
    setSelectedListItem
  },
  mergeProps
)(Network)

export default NetworkContainer
