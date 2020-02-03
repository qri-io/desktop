import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import feed from './data/splash'

import { Dataset as IDataset } from '../app/models/dataset'
import { NetworkHomeData } from '../app/models/network'
import Navbar from '../app/components/nav/Navbar'
import NetworkHome from '../app/components/network/NetworkHome'
import Dataset from '../app/components/dataset/Dataset'
import { ActionButtonProps } from '../app/components/chrome/ActionButton'

const cities = require('./data/cities.dataset.json')

export default {
  title: 'Network',
  parameters: {
    notes: ''
  }
}

interface FetchOptions {
  method: string
  headers: Record<string, string>
  body?: string
}

async function homeFeed (): Promise<NetworkHomeData> {
  const options: FetchOptions = {
    method: 'GET'
  }

  const r = await fetch(`http://localhost:2503/feed/home`, options)
  const res = await r.json()
  if (res.meta.code !== 200) {
    var err = { code: res.meta.code, message: res.meta.error }
    throw err // eslint-disable-line
  }

  return res.data as NetworkHomeData
}

export const Home = () => {
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    homeFeed()
      .then(f => {
        setData(f)
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        setError(error)
      })
  }, [false])

  return <NetworkHome data={data} loading={loading} error={error} />
}

Home.story = {
  name: 'Home',
  parameters: { note: 'caution: uses live data' }
}

// export const StdDatasetOverview = () => {
//   const handle = (label: string) => {
//     return (d: IDataset, e: React.SyntheticEvent) => {
//       alert(`${label}: ${d.peername}/${d.name}`)
//     }
//   }

//   const actions: ActionButtonProps[] = [
//     { icon: 'clone', text: 'Clone', onClick: handle('clone') },
//     { icon: 'edit', text: 'Edit', onClick: handle('edit') },
//     { icon: 'export', text: 'Export', onClick: handle('export') }
//   ]

//   return (
//     <div style={{ margin: 0, padding: 30, minHeight: '100%', background: '#F5F7FA' }}>
//       <div style={{ width: 800, margin: '2em auto' }}>
//         <Router>
//           <Navbar location='foo/bar' />
//           <Dataset data={cities} onClone={handle('clone')} onEdit={handle('edit')} onExport={handle('export')} />
//         </Router>
//       </div>
//     </div>
//   )
// }

// StdDatasetOverview.story = {
//   name: 'Dataset Overview: Standard',
//   parameters: { note: 'basic, ideal-input dataset overview' }
// }
