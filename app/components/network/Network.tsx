import * as React from 'react'
import { Action } from 'redux'

import { QriRef } from '../../models/qriRef'
import { ApiActionThunk } from '../../store/api'

import { RouteProps } from '../../models/store'

import Layout from '../Layout'
import NetworkHome from './NetworkHome'
import NetworkSidebar from './NetworkSidebar'
import Preview from '../dataset/Preview'
import LogList from './LogList'
import SidebarActionButton from '../chrome/SidebarActionButton'

export interface NetworkProps extends RouteProps {
  qriRef: QriRef

  inCollection: boolean

  sidebarWidth: number
  importFileName: string
  importFileSize: number

  addDatasetAndFetch: (username: string, name: string) => ApiActionThunk
  toggleNetwork: () => Action
}

const Network: React.FunctionComponent<NetworkProps> = (props) => {
  const {
    qriRef,

    inCollection,
    addDatasetAndFetch,
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

  return (
    <Layout
      id='collection-container'
      sidebarContent={
        <NetworkSidebar>
          {/* TODO (ramfox): add back in when we have accurate network stats */}
          {/* <P2PConnectionStatus
            data={{ enabled: true }}
            onChange={(d: P2PConnection) => { alert(`change connection: ${d.enabled}`) }}
          /> */}
          {qriRef.username && qriRef.name && <LogList qriRef={qriRef} />}
          {qriRef.username && qriRef.name && !inCollection && <SidebarActionButton text='Clone Dataset' onClick={() => addDatasetAndFetch(qriRef.username, qriRef.name)} />}
        </NetworkSidebar>
      }
      sidebarWidth={sidebarWidth}
      onSidebarResize={(width) => { setSidebarWidth('network', width) }}
      mainContent={mainContent}
    />
  )
}

export default Network
