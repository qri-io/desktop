import * as React from 'react'
import { Action } from 'redux'
import { ApiActionThunk } from '../store/api'
import moment from 'moment'
import SaveFormContainer from '../containers/SaveFormContainer'
import ComponentList from './ComponentList'

import { WorkingDataset, ComponentType } from '../models/store'

interface HistoryListItemProps {
  path: string
  commitTitle: string
  avatarUrl: string
  timeMessage: string
  selected: boolean
  onClick: (type: string, selectedListItem: string) => Action
}

const HistoryListItem: React.FunctionComponent<HistoryListItemProps> = (props) => {
  return (
    <div
      className={`sidebar-list-item sidebar-list-item-text ${props.selected && 'selected'}`}
      onClick={() => { props.onClick('commit', props.path) }}
    >
      <div className='text-column'>
        <div className='text'>{props.commitTitle}</div>
        <div className='subtext'>
          <img className= 'user-image' src = {props.avatarUrl} />
          <div className='time-message'>
            {props.timeMessage}
          </div>
        </div>
      </div>
    </div>
  )
}

interface DatasetSidebarProps {
  activeTab: string
  selectedComponent: string
  selectedCommit: string
  history: WorkingDataset['history']
  status: WorkingDataset['status']
  isLinked: boolean
  onTabClick: (activeTab: string) => Action
  onListItemClick: (type: ComponentType, activeTab: string) => Action
  fetchWorkingHistory: (page: number, pageSize: number) => ApiActionThunk
}

const DatasetSidebar: React.FunctionComponent<DatasetSidebarProps> = ({
  activeTab,
  selectedComponent,
  selectedCommit,
  history,
  status,
  onTabClick,
  onListItemClick,
  fetchWorkingHistory,
  isLinked
}) => {
  const historyLoaded = !!history
  const statusLoaded = !!status

  const handleHistoryScroll = (e: any) => {
    if (!(history && history.pageInfo)) {
      fetchWorkingHistory(1, 15)
      return
    }
    if (e.target.scrollHeight === parseInt(e.target.scrollTop) + parseInt(e.target.offsetHeight)) {
      fetchWorkingHistory(history.pageInfo.page + 1, history.pageInfo.pageSize)
    }
  }

  return (
    <div className='dataset-sidebar'>
      <div id='tabs' className='sidebar-list-item'>
        <div className={`tab ${activeTab === 'status' && 'active'}`} onClick={() => { onTabClick('status') }}>Status</div>
        <div className={`tab ${activeTab !== 'status' && 'active'}`} onClick={() => { onTabClick('history') }}>History</div>
      </div>
      <div id='content'>
        <div id='status-content' className='sidebar-content' hidden = {activeTab !== 'status'}>
          { statusLoaded &&
            <ComponentList
              status={status}
              selectedComponent={selectedComponent}
              onComponentClick={onListItemClick}
              selectionType={'component' as ComponentType}
              isLinked={isLinked}
            />}
        </div>
        {
          historyLoaded && (
            <div id='history-content' className='sidebar-content' onScroll={(e) => handleHistoryScroll(e)} hidden = {activeTab === 'status'}>
              {
                history.value.map(({ path, timestamp, title }) => {
                  const timeMessage = moment(timestamp).fromNow()
                  return (
                    <HistoryListItem
                      key={path}
                      path={path}
                      commitTitle={title}
                      avatarUrl={'https://avatars0.githubusercontent.com/u/1154390?s=60&v=4'}
                      timeMessage={timeMessage}
                      selected={selectedCommit === path}
                      onClick={onListItemClick}
                    />
                  )
                })
              }
            </div>
          )
        }
      </div>
      {
        isLinked && activeTab === 'status' && <SaveFormContainer />
      }

    </div>
  )
}

export default DatasetSidebar
