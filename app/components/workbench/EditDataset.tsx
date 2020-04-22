import * as React from 'react'

import Store, { RouteProps } from '../../models/Store'
import { LaunchedFetchesAction } from '../store/api'
import { QriRef, qriRefFromRoute } from '../../models/qriRef'

import { connectComponentToPropsWithRouter } from '../../utils/connectComponentToProps'

import { fetchWorkbench } from '../../actions/workbench'

import { selectInNamespace } from '../../selections'

import ComponentRouter from './ComponentRouter'
import WorkbenchLayout from './layouts/WorkbenchLayout'
import WorkingComponentList from './WorkingComponentList'
import NotInNamespace from './NotInNamespace'

interface EditDatasetProps extends RouteProps {
  qriRef: QriRef
  inNamespace: boolean
  fetchWorkbench: (qriRef: QriRef) => LaunchedFetchesAction
}

export const EditDatasetComponent: React.FunctionComponent<EditDatasetProps> = (props) => {
  const {
    qriRef,
    inNamespace,
    fetchWorkbench
  } = props
  React.useEffect(() => {
    fetchWorkbench(qriRef)
  }, [qriRef.location])

  if (!inNamespace) {
    return <NotInNamespace />
  }

  return (
    <WorkbenchLayout
      id='dataset-edit'
      activeTab='status'
      mainContent={<ComponentRouter />}
      sidebarContent={<WorkingComponentList />}
    />
  )
}

export default connectComponentToPropsWithRouter(
  EditDatasetComponent,
  (state: Store, ownProps: EditDatasetProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      ...ownProps,
      inNamespace: selectInNamespace(state, qriRef),
      qriRef
    }
  },
  {
    fetchWorkbench
  }
)
