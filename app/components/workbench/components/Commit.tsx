import * as React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { RouteComponentProps } from 'react-router-dom'

import { QriRef, qriRefFromRoute } from '../../../models/qriRef'
import { Commit } from '../../../models/dataset'
import Store from '../../../models/store'
import { selectHistoryCommit, selectHistoryDatasetIsLoading } from '../../../selections'
import SpinnerWithIcon from '../../chrome/SpinnerWithIcon'

export interface CommitProps extends RouteComponentProps<QriRef> {
  qriRef: QriRef
  commit: Commit
  isLoading: boolean
}

export const CommitComponent: React.FunctionComponent<CommitProps> = ({
  commit,
  isLoading
}) => {
  if (isLoading) {
    return <SpinnerWithIcon loading />
  }
  return (
    <div id='history-commit' className='margin'>
      <h4>{commit.title}</h4>
      <h6>{moment(commit.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</h6>
      <div>{commit.message}</div>
    </div>
  )
}

const mapStateToProps = (state: Store, ownProps: CommitProps) => {
  return {
    ...ownProps,
    qriRef: qriRefFromRoute(ownProps),
    isLoading: selectHistoryDatasetIsLoading(state),
    commit: selectHistoryCommit(state)
  }
}

// TODO (b5) - this doesn't need to be a container
export default connect(mapStateToProps)(CommitComponent)
