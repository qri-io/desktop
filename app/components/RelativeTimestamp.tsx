import React from 'react'
import moment from 'moment'

interface RelativeTimestampProps {
  timestamp: string
}

const RelativeTimestamp: React.FunctionComponent<RelativeTimestampProps> = ({ timestamp }) => (
  <span
    className='relative-timestamp'
    title={moment(timestamp).format('MMM D YYYY, h:mm A zz')}
  >
    {moment(timestamp).fromNow()}
  </span>
)

export default RelativeTimestamp
