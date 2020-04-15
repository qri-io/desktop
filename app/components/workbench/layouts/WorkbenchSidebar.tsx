import * as React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { QriRef, qriRefFromRoute } from '../../../models/qriRef'
import { VersionInfo, PageInfo } from '../../../models/store'

import { selectLog, selectVersionInfoFromWorkingDataset, selectLogPageInfo } from '../../../selections'
import { pathToEdit, pathToHistory } from '../../../paths'

import DatasetReference from '../../DatasetReference'
import DatasetDetailsSubtext from '../../dataset/DatasetDetailsSubtext'

export interface WorkbenchSidebarData {
  versionInfo: VersionInfo
  logPageInfo: PageInfo
  logLength: number
}

export interface WorkbenchSidebarProps extends RouteComponentProps<QriRef> {
  qriRef: QriRef
  data: WorkbenchSidebarData

  // passed in props
  activeTab: string
}

export const WorkbenchSidebarComponent: React.FunctionComponent<WorkbenchSidebarProps> = (props) => {
  const {
    qriRef,
    data,
    history,
    children,
    activeTab
  } = props

  const { logPageInfo, logLength, versionInfo } = data

  const {
    username = '',
    name = '',
    path = ''
  } = qriRef

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
              history.push(pathToEdit(username, name))
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
              history.push(pathToHistory(username, name, path))
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

const mapStateToProps = (state: any, ownProps: WorkbenchSidebarProps) => {
  return {
    ...ownProps,
    qriRef: qriRefFromRoute(ownProps),
    data: {
      logPageInfo: selectLogPageInfo(state),
      logLength: selectLog(state).length,
      versionInfo: selectVersionInfoFromWorkingDataset(state)
    }
  }
}

export default withRouter(connect(mapStateToProps)(WorkbenchSidebarComponent))
