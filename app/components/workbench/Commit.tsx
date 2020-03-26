import * as React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import { Commit } from '../../models/dataset'
import Store from '../../models/store'
import { selectHistoryCommit } from '../../selections'

export interface CommitProps {
  commit: Commit
}

export const CommitComponent: React.FunctionComponent<CommitProps> = ({
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

const mapStateToProps = (state: Store) => {
  return {
    commit: selectHistoryCommit(state)
  }
}

// TODO (b5) - this doesn't need to be a container
export default connect(mapStateToProps)(CommitComponent)
