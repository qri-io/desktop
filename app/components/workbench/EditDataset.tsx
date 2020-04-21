import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators, Dispatch } from 'redux'

import Store, { RouteProps } from '../../models/Store'
import { LaunchedFetchesAction } from '../store/api'
import { QriRef, qriRefFromRoute } from '../../models/qriRef'

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

const mapStateToProps = (state: Store, ownProps: EditDatasetProps) => {
  const qriRef = qriRefFromRoute(ownProps)
  return {
    ...ownProps,
    inNamespace: selectInNamespace(state, qriRef),
    qriRef
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    fetchWorkbench
  }, dispatch)
}

const mergeProps = (props: any, actions: any): EditDatasetProps => {
  return { ...props, ...actions }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(EditDatasetComponent))
