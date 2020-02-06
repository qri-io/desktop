import * as React from 'react'
import { Action } from 'redux'

import { P2PConnection } from '../../models/network'

import Layout from '../Layout'
import P2PConnectionStatus from './P2PConnectionStatus'
import NetworkHome from './NetworkHome'
import Preview from '../dataset/Preview'
import { RouteComponentProps } from 'react-router-dom'

export interface NetworkProps extends RouteComponentProps {

  sidebarWidth: number
  importFileName: string
  importFileSize: number

  toggleNetwork: () => Action
  setSidebarWidth: (type: string, sidebarWidth: number) => Action
}

const Network: React.FunctionComponent<NetworkProps> = (props) => {
  const {
    match,
    history,
    sidebarWidth,
    setSidebarWidth
  } = props

  const { params } = match

  console.log(match)

  const renderMainContent = () => {
    /** TODO (ramfox): username, name, and path must be passed down from container
   * based on route or selections
   * if empty, peername is empty, we know to show 'home'
   * if name is empty, we know to show 'profile'
   */
    if (params && !params.username) return <NetworkHome history={history}/>

    if (params && !params.dataset) {
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

    return <Preview peername={params.username} name={params.dataset} path={params.path} />
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
      </div>}
      sidebarWidth={sidebarWidth}
      onSidebarResize={(width) => { setSidebarWidth('collection', width) }}
      mainContent={mainContent}
    />
  )
}

export default Network
