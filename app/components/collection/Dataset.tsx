import React from 'react'

import Store, { RouteProps } from '../../models/Store'
import Dataset from '../../models/dataset'
import { QriRef, qriRefFromRoute } from '../../models/qriRef'
import { LaunchedFetchesAction } from '../../store/api'
import { connectComponentToPropsWithRouter } from '../../utils/connectComponentToProps'
import { fetchWorkbench } from '../../actions/workbench'
import { selectDataset } from '../../selections'
import { setModal } from '../../actions/ui'

import ComponentList from './ComponentList'
import ComponentRouter from './ComponentRouter'
import DatasetHeader from './DatasetHeader'
import DatasetLayout from './layouts/DatasetLayout'
import Layout from '../Layout'
import LogList from './LogList'

export interface DatasetProps extends RouteProps {
  qriRef: QriRef
  dataset: Dataset
  fetchWorkbench: (qriRef: QriRef) => LaunchedFetchesAction
}

export const DatasetComponent: React.FunctionComponent<DatasetProps> = (props) => {
  const {
    qriRef,
    dataset,
    fetchWorkbench
  } = props

  React.useEffect(() => {
    fetchWorkbench(qriRef)
  }, [qriRef.location])

  return (
    <DatasetLayout
      id='dataset-history'
      mainContent={
        <div className='dataset-content transition-group'>
          <Layout
            showNav={false}
            id='commit-details'
            headerContent={
              <DatasetHeader
                path={qriRef.path || ''}
                structure={dataset.structure}
                commit={dataset.commit}
              />
            }
            sidebarContent={<ComponentList qriRef={qriRef}/>}
            sidebarWidth={150}
            mainContent={<ComponentRouter qriRef={qriRef}/>}
          />
        </div>}
      sidebarContent={<LogList qriRef={qriRef}/>}
    />
  )
}

export default connectComponentToPropsWithRouter(
  DatasetComponent,
  (state: Store, ownProps: DatasetProps) => {
    return {
      ...ownProps,
      qriRef: qriRefFromRoute(ownProps),
      dataset: selectDataset(state)
    }
  },
  {
    fetchWorkbench,
    setModal
  }
)
