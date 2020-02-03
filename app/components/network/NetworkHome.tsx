import React from 'react'
import Spinner from '../chrome/Spinner'

import { NetworkHomeData } from '../../models/network'
import DatasetItem from '../item/Dataset'

export interface HomeProps {
  data: NetworkHomeData
  loading?: boolean
  error: string
}

const NetworkHome: React.FunctionComponent<HomeProps> = ({ data, loading, error }) => {
  if (loading) {
    return <Spinner />
  } else if (!data) {
    return null
  } else if (error) {
    return <div><h3>{error}</h3></div>
  }

  const { featured, recent } = data

  return (
    <div className='network_home'>
      <h1>Home</h1>
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
