import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import Store from '../../models/Store'
import { QriRef } from '../../models/qriRef'

import WorkbenchLayout from './layouts/WorkbenchLayout'
import NoDatasetsMainContent from './NoDatasetsMainContent'
import DisabledComponentList from './DisabledComponentList'

export type NoDatasetsProps = RouteComponentProps<QriRef>

export const NoDatasetsComponent: React.FunctionComponent<NoDatasetsProps> = (props) => {
  return (
    <WorkbenchLayout
      id='dataset-edit'
      activeTab='status'
      mainContent={<NoDatasetsMainContent />}
      sidebarContent={<DisabledComponentList />}
    />
  )
}

const mapStateToProps = (state: Store, ownProps: NoDatasetsProps) => {
  return ownProps
}

export default withRouter(connect(mapStateToProps)(NoDatasetsComponent))
