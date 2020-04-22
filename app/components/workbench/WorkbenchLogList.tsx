import * as React from 'react'
import path from 'path'
import { connect } from 'react-redux'
import { MenuItemConstructorOptions, remote, ipcRenderer } from 'electron'
import { Dispatch, bindActionCreators } from 'redux'
import ContextMenuArea from 'react-electron-contextmenu'
import { withRouter } from 'react-router-dom'
import moment from 'moment'

import { ApiActionThunk } from '../../store/api'
import { QriRef, refStringFromQriRef, qriRefFromRoute } from '../../models/qriRef'
import { VersionInfo, PageInfo, RouteProps } from '../../models/store'

import { fetchLog } from '../../actions/api'

import { selectLog, selectLogPageInfo } from '../../selections'

import LogListItem from '../item/LogListItem'
import { pathToDataset } from '../../paths'

interface WorkbenchLogListProps extends RouteProps {
  qriRef: QriRef
  log: VersionInfo[]
  logPageInfo: PageInfo
  fetchLog: (username: string, name: string, page?: number, pageSize?: number) => ApiActionThunk
}

export const WorkbenchLogListComponent: React.FunctionComponent<WorkbenchLogListProps> = (props) => {
  const {
    qriRef,
    log,
    logPageInfo,
    history,
    fetchLog
  } = props

  const { username, name } = qriRef

  const handleLogScroll = (e: any) => {
    if (e.target.scrollHeight === parseInt(e.target.scrollTop) + parseInt(e.target.offsetHeight)) {
      fetchLog(username, name, logPageInfo.page + 1, logPageInfo.pageSize)
    }
  }

  const handleExport = (versionInfo: VersionInfo) => {
    const window = remote.getCurrentWindow()
    const zipName = `${username}-${name}-${moment(versionInfo.commitTime).format('MM-DD-YYYY-hh-mm-ss-a')}.zip`
    const selectedPath: string | undefined = remote.dialog.showSaveDialogSync(window, { defaultPath: zipName })

    if (!selectedPath) {
      return
    }

    const exportUrl = `http://localhost:2503/export/${refStringFromQriRef(qriRef)}?download=true&all=true`
    ipcRenderer.send('export', { url: exportUrl, directory: path.dirname(selectedPath) })
  }

  return (
    <div
      id='history-list'
      className='sidebar-content'
      onScroll={(e) => handleLogScroll(e)}
    >
      {
        log.map((item, i) => {
          if (item.foreign) {
            return <LogListItem
              data={item}
              key={item.path}
              id={`HEAD-${i + 1}`}
              first={i === 0}
              last={i === log.length - 1}
              selected={qriRef.path === item.path}
              onClick={() => {
                history.push(pathToDataset(username, name, item.path))
              }}
            />
          }
          const menuItems: MenuItemConstructorOptions[] = [
            {
              label: 'Export this version',
              click: () => {
                handleExport(item)
              }
            }
          ]
          return (
            <ContextMenuArea menuItems={menuItems} key={item.path}>
              <LogListItem
                data={item}
                key={item.path}
                id={`HEAD-${i + 1}`}
                first={i === 0}
                last={i === log.length - 1}
                selected={qriRef.path === item.path}
                onClick={() => {
                  history.push(pathToDataset(username, name, item.path))
                }}
              />
            </ContextMenuArea>
          )
        })
      }
    </div>)
}

const mapStateToProps = (state: any, ownProps: WorkbenchLogListProps) => {
  return {
    qriRef: qriRefFromRoute(ownProps),
    log: selectLog(state),
    logPageInfo: selectLogPageInfo(state),
    ...ownProps
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    fetchLog
  }, dispatch)
}

const mergeProps = (props: any, actions: any): WorkbenchLogListProps => {
  return { ...props, ...actions }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(WorkbenchLogListComponent))
