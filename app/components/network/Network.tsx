import * as React from 'react'
import { Action } from 'redux'

import { P2PConnection } from '../../models/network'
import { QriRef } from '../../models/qriRef'
import { ApiActionThunk } from '../../store/api'

import Layout from '../Layout'
import P2PConnectionStatus from './P2PConnectionStatus'
import NetworkHome from './NetworkHome'
import Preview from '../dataset/Preview'
import LogList from './LogList'
import SidebarActionButton from '../chrome/SidebarActionButton'
import { RouteComponentProps } from 'react-router'

export interface NetworkProps extends RouteComponentProps{
  qriRef: QriRef

  sidebarWidth: number
  importFileName: string
  importFileSize: number

  addDatasetAndFetch: (username: string, name: string) => ApiActionThunk
  toggleNetwork: () => Action
  setSidebarWidth: (type: string, sidebarWidth: number) => Action
}

const Network: React.FunctionComponent<NetworkProps> = (props) => {
  const {
    qriRef,

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
      sidebarContent={<div className='dataset-sidebar'>
        <P2PConnectionStatus
          data={{ enabled: true }}
          onChange={(d: P2PConnection) => { alert(`change connection: ${d.enabled}`) }}
        />
        {qriRef.username && qriRef.name && <LogList qriRef={qriRef} />}
        {qriRef.username && qriRef.name && <SidebarActionButton text='Clone Dataset' onClick={() => addDatasetAndFetch(qriRef.username, qriRef.name)}/>}
      </div>}
      sidebarWidth={sidebarWidth}
      onSidebarResize={(width) => { setSidebarWidth('network', width) }}
      mainContent={mainContent}
    />
  )
}

export default Network
