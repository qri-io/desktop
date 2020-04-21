import * as React from 'react'
import { connect } from 'react-redux'
import { ApiActionThunk } from '../../../store/api'

import Dataset from '../../../models/dataset'
import Store, { RouteProps } from '../../../models/store'
import { QriRef, qriRefFromRoute } from '../../../models/qriRef'

import { selectHistoryDataset, selectWorkingDataset, selectHistoryDatasetIsLoading, selectWorkingDatasetIsLoading } from '../../../selections'

import Code from '../../Code'
import SpinnerWithIcon from '../../chrome/SpinnerWithIcon'

export interface TransformProps extends RouteProps {
  qriRef: QriRef
  data: string
  isLoading: boolean

  // TODO (b5) - work in progress
  dryRun?: () => void
  write?: (username: string, name: string, dataset: Dataset) => ApiActionThunk | void
}

export const TransformComponent: React.FunctionComponent<TransformProps> = ({ data = '', isLoading }) => {
  if (isLoading) {
    return <SpinnerWithIcon loading />
  }
  return <Code data={data} />
}

const mapStateToProps = (state: Store, ownProps: TransformProps) => {
  const qriRef = qriRefFromRoute(ownProps)
  const showHistory = !!qriRef.path
  return {
    qriRef,
    isLoading: showHistory ? selectHistoryDatasetIsLoading(state) : selectWorkingDatasetIsLoading(state),
    data: showHistory ? selectHistoryDataset(state).transform : selectWorkingDataset(state).transform
  }
}

export default connect(mapStateToProps)(TransformComponent)
