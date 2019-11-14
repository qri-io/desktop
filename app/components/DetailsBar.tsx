import * as React from 'react'
import { Details, DetailsType, StatsDetails } from '../models/details'

export interface DetailsBarProps {
  details: Details
}
const DetailsBar: React.FunctionComponent<DetailsBarProps> = (props) => {
  const {
    details
  } = props
  console.log(details)

  const renderStatsDetails = () => {
    const statsDetails = details as StatsDetails
    return (
      <div>
        <h2>{statsDetails.title}</h2>
        <p>{JSON.stringify(statsDetails.stats)}</p>
      </div>
    )
  }

  return <div className='details-bar padding'>
    <h1>Details</h1>
    <div className="details-bar-content margin">
      {details.type === DetailsType.StatsDetails && renderStatsDetails()}
    </div>
  </div>
}

export default DetailsBar
