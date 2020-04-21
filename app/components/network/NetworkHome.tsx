import React from 'react'
import { withRouter } from 'react-router-dom'

import { BACKEND_URL } from '../../constants'
import { NetworkHomeData } from '../../models/network'
import { VersionInfo, RouteProps } from '../../models/store'

import Spinner from '../chrome/Spinner'
import DatasetItem from '../item/DatasetItem'
import { pathToNetworkDataset } from '../../paths'

const initialDataState: NetworkHomeData = {
  featured: [],
  recent: []
}

// NetworkHome accepts no props
const NetworkHome: React.FunctionComponent<RouteProps> = ({ history }) => {
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState(initialDataState)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    homeFeed()
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(error => {
        console.log('error:', error)
        setLoading(false)
        setError(error)
      })
  }, [false])

  if (loading) {
    return <Spinner />
  } else if (error) {
    return <div><h3>{JSON.stringify(error)}</h3></div>
  }

  const { featured, recent } = data

  return (
    <div className='network_home'>
      <h2>Home</h2>
      {featured && featured.length && <div>
        <h4>Featured Datasets</h4>
        {featured.map((vi: VersionInfo, i) => <div key={i} className='featured-datasets-item'>
          <DatasetItem onClick={(username: string, name: string) => {
            history.push(pathToNetworkDataset(username, name))
          }} data={vi} id={`featured-${i}`}/>
        </div>)}
      </div>}
      {recent && recent.length && <div>
        <h4>Recent Datasets</h4>
        {recent.map((vi: VersionInfo, i) => <div key={i} className='recent-datasets-item'>
          <DatasetItem onClick={(username: string, name: string) => {
            history.push(pathToNetworkDataset(username, name))
          }} data={vi} id={`recent-${i}`} />
        </div>)}
      </div>}
    </div>
  )
}

export default withRouter(NetworkHome)

// TODO (b5) - bring this back in the near future for fetching home feed
async function homeFeed (): Promise<NetworkHomeData> {
  const options: FetchOptions = {
    method: 'GET'
  }

  const r = await fetch(`${BACKEND_URL}/feeds`, options)
  const res = await r.json()
  if (res.meta.code !== 200) {
    var err = { code: res.meta.code, message: res.meta.error }
    throw err // eslint-disable-line
  }

  return res.data as NetworkHomeData
}
