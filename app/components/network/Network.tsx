import * as React from 'react'
import { Action } from 'redux'

import { QriRef, qriRefFromRoute } from '../../models/qriRef'
import { ApiActionThunk } from '../../store/api'

import Store, { RouteProps, VersionInfo } from '../../models/store'

import { connectComponentToProps } from '../../utils/connectComponentToProps'

import { setSidebarWidth, openToast, SidebarTypes } from '../../actions/ui'
import { pullDatasetAndFetch } from '../../actions/api'
import {
  setSelectedListItem
} from '../../actions/selections'

import Layout from '../Layout'
import NetworkHome from './NetworkHome'
import NetworkSidebar from './NetworkSidebar'
import Preview from '../dataset/Preview'
import NetworkLogList from './NetworkLogList'
import SidebarActionButton from '../chrome/SidebarActionButton'

export interface NetworkProps extends RouteProps {
  qriRef: QriRef

  inCollection: boolean

  sidebarWidth: number
  importFileName: string
  importFileSize: number

  pullDatasetAndFetch: (username: string, name: string) => ApiActionThunk
  toggleNetwork: () => Action
  setSidebarWidth: (type: SidebarTypes, sidebarWidth: number) => Action
}

const NetworkComponent: React.FunctionComponent<NetworkProps> = (props) => {
  const {
    qriRef,

    inCollection,
    pullDatasetAndFetch,
    sidebarWidth,
    setSidebarWidth
  } = props

  const renderMainContent = () => {
    /** TODO (ramfox): username, name, and path must be passed down from container
   * based on route or selections
   * if empty, peername is empty, we know to show 'home'
   * if name is empty, we know to show 'profile'
   */
    if (!qriRef.username) return <NetworkHome />

    if (!qriRef.name) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 16,
            height: '100%',
            width: '100%'
          }}>
          <div style={{ width: 300 }}>
            PROFILE
          </div>
        </div>
      )
    }

    return <Preview peername={qriRef.username} name={qriRef.name} path={qriRef.path} />
  }

  const mainContent = (
    <>
      <div className='main-content-flex' style={{ overflow: 'auto' }}>
        {renderMainContent()}
      </div>
    </>
  )

  const renderSidebarContent = () => {
    if (!qriRef.username || !qriRef.name) {
      return undefined
    }
    return (
      <NetworkSidebar>
        {/* TODO (ramfox): add back in when we have accurate network stats */}
        {/* <P2PConnectionStatus
        data={{ enabled: true }}
        onChange={(d: P2PConnection) => { alert(`change connection: ${d.enabled}`) }}
      /> */}
        {qriRef.username && qriRef.name && <NetworkLogList qriRef={qriRef} />}
        {
          qriRef.username && qriRef.name && !inCollection &&
          <SidebarActionButton
            text='Pull Dataset'
            onClick={() => pullDatasetAndFetch(qriRef.username, qriRef.name)}
          />
        }
      </NetworkSidebar>
    )
  }

  return (
    <Layout
      id='collection-container'
      sidebarContent={renderSidebarContent()}
      sidebarWidth={sidebarWidth}
      onSidebarResize={(width) => { setSidebarWidth('network', width) }}
      mainContent={mainContent}
      title='Network'
    />
  )
}

export default connectComponentToProps(
  NetworkComponent,
  (state: Store, ownProps: RouteProps) => {
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
      qriRef,
      ...ownProps
    }
  },
  {
    openToast,
    pullDatasetAndFetch,
    setSidebarWidth,
    setSelectedListItem
  }
)
