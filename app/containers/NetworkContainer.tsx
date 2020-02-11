import { connect } from 'react-redux'
import Network, { NetworkProps } from '../components/network/Network'

import Store, { VersionInfo } from '../models/store'
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
    const { ui, myDatasets } = state
    const { networkSidebarWidth } = ui
    const qriRef = qriRefFromRoute(ownProps)

    // TODO (ramfox): right now, we are getting the first 100 of a user's
    // datasets. This is fine for now, as no one has 100 datasets, but we will need
    // different logic eventually. If we move to a paradigm where the previews are no
    // longer ephemeral or if the fetching happens in a different location, then
    // we can check the 'foreign' flag in the versionInfo
    const inCollection = myDatasets.value.some((vi: VersionInfo, i: number) => {
      return vi.username === qriRef.username && vi.name === qriRef.name
    })
    return {
      sidebarWidth: networkSidebarWidth,
      inCollection,
      qriRef
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
