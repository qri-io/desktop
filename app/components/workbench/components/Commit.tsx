import * as React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import { QriRef, qriRefFromRoute } from '../../../models/qriRef'
import { Commit } from '../../../models/dataset'
import Store, { RouteProps } from '../../../models/store'
import { selectDatasetCommit, selectDatasetIsLoading } from '../../../selections'
import SpinnerWithIcon from '../../chrome/SpinnerWithIcon'

export interface CommitProps extends RouteProps {
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
    isLoading: selectDatasetIsLoading(state),
    commit: selectDatasetCommit(state)
  }
}

// TODO (b5) - this doesn't need to be a container
export default connect(mapStateToProps)(CommitComponent)
