import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import { BACKEND_URL } from '../../constants'
import { NetworkHomeData } from '../../models/network'

import Spinner from '../chrome/Spinner'
import DatasetItem from '../item/DatasetItem'
import Dataset from '../../models/dataset'

const initialDataState: NetworkHomeData = {
  featured: [],
  recent: []
}

// NetworkHome accepts no props
const NetworkHome: React.FC<RouteComponentProps> = ({ history }) => {
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState(initialDataState)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    homeFeed()
      .then(f => {
        /**
         * TODO (ramfox): this mapping is temporary. The feed, list, and search endpoints
         * should return VersionInfo's, which already have `username` in place
         * of `username`
         */
        let data = { ...f }
        if (data.featured) {
          data.featured = f.featured.map((d: Dataset) => {
            return {
              ...d,
              username: d.peername
            }
          })
        }
        if (data.recent) {
          data.recent = f.recent.map((d: Dataset) => {
            return {
              ...d,
              username: d.peername
            }
          })
        }
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
        <label>Featured Datasets</label>
        {featured.map((ds, i) => <DatasetItem onClick={(username: string, name: string) => {
          console.log(username, name)
          history.push(`/network/${username}/${name}`)
        }} data={ds} key={i} />)}
      </div>}
      {recent && recent.length && <div>
        <label>Recent Datasets</label>
        {recent.map((ds, i) => <DatasetItem onClick={(username: string, name: string) => {
          console.log(username, name)
          history.push(`/network/${username}/${name}`)
        }} data={ds} key={i} />)}
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

  const r = await fetch(`${BACKEND_URL}/registry/feed/home`, options)
  const res = await r.json()
  if (res.meta.code !== 200) {
    var err = { code: res.meta.code, message: res.meta.error }
    throw err // eslint-disable-line
  }

  return res.data as NetworkHomeData
}
