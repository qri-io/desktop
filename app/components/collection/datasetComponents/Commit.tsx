import React from 'react'
import moment from 'moment'

import { QriRef, qriRefFromRoute } from '../../../models/qriRef'
import { Commit } from '../../../models/dataset'
import Store, { RouteProps } from '../../../models/store'

import { connectComponentToProps } from '../../../utils/connectComponentToProps'

import { selectDatasetCommit, selectDatasetIsLoading } from '../../../selections'

import SpinnerWithIcon from '../../chrome/SpinnerWithIcon'

export interface CommitProps extends RouteProps {
  qriRef: QriRef
  commit: Commit
  loading: boolean
}

export const CommitComponent: React.FunctionComponent<CommitProps> = ({
  commit,
  loading
}) => {
  if (loading) {
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

// TODO (b5) - this doesn't need to be a container
export default connectComponentToProps(
  CommitComponent,
  (state: Store, ownProps: CommitProps) => {
    return {
      ...ownProps,
      qriRef: qriRefFromRoute(ownProps),
      loading: selectDatasetIsLoading(state),
      commit: selectDatasetCommit(state)
    }
  }
)
