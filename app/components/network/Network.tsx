import * as React from 'react'
import { Action } from 'redux'

import { P2PConnection } from '../../models/network'
import { QriRef } from '../../models/qriRef'

import Layout from '../Layout'
import P2PConnectionStatus from './P2PConnectionStatus'
import NetworkHome from './NetworkHome'
import Preview from '../dataset/Preview'
import LogList from './LogList'

export interface NetworkProps {
  qriRef: QriRef

  sidebarWidth: number
  importFileName: string
  importFileSize: number

  toggleNetwork: () => Action
  setSidebarWidth: (type: string, sidebarWidth: number) => Action
}

const Network: React.FunctionComponent<NetworkProps> = (props) => {
  const {
    qriRef,
    sidebarWidth,
    setSidebarWidth
  } = props

  const renderMainContent = () => {
    /** TODO (ramfox): username, name, and path must be passed down from container
   * based on route or selections
   * if empty, peername is empty, we know to show 'home'
   * if name is empty, we know to show 'profile'
   */
    if (!qriRef.username) return <NetworkHome history={history}/>

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
      sidebarContent={<div className='dataset-sidebar'>
        <P2PConnectionStatus
          data={{ enabled: true }}
          onChange={(d: P2PConnection) => { alert(`change connection: ${d.enabled}`) }}
        />
        {qriRef.name && qriRef.username && <LogList qriRef={qriRef} />}
      </div>}
      sidebarWidth={sidebarWidth}
      onSidebarResize={(width) => { setSidebarWidth('collection', width) }}
      mainContent={mainContent}
    />
  )
}

export default Network
