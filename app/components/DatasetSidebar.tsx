import * as React from 'react'
import { Action } from 'redux'
import moment from 'moment'
import { CSSTransition } from 'react-transition-group'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'

import { ApiActionThunk } from '../store/api'
import ComponentList from './ComponentList'
import DatasetReference from './DatasetReference'

import classNames from 'classnames'
import Spinner from './chrome/Spinner'

import { DatasetDetailsSubtext } from './DatasetList'
import { WorkingDataset, ComponentType, Selections } from '../models/store'
import ContextMenuArea from 'react-electron-contextmenu'
import { MenuItemConstructorOptions, remote, ipcRenderer } from 'electron'

interface HistoryListItemProps {
  id: string
  path: string
  commitTitle: string
  timeMessage: string
  selected: boolean
  first: boolean
  last: boolean
  onClick: (type: string, selectedListItem: string) => Action
}

const HistoryListItem: React.FunctionComponent<HistoryListItemProps> = (props) => {
  const { id, selected, path, commitTitle, timeMessage, first, last } = props
  return (
    <div
      id={id}
      className={classNames(
        'sidebar-list-item',
        'sidebar-list-item-text',
        'history-list-item',
        {
          selected,
          first,
          last
        })
      }
      onClick={() => { props.onClick('commit', path) }}
    >
      <div className='icon-column'>
        <div className='history-timeline-line history-timeline-line-top' />
        <div className='history-timeline-dot' />
        <div className='history-timeline-line history-timeline-line-bottom' />
      </div>
      <div className='text-column'>
        <div className='text'>{commitTitle}</div>
        <div className='subtext'>
          {/* Bring back avatar later <img className= 'user-image' src = {props.avatarUrl} /> */}
          <div className='time-message'>
            <FontAwesomeIcon icon={faClock} size='sm'/> {timeMessage}
          </div>
        </div>
      </div>
    </div>
  )
}

export interface DatasetSidebarProps {
  selections: Selections
  workingDataset: WorkingDataset
  hideCommitNudge: boolean
  setActiveTab: (activeTab: string) => Action
  setSelectedListItem: (type: ComponentType, activeTab: string) => Action
  fetchWorkingHistory: (page?: number, pageSize?: number) => ApiActionThunk
  discardChanges: (component: ComponentType) => ApiActionThunk
  setHideCommitNudge: () => Action
  renameDataset: (peername: string, name: string, newName: string) => ApiActionThunk
}

const DatasetSidebar: React.FunctionComponent<DatasetSidebarProps> = (props) => {
  const {
    selections,
    workingDataset,
    setActiveTab,
    setSelectedListItem,
    fetchWorkingHistory,
    discardChanges,
    renameDataset
  } = props

  const { fsiPath, history, status, structure } = workingDataset
  const format = structure && structure.format
  const commitCount = history.value.length
  const lastCommit = history.value.length ? history.value[0].timestamp : ''

  const {
    activeTab,
    component: selectedComponent,
    commit: selectedCommit,
    peername,
    name
  } = selections

  const datasetSelected = peername !== '' && name !== ''

  const historyLoaded = !history.pageInfo.isFetching
  const statusLoaded = !!status

  const handleHistoryScroll = (e: any) => {
    if (!(history && history.pageInfo)) {
      fetchWorkingHistory()
      return
    }
    if (e.target.scrollHeight === parseInt(e.target.scrollTop) + parseInt(e.target.offsetHeight)) {
      fetchWorkingHistory(history.pageInfo.page + 1, history.pageInfo.pageSize)
    }
  }

  const handleExport = (path: string) => {
    const window = remote.getCurrentWindow()
    const selectedPath: string | undefined = remote.dialog.showSaveDialog(window, {})

    if (!selectedPath) {
      return
    }

    const pathUrl = path === '' ? '' : `/at/${path}`
    const exportUrl = `http://localhost:2503/export/${peername}/${name}${pathUrl}?download=true&all=true`
    ipcRenderer.send('export', { url: exportUrl, directory: selectedPath })
  }

  const historyToolTip = history.value.length !== 0 || !datasetSelected ? 'Explore older versions of this dataset' : 'This dataset has no previous versions'

  return (
    <div className='dataset-sidebar'>
      <div className='dataset-sidebar-header sidebar-padded-container'>
        <p className='pane-title'>Dataset</p>
        <DatasetReference peername={peername} name={name} renameDataset={renameDataset}/>
        <DatasetDetailsSubtext format={format} lastCommit={lastCommit} commitCount={commitCount} />
      </div>
      <div id='tabs' className='sidebar-padded-container'>
        <div
          id='status-tab'
          className={classNames('tab', { 'active': activeTab === 'status' && datasetSelected, 'disabled': !datasetSelected })}
          onClick={() => {
            if (datasetSelected) {
              setActiveTab('status')
            }
          }}
          data-tip='View the working changes<br/> to this dataset&apos;s components'
        >
          Status
        </div>
        <div
          id='history-tab'
          className={classNames('tab', { 'active': activeTab === 'history', 'disabled': (history.pageInfo.error && history.pageInfo.error.includes('no history')) || !datasetSelected })}
          onClick={() => {
            if ((!(history.pageInfo.error && history.pageInfo.error.includes('no history')) && datasetSelected)) {
              setActiveTab('history')
            }
          }}
          data-tip={historyToolTip}
        >
          History {/* <div className='badge'>TODO (chriswhong): use this badge to show "new commits"</div> */}
        </div>
      </div>
      <div id='content' className='transition-group'>
        <CSSTransition
          classNames='fade'
          in={(!statusLoaded && activeTab === 'status') || (!historyLoaded && activeTab === 'history')}
          component='div'
          timeout={300}
          mountOnEnter
          unmountOnExit
        >
          <div className='spinner'><Spinner white /></div>
        </CSSTransition>
        <CSSTransition
          in={statusLoaded && activeTab === 'status'}
          classNames='fade'
          component='div'
          timeout={300}
          mountOnEnter
          unmountOnExit
        >
          <div id='status-content' className='sidebar-content'>
            <ComponentList
              datasetSelected={datasetSelected}
              status={status}
              selectedComponent={selectedComponent}
              onComponentClick={setSelectedListItem}
              selectionType={'component' as ComponentType}
              fsiPath={fsiPath}
              discardChanges={discardChanges}
            />
          </div>
        </CSSTransition>
        <CSSTransition
          in={historyLoaded && activeTab === 'history'}
          classNames='fade'
          component='div'
          timeout={300}
          mountOnEnter
          unmountOnExit
        >
          <div
            id='history_list'
            className='sidebar-content'
            onScroll={(e) => handleHistoryScroll(e)}
            hidden = {activeTab === 'status'}
          >
            {
              history.value.map((props, i) => {
                const { path, timestamp, title } = props
                const timeMessage = moment(timestamp).fromNow()
                const menuItems: MenuItemConstructorOptions[] = [
                  {
                    label: 'Export this version',
                    click: () => {
                      handleExport(path)
                    }
                  }
                ]
                return (
                  <ContextMenuArea menuItems={menuItems} key={path}>
                    <HistoryListItem
                      key={path}
                      id={`HEAD~${i + 1}`}
                      first={i === 0}
                      last={i === history.value.length - 1}
                      path={path}
                      commitTitle={title}
                      timeMessage={timeMessage}
                      selected={selectedCommit === path}
                      onClick={setSelectedListItem}
                    />
                  </ContextMenuArea>
                )
              })
            }
          </div>
        </CSSTransition>
      </div>
    </div>
  )
}

export default DatasetSidebar
