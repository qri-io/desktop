import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { bindActionCreators, Dispatch } from 'redux'

import Store from '../../models/Store'
import Dataset from '../../models/dataset'
import { QriRef, qriRefFromRoute } from '../../models/qriRef'

import { LaunchedFetchesAction } from '../../store/api'

import { fetchWorkbench } from '../../actions/workbench'

import { selectHistoryDataset } from '../../selections'

import HistoryComponentList from './HistoryComponentList'
import ComponentRouter from './ComponentRouter'
import Layout from '../Layout'
import HistoryDatasetHeader from './HistoryDatasetHeader'
import WorkbenchLayout from './layouts/WorkbenchLayout'
import WorkbenchLogList from './WorkbenchLogList'

export interface HistoryDatasetProps extends RouteComponentProps<QriRef> {
  qriRef: QriRef
  dataset: Dataset
  fetchWorkbench: (qriRef: QriRef) => LaunchedFetchesAction
}

export const HistoryDatasetComponent: React.FunctionComponent<HistoryDatasetProps> = (props) => {
  const {
    qriRef,
    dataset,
    fetchWorkbench
  } = props

  React.useEffect(() => {
    fetchWorkbench(qriRef)
  }, [qriRef.location])

  return (
    <WorkbenchLayout
      id='dataset-history'
      activeTab='history'
      mainContent={
        <div className='dataset-content transition-group'>
          <Layout
            showNav={false}
            id={'commit-details'}
            headerContent={
              <HistoryDatasetHeader
                path={qriRef.path || ''}
                structure={dataset.structure}
                commit={dataset.commit}
              />
            }
            sidebarContent={(
              <HistoryComponentList qriRef={qriRef}/>
            )}
            sidebarWidth={150}
            mainContent={(
              <ComponentRouter qriRef={qriRef}/>
            )}
          />
        </div>}
      sidebarContent={<WorkbenchLogList qriRef={qriRef}/>}
    />
  )
}

const mapStateToProps = (state: Store, ownProps: HistoryDatasetProps) => {
  return {
    ...ownProps,
    qriRef: qriRefFromRoute(ownProps),
    dataset: selectHistoryDataset(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    fetchWorkbench
  }, dispatch)
}

const mergeProps = (props: any, actions: any): HistoryDatasetProps => {
  return { ...props, ...actions }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(HistoryDatasetComponent))
