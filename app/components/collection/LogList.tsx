import React from 'react'

/**
 * Context menus only make sense in context of the electron app right now
 * as all the actions that one can take are dependent on the dataset being
 * either in your namespace and/or should be actions that happen only if
 * you are working locally
 */
import { ContextMenuArea, MenuItems } from '../ContextMenuArea'

import { ApiActionThunk } from '../../store/api'
import { QriRef, qriRefFromRoute, qriRefIsEmpty } from '../../models/qriRef'
import { Modal, ModalType } from '../../models/modals'
import { VersionInfo, PageInfo, RouteProps } from '../../models/store'
import { setModal } from '../../actions/ui'

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
  setModal: (modal: Modal) => void
}

export const LogListComponent: React.FunctionComponent<LogListProps> = (props) => {
  const {
    qriRef,
    log,
    logPageInfo,
    history,
    editableDataset = false,
    recentEditRef,
    fetchLog,
    setModal
  } = props

  const { username, name } = qriRef

  const handleLogScroll = (e: any) => {
    if (e.target.scrollHeight === parseInt(e.target.scrollTop) + parseInt(e.target.offsetHeight)) {
      fetchLog(username, name, logPageInfo.page + 1, logPageInfo.pageSize)
    }
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
          const menuItems: MenuItems[] = [
            {
              label: 'Export this version',
              click: () => {
                setModal({ type: ModalType.ExportDataset, version: item })
              }
            }
          ]
          return (
            <ContextMenuArea
              data={menuItems}
              menuItemsFactory={(data) => data}
              key={item.path}
            >
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
    fetchLog,
    setModal
  }
)
