import * as React from 'react'
import { connect } from 'react-redux'
import { ApiActionThunk } from '../../store/api'

import Dataset from '../../models/dataset'
import Store from '../../models/store'
import { selectHistoryDataset, selectWorkingDataset } from '../../selections'

import Code from '../Code'
import { QriRef } from '../../models/qriRef'

export interface TransformProps {
  qriRef: QriRef
  data: string

  // TODO (b5) - work in progress
  dryRun?: () => void
  write?: (username: string, name: string, dataset: Dataset) => ApiActionThunk | void
}

export const TransformComponent: React.FunctionComponent<TransformProps> = ({ data = '' }) => (
  <Code data={data} />
)

const mapStateToProps = (state: Store, ownProps: TransformProps) => {
  const { qriRef } = ownProps
  const showHistory = !!qriRef.path
  return {
    qriRef,
    data: showHistory ? selectHistoryDataset(state).transform : selectWorkingDataset(state).transform
  }
}

export default connect(mapStateToProps)(TransformComponent)
