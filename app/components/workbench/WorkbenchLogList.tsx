import * as React from 'react'
import path from 'path'
import { MenuItemConstructorOptions, remote, ipcRenderer } from 'electron'
import ContextMenuArea from 'react-electron-contextmenu'
import moment from 'moment'

import { ApiActionThunk } from '../../store/api'
import { QriRef, refStringFromQriRef, qriRefFromRoute } from '../../models/qriRef'
import { VersionInfo, PageInfo, RouteProps } from '../../models/store'

import { connectComponentToPropsWithRouter } from '../../utils/connectComponentToProps'

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

    const directory = path.dirname(selectedPath)
    const filename = path.basename(selectedPath)
    const exportUrl = `http://localhost:2503/${refStringFromQriRef(qriRef)}?format=zip`
    ipcRenderer.send('export', { url: exportUrl, filename: filename, directory: directory })
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

export default connectComponentToPropsWithRouter(
  WorkbenchLogListComponent,
  (state: any, ownProps: WorkbenchLogListProps) => {
    return {
      qriRef: qriRefFromRoute(ownProps),
      log: selectLog(state),
      logPageInfo: selectLogPageInfo(state),
      ...ownProps
    }
  },
  {
    fetchLog
  }
)
