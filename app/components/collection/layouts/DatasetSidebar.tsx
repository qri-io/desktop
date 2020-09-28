import * as React from 'react'
import classNames from 'classnames'

import { QriRef, qriRefFromRoute, qriRefIsEmpty } from '../../../models/qriRef'
import { VersionInfo, PageInfo, RouteProps } from '../../../models/store'

import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'
import { pathToEdit, pathToDataset } from '../../../paths'

import { selectLog, selectVersionInfoFromWorkingDataset, selectLogPageInfo, selectLatestPath, selectRecentEditRef, selectRecentHistoryRef } from '../../../selections'

import DatasetReference from '../../DatasetReference'
import DatasetDetailsSubtext from '../../dataset/DatasetDetailsSubtext'
import ReactTooltip from 'react-tooltip'

export interface DatasetSidebarData {
  versionInfo: VersionInfo
  logPageInfo: PageInfo
  logLength: number
}

export interface DatasetSidebarProps extends RouteProps {
  qriRef: QriRef
  data: DatasetSidebarData
  lastEditRef: QriRef
  lastHistoryRef: QriRef
  latestPath: string

  // passed in props
  activeTab: string
}

export const DatasetSidebarComponent: React.FunctionComponent<DatasetSidebarProps> = (props) => {
  const {
    qriRef,
    data,
    history,
    children,
    activeTab,
    lastEditRef,
    lastHistoryRef,
    latestPath
  } = props

  const { logPageInfo, logLength, versionInfo } = data

  const {
    username,
    name
  } = qriRef

  // The `ReactTooltip` component relies on the `data-for` and `data-tip` attributes
  // we need to rebuild `ReactTooltip` so that it can recognize the `data-for`
  // or `data-tip` attributes that are rendered in this component
  React.useEffect(ReactTooltip.rebuild, [])

  const datasetSelected = username !== '' && name !== ''

  const historyToolTip = logLength !== 0 || !datasetSelected ? 'Explore older versions of this dataset' : 'This dataset has no previous versions'

  // if no dataset is selected, what to return
  return (
    <div className='sidebar'>
      <div className='sidebar-header sidebar-padded-container'>
        <p className='pane-title'>Dataset</p>
        <DatasetReference qriRef={qriRef} />
        <DatasetDetailsSubtext data={versionInfo} />
      </div>
      <div id='tabs' className='sidebar-padded-container'>
        <div
          id='status-tab'
          className={classNames('tab', { 'active': activeTab === 'status' && datasetSelected, 'disabled': activeTab === 'disabled' || !datasetSelected })}
          onClick={() => {
            if (datasetSelected) {
              if (qriRefIsEmpty(lastEditRef)) {
                history.push(pathToEdit(username, name))
              } else {
                history.push(lastEditRef.location)
              }
            }
          }}
          data-tip='View the working changes<br/> to this dataset&apos;s components'
        >
          Status
        </div>
        <div
          id='history-tab'
          className={classNames('tab', { 'active': activeTab === 'history', 'disabled': (logPageInfo.error && logPageInfo.error.includes('no history')) || activeTab === 'disabled' || !datasetSelected })}
          onClick={() => {
            if ((!(logPageInfo.error && logPageInfo.error.includes('no history')) && datasetSelected)) {
              if (qriRefIsEmpty(lastHistoryRef)) {
                history.push(pathToDataset(username, name, latestPath))
              } else {
                history.push(lastHistoryRef.location)
              }
            }
          }}
          data-tip={historyToolTip}
        >
          History {/* <div className='badge'>TODO (chriswhong): use this badge to show "new commits"</div> */}
        </div>
      </div>
      {children}
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
      lastEditRef: selectRecentEditRef(state),
      lastHistoryRef: selectRecentHistoryRef(state),
      latestPath: selectLatestPath(state, qriRef.username, qriRef.name),
      data: {
        logPageInfo: selectLogPageInfo(state),
        logLength: selectLog(state).length,
        versionInfo: selectVersionInfoFromWorkingDataset(state)
      }
    }
  }
)
