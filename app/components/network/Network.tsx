import * as React from 'react'
import { Action } from 'redux'

import Layout from '../Layout'
import { P2PConnection } from '../../models/network'
import P2PConnectionStatus from './P2PConnectionStatus'

import Dataset from '../dataset/Dataset'

// import NetworkHome from './NetworkHome'
import cities from '../../../stories/data/cities.dataset.json'

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

  // TODO (b5) - bring this back in the near future for fetching home feed
  // const [loading, setLoading] = React.useState(true)
  // const [data, setData] = React.useState(undefined)
  // const [error, setError] = React.useState('')

  // React.useEffect(() => {
  //   homeFeed()
  //     .then(f => {
  //       setData(f)
  //       setLoading(false)
  //     })
  //     .catch(error => {
  //       setLoading(false)
  //       setError(error)
  //     })
  // }, [false])

  const mainContent = (
    <>
      <div className='main-content-flex' style={{ overflow: 'auto' }}>
        {/* TODO (b5) - navbar shouldn't be loaded here, should be in App.tsx, needs location */}
        <Dataset data={cities} />
        {/* <NetworkHome data={data} loading={loading} error={error} /> */}
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

// TODO (b5) - bring this back in the near future for fetching home feed
// async function homeFeed (): Promise<NetworkHomeData> {
//   const options: FetchOptions = {
//     method: 'GET'
//   }

//   const r = await fetch(`http://localhost:2503/feed/home`, options)
//   const res = await r.json()
//   if (res.meta.code !== 200) {
//     var err = { code: res.meta.code, message: res.meta.error }
//     throw err // eslint-disable-line
//   }

//   return res.data as NetworkHomeData
// }
