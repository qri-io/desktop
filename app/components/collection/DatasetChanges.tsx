import React from 'react'

import Store, { RouteProps, VersionInfo } from '../../models/Store'
import { QriRef, qriRefFromRoute } from '../../models/qriRef'
import { LaunchedFetchesAction } from '../../store/api'
import { connectComponentToPropsWithRouter } from '../../utils/connectComponentToProps'
import { fetchWorkbench } from '../../actions/workbench'

import { selectLogPageInfo, selectChangeReportLeft } from '../../selections'
import Changes, { LoadingDatasetChanges } from '../changes/Changes'
import Layout from '../Layout'
import { pathToDataset } from '../../paths'

export interface DatasetChangesProps extends RouteProps {
  qriRef: QriRef
  log: VersionInfo[]
  fetchWorkbench: (qriRef: QriRef) => LaunchedFetchesAction
  left?: QriRef
  isLogLoading: boolean
}

export const DatasetChangesComponent: React.FunctionComponent<DatasetChangesProps> = (props) => {
  const {
    qriRef,
    left,
    isLogLoading,
    fetchWorkbench
  } = props

  React.useEffect(() => {
    fetchWorkbench(qriRef)
  }, [qriRef.location])

  return (
    <Layout
      id='dataset-changes'
      backButtonUrl={pathToDataset(qriRef.username, qriRef.name, qriRef.path || '')}
      subTitle={`${qriRef.username}/`}
      title={qriRef.name}
      mainContent={
        <div className='dataset-content transition-group'>
          {
            isLogLoading
              ? <LoadingDatasetChanges />
              : <Changes
                left={left}
                right={qriRef}
              />}
        </div>}
    />
  )
}

export default connectComponentToPropsWithRouter(
  DatasetChangesComponent,
  (state: Store, ownProps: DatasetChangesProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      ...ownProps,
      qriRef,
      isLogLoading: selectLogPageInfo(state).isFetching,
      left: selectChangeReportLeft(state, qriRef)
    }
  },
  {
    fetchWorkbench
  }
)
