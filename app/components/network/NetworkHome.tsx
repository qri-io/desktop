import React from 'react'

import { BACKEND_URL } from '../../constants'
import { NetworkHomeData } from '../../models/network'

import Spinner from '../chrome/Spinner'
import DatasetItem from '../item/Dataset'

const initialDataState: NetworkHomeData = {
  featured: [],
  recent: []
}

// NetworkHome accepts no props
const NetworkHome: React.FC<{}> = () => {
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState(initialDataState)
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
        {featured.map((ds, i) => <DatasetItem data={ds} key={i} />)}
      </div>}
      {recent && recent.length && <div>
        <label>Recent Datasets</label>
        {recent.map((ds, i) => <DatasetItem data={ds} key={i} />)}
      </div>}
    </div>
  )
}

export default NetworkHome

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
