import * as React from 'react'
import { connect } from 'react-redux'
import { ApiActionThunk } from '../../store/api'

import Dataset from '../../models/dataset'
import Store from '../../models/store'
import { selectHistoryDataset, selectWorkingDataset, selectOnHistoryTab } from '../../selections'

import Code from '../Code'

export interface TransformProps {
  data: string

  // TODO (b5) - work in progress
  dryRun?: () => void
  write?: (dataset: Dataset) => ApiActionThunk | void
}

export const TransformComponent: React.FC<TransformProps> = ({ data = '' }) => (
  <Code data={data} />
)

const mapStateToProps = (state: Store) => {
  const history = selectOnHistoryTab(state)
  return {
    data: history ? selectHistoryDataset(state).transform : selectWorkingDataset(state).transform
  }
}

export default connect(mapStateToProps)(TransformComponent)
