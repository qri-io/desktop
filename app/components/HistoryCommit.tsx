import * as React from 'react'
import moment from 'moment'
import { Commit } from '../models/dataset'

export interface HistoryCommitProps {
  commit: Commit
}

const HistoryCommit: React.FunctionComponent<HistoryCommitProps> = ({
  commit
}) => {
  return (
    <div id='history-commit' className='margin'>
      <h4>{commit.title}</h4>
      <h6>{moment(commit.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</h6>
      <div>{commit.message}</div>
    </div>
  )
}

export default HistoryCommit
