import * as React from 'react'
import { connect } from 'react-redux'
import { MenuItemConstructorOptions, remote, ipcRenderer } from 'electron'
import { Action, Dispatch, bindActionCreators } from 'redux'
import ContextMenuArea from 'react-electron-contextmenu'

import { ApiActionThunk } from '../../store/api'
import { QriRef } from '../../models/qriRef'
import { History } from '../../models/store'

import { setCommit } from '../../actions/selections'
import { fetchHistory } from '../../actions/api'

import { selectHistory } from '../../selections'

import HistoryListItem from '../item/HistoryListItem'

interface WorkbenchLogListProps {
  qriRef: QriRef
  history: History
  setCommit: (path: string) => Action
  fetchHistory: (page?: number, pageSize?: number) => ApiActionThunk
}

export const WorkbenchLogListComponent: React.FunctionComponent<WorkbenchLogListProps> = (props) => {
  const {
    qriRef,
    history,

    fetchHistory,
    setCommit
  } = props

  const handleHistoryScroll = (e: any) => {
    if (e.target.scrollHeight === parseInt(e.target.scrollTop) + parseInt(e.target.offsetHeight)) {
      fetchHistory(history.pageInfo.page + 1, history.pageInfo.pageSize)
    }
  }

  const handleExport = (path: string) => {
    const window = remote.getCurrentWindow()
    const selectedPath: string | undefined = remote.dialog.showSaveDialogSync(window, {})

    if (!selectedPath) {
      return
    }

    const pathUrl = path === '' ? '' : `/at/${path}`
    const exportUrl = `http://localhost:2503/export/${username}/${name}${pathUrl}?download=true&all=true`
    ipcRenderer.send('export', { url: exportUrl, directory: selectedPath })
  }

  return (
    <div
      id='history-list'
      className='sidebar-content'
      onScroll={(e) => handleHistoryScroll(e)}
    >
      {
        history.value.map((item, i) => {
          if (item.foreign) {
            return <HistoryListItem
              data={item}
              key={item.path}
              id={`HEAD-${i + 1}`}
              first={i === 0}
              last={i === history.value.length - 1}
              selected={qriRef.path === item.path}
              onClick={setCommit}
            />
          }
          const menuItems: MenuItemConstructorOptions[] = [
            {
              label: 'Export this version',
              click: () => {
                handleExport(item.path)
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
                last={i === history.value.length - 1}
                selected={qriRef.path === item.path}
                onClick={setCommit}
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
    history: selectHistory(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    setCommit,
    fetchHistory
  }, dispatch)
}

const mergeProps = (props: any, actions: any): WorkbenchLogListProps => {
  return { ...props, ...actions }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(WorkbenchLogListComponent)
