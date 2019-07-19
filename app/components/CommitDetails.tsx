import * as React from 'react'
import { Commit } from '../models/dataset'

interface CommitDetailsProps {
  commit: Commit
}

const CommitDetails: React.FunctionComponent<CommitDetailsProps> = (props: CommitDetailsProps) => {
  return (
    <div className='dataset-sidebar'>
      {props.commit.title}
      {props.commit.message}
      {props.commit.path}
    </div>
  )
}

export default CommitDetails
