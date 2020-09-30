import * as React from 'react'

import { QriRef, qriRefFromRoute } from '../../../models/qriRef'
import { VersionInfo, RouteProps } from '../../../models/store'

import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'

import { selectVersionInfoFromWorkingDataset } from '../../../selections'

import DatasetReference from '../../DatasetReference'
import DatasetDetailsSubtext from '../../dataset/DatasetDetailsSubtext'
import ReactTooltip from 'react-tooltip'
import LogList from '../LogList'

export interface DatasetSidebarProps extends RouteProps {
  qriRef: QriRef
  data: VersionInfo
}

export const DatasetSidebarComponent: React.FunctionComponent<DatasetSidebarProps> = (props) => {
  const {
    qriRef,
    data
  } = props

  // The `ReactTooltip` component relies on the `data-for` and `data-tip` attributes
  // we need to rebuild `ReactTooltip` so that it can recognize the `data-for`
  // or `data-tip` attributes that are rendered in this component
  React.useEffect(ReactTooltip.rebuild, [])

  return (
    <div className='sidebar'>
      <div className='sidebar-header sidebar-padded-container'>
        <DatasetReference qriRef={qriRef} />
        <DatasetDetailsSubtext data={data} />
      </div>
      <LogList qriRef={qriRef} />
    </div>
  )
}

export default connectComponentToPropsWithRouter(
  DatasetSidebarComponent,
  (state: any, ownProps: DatasetSidebarProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      ...ownProps,
      qriRef,
      data: selectVersionInfoFromWorkingDataset(state)
    }
  }
)
