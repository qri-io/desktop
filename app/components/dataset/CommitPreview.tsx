import React from 'react'
import moment from 'moment'

import Commit from '../../models/dataset'

export interface CommitPreviewProps {
  data: Commit
}

const CommitPreview: React.FunctionComponent<CommitPreviewProps> = ({ data }) => {
  if (!data) { return null }

  const { timestamp, author, title } = data

  return (
    <div className='commit-preview'>
      by <span>{author}</span> <span className='dataset-details-item'>{moment(timestamp).fromNow()}</span>
      <span>{title}</span>
    </div>
  )
}

export default CommitPreview
