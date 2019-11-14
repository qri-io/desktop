import * as React from 'react'
import { Details } from '../models/details'

export interface DetailsBarProps {
  details: Details
}
const DetailsBar: React.FunctionComponent<DetailsBarProps> = (props) => {
  const {
    details
  } = props
  console.log(details)
  return <div className='details-bar padding'>
    <h1>Details</h1>
  </div>
}

export default DetailsBar
