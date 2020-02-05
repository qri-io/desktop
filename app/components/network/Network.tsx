import * as React from 'react'
import { Action } from 'redux'

import { P2PConnection } from '../../models/network'

import Layout from '../Layout'
import P2PConnectionStatus from './P2PConnectionStatus'
import NetworkHome from './NetworkHome'

export interface NetworkProps {
  sidebarWidth: number
  importFileName: string
  importFileSize: number

  toggleNetwork: () => Action
  setSidebarWidth: (type: string, sidebarWidth: number) => Action
}

const Network: React.FunctionComponent<NetworkProps> = (props) => {
  const {
    sidebarWidth,
    setSidebarWidth
  } = props

  return (
    <Layout
      id='collection-container'
      sidebarContent={<div className='dataset-sidebar'>
        <P2PConnectionStatus
          data={{ enabled: true }}
          onChange={(d: P2PConnection) => { alert(`change connection: ${d.enabled}`) }}
        />
      </div>}
      sidebarWidth={sidebarWidth}
      onSidebarResize={(width) => { setSidebarWidth('collection', width) }}
      mainContent={<NetworkHome />}
    />
  )
}

export default Network
