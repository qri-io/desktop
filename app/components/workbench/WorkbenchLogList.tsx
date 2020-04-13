import * as React from 'react'
import { connect } from 'react-redux'
import { MenuItemConstructorOptions, remote, ipcRenderer } from 'electron'
import { Dispatch, bindActionCreators } from 'redux'
import ContextMenuArea from 'react-electron-contextmenu'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import moment from 'moment'

import { ApiActionThunk } from '../../store/api'
import { QriRef, refStringFromQriRef } from '../../models/qriRef'
import { History, VersionInfo } from '../../models/store'

import { fetchHistory } from '../../actions/api'

import { selectHistory } from '../../selections'

import HistoryListItem from '../item/HistoryListItem'
import { pathToHistory } from '../../paths'

interface WorkbenchLogListProps extends RouteComponentProps<QriRef> {
  qriRef: QriRef
  versions: History
  fetchHistory: (username: string, name: string, page?: number, pageSize?: number) => ApiActionThunk
}

export const WorkbenchLogListComponent: React.FunctionComponent<WorkbenchLogListProps> = (props) => {
  const {
    qriRef,
    versions,
    history,
    fetchHistory
  } = props

  const { username, name } = qriRef

  const handleHistoryScroll = (e: any) => {
    if (e.target.scrollHeight === parseInt(e.target.scrollTop) + parseInt(e.target.offsetHeight)) {
      fetchHistory(username, name, versions.pageInfo.page + 1, versions.pageInfo.pageSize)
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
    ipcRenderer.send('export', { url: exportUrl, directory: selectedPath })
  }

  return (
    <div
      id='history-list'
      className='sidebar-content'
      onScroll={(e) => handleHistoryScroll(e)}
    >
      {
        versions.value.map((item, i) => {
          if (item.foreign) {
            return <HistoryListItem
              data={item}
              key={item.path}
              id={`HEAD-${i + 1}`}
              first={i === 0}
              last={i === versions.value.length - 1}
              selected={qriRef.path === item.path}
              onClick={() => {
                history.push(pathToHistory(username, name, item.path))
              }
              }
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
              <HistoryListItem
                data={item}
                key={item.path}
                id={`HEAD-${i + 1}`}
                first={i === 0}
                last={i === versions.value.length - 1}
                selected={qriRef.path === item.path}
                onClick={() => {
                  history.push(pathToHistory(username, name, item.path))
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
    ...ownProps,
    versions: selectHistory(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    fetchHistory
  }, dispatch)
}

const mergeProps = (props: any, actions: any): WorkbenchLogListProps => {
  return { ...props, ...actions }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(WorkbenchLogListComponent))
