import React from 'react'

import Store, { RouteProps } from '../../models/Store'
import { LaunchedFetchesAction } from '../../store/api'
import { QriRef, qriRefFromRoute } from '../../models/qriRef'

import { connectComponentToPropsWithRouter } from '../../utils/connectComponentToProps'

import { fetchWorkbench } from '../../actions/workbench'

import ComponentRouter from './ComponentRouter'
import DatasetLayout from './layouts/DatasetLayout'
import WorkingComponentList from './WorkingComponentList'
import Layout from '../Layout'
import LogList from './LogList'

interface EditDatasetProps extends RouteProps {
  qriRef: QriRef
  fetchWorkbench: (qriRef: QriRef) => LaunchedFetchesAction
}

export const EditDatasetComponent: React.FunctionComponent<EditDatasetProps> = (props) => {
  const {
    qriRef,
    fetchWorkbench
  } = props
  React.useEffect(() => {
    fetchWorkbench(qriRef)
  }, [qriRef.location])

  return (
    <DatasetLayout
      id='dataset-edit'
      activeTab='status'
      mainContent={<Layout
        showNav={false}
        id='dataset-edit-main'
        sidebarContent={
          <WorkingComponentList />
        }
        sidebarWidth={150}
        mainContent={
          <ComponentRouter qriRef={qriRef}/>
        }
      />}
      sidebarContent={<LogList qriRef={qriRef}/>}
    />
  )
}

export default connectComponentToPropsWithRouter(
  EditDatasetComponent,
  (state: Store, ownProps: EditDatasetProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      ...ownProps,
      qriRef
    }
  },
  {
    fetchWorkbench
  }
)
