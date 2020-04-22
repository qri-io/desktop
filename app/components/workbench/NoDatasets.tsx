import * as React from 'react'

import { RouteProps } from '../../models/Store'

import { connectComponentToPropsWithRouter } from '../../utils/connectComponentToProps'

import WorkbenchLayout from './layouts/WorkbenchLayout'
import NoDatasetsMainContent from './NoDatasetsMainContent'
import DisabledComponentList from './DisabledComponentList'

export type NoDatasetsProps = RouteProps

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

export default connectComponentToPropsWithRouter(NoDatasetsComponent)
