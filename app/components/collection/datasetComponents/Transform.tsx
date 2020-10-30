import React from 'react'
import { ApiActionThunk } from '../../../store/api'

import Dataset from '../../../models/dataset'
import Store, { RouteProps } from '../../../models/store'
import { QriRef, qriRefFromRoute } from '../../../models/qriRef'

import { connectComponentToProps } from '../../../utils/connectComponentToProps'

import { selectDataset, selectWorkingDataset, selectDatasetIsLoading, selectWorkingDatasetIsLoading } from '../../../selections'

import Code from '../../Code'
import SpinnerWithIcon from '../../chrome/SpinnerWithIcon'

export interface TransformProps extends RouteProps {
  qriRef: QriRef
  data: string
  loading: boolean

  // TODO (b5) - work in progress
  dryRun?: () => void
  write?: (username: string, name: string, dataset: Dataset) => ApiActionThunk | void
}

export const TransformComponent: React.FunctionComponent<TransformProps> = ({ data = '', loading }) => {
  if (loading) {
    return <SpinnerWithIcon loading />
  }
  return <Code data={data} />
}

export default connectComponentToProps(
  TransformComponent,
  (state: Store, ownProps: TransformProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    const showHistory = !!qriRef.path
    return {
      qriRef,
      loading: showHistory ? selectDatasetIsLoading(state) : selectWorkingDatasetIsLoading(state),
      data: showHistory ? selectDataset(state).transform : selectWorkingDataset(state).transform
    }
  }
)
