import * as React from 'react'
import { connect } from 'react-redux'

import Store from '../../models/Store'
import Dataset from '../../models/dataset'
import { selectHistoryDataset } from '../../selections'
import { QriRef } from '../../models/qriRef'

import HistoryComponentList from './HistoryComponentList'
import DatasetComponent from './DatasetComponent'
import Layout from '../Layout'
import CommitDetailsHeader from './CommitDetailsHeader'

export interface CommitDetailsProps {
  qriRef: QriRef
  dataset: Dataset
}

export const CommitDetailsComponent: React.FunctionComponent<CommitDetailsProps> = (props) => {
  const {
    qriRef,
    dataset
  } = props

  const { path = '' } = qriRef

  return (
    <div className='dataset-content transition-group'>
      <Layout
        showNav={false}
        id={'commit-details'}
        headerContent={
          <CommitDetailsHeader
            path={path}
            structure={dataset.structure}
            commit={dataset.commit}
          />
        }
        sidebarContent={(
          <HistoryComponentList qriRef={qriRef}/>
        )}
        sidebarWidth={150}
        mainContent={(
          <DatasetComponent qriRef={qriRef} />
        )}
      />
    </div>
  )
}

const mapStateToProps = (state: Store, ownProps: CommitDetailsProps) => {
  return {
    ...ownProps,
    dataset: selectHistoryDataset(state)
  }
}

export default connect(mapStateToProps)(CommitDetailsComponent)
