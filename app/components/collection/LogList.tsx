import * as React from 'react'
import path from 'path'
import { MenuItemConstructorOptions, remote, ipcRenderer } from 'electron'
import ContextMenuArea from 'react-electron-contextmenu'
import moment from 'moment'

import { ApiActionThunk } from '../../store/api'
import { QriRef, refStringFromQriRef, qriRefFromRoute, qriRefIsEmpty } from '../../models/qriRef'
import { VersionInfo, PageInfo, RouteProps } from '../../models/store'

import { connectComponentToPropsWithRouter } from '../../utils/connectComponentToProps'

import { fetchLog } from '../../actions/api'

import { selectLog, selectLogPageInfo, selectInNamespace, selectRecentEditRef } from '../../selections'

import LogListItem from '../item/LogListItem'
import { pathToDataset, pathToEdit } from '../../paths'
import WorkingLogListItem from '../item/WorkingLogListItem'

interface LogListProps extends RouteProps {
  qriRef: QriRef
  recentEditRef: QriRef
  log: VersionInfo[]
  logPageInfo: PageInfo
  editableDataset?: boolean
  fetchLog: (username: string, name: string, page?: number, pageSize?: number) => ApiActionThunk
}

export const LogListComponent: React.FunctionComponent<LogListProps> = (props) => {
  const {
    qriRef,
    log,
    logPageInfo,
    history,
    editableDataset = false,
    recentEditRef,
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

    const directory = path.dirname(selectedPath)
    const filename = path.basename(selectedPath)
    const refString = refStringFromQriRef(qriRef)
    ipcRenderer.send('export', { refString, filename: filename, directory: directory })
  }

  return (
    <div
      id='history-list'
      className='sidebar-content'
      onScroll={(e) => handleLogScroll(e)}
    >
      {
        editableDataset && <WorkingLogListItem
          onClick={() => {
            if (qriRefIsEmpty(recentEditRef)) {
              history.push(pathToEdit(username, name))
            } else {
              history.push(recentEditRef.location)
            }
          }}
          selected={!qriRef.path || qriRef.path === ''}
          last={log.length === 0}
        />
      }
      {
        log.map((item, i) => {
          const id = `HEAD-${i}`
          if (item.foreign) {
            return <LogListItem
              data={item}
              key={item.path}
              id={id}
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
                id={id}
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

export default connectComponentToPropsWithRouter(
  LogListComponent,
  (state: any, ownProps: LogListProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      qriRef,
      log: selectLog(state),
      logPageInfo: selectLogPageInfo(state),
      editableDataset: selectInNamespace(state, qriRef),
      recentEditRef: selectRecentEditRef(state),
      ...ownProps
    }
  },
  {
    fetchLog
  }
)
