import * as React from 'react'
import { Action } from 'redux'
import * as moment from 'moment'

import { WorkingDataset } from '../models/store'

interface FileRowProps {
  name: string
  filename: string
  selected: boolean
  onClick: (type: string, selectedListItem: string) => Action
}

const FileRow: React.FunctionComponent<FileRowProps> = (props) => {
  return (
    <div
      className={`sidebar-list-item sidebar-list-item-text ${props.selected && 'selected'}`}
      onClick={() => { props.onClick('component', props.name) }}
    >
      <div className='text'>{props.name}</div>
      <div className='subtext'>{props.filename}</div>
    </div>
  )
}

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
      <div className='text'>{props.commitTitle}</div>
      <div className='subtext'>
        <img className= 'user-image' src = {props.avatarUrl} />
        <div className='time-message'>
          {props.timeMessage}
        </div>
      </div>
    </div>
  )
}

type componentType = 'component' | 'commit'

interface DatasetSidebarProps {
  activeTab: string
  selectedComponent: string
  selectedCommit: string
  history: WorkingDataset['history']
  status: WorkingDataset['status']
  onTabClick: (activeTab: string) => Action
  onListItemClick: (type: componentType, activeTab: string) => Action
}

const DatasetSidebar: React.FunctionComponent<DatasetSidebarProps> = (props: DatasetSidebarProps) => {
  const {
    activeTab,
    selectedComponent,
    selectedCommit,
    history,
    status,
    onTabClick,
    onListItemClick
  } = props
  const { value: historyItems } = history

  return (
    <div className='dataset-sidebar'>
      <div id='tabs' className='sidebar-list-item'>
        <div className={`tab ${activeTab === 'status' && 'active'}`} onClick={() => { onTabClick('status') }}>Status</div>
        <div className={`tab ${activeTab !== 'status' && 'active'}`} onClick={() => { onTabClick('history') }}>History</div>
      </div>
      <div id='content'>
        <div id='status-content' className='sidebar-content' hidden = {activeTab !== 'status'}>
          <div className='sidebar-list-item'>
            <div className='changes'>
                Changes
            </div>
          </div>
          {
            Object.keys(status).map((key) => {
              const { filepath } = status[key]
              return (
                <FileRow
                  key={key}
                  name={key}
                  filename={filepath}
                  selected={selectedComponent === key}
                  onClick={onListItemClick}
                />
              )
            })
          }
        </div>
        <div id='history-content' className='sidebar-content' hidden = {activeTab === 'status'}>
          {
            historyItems.map(({ path, timestamp, title }) => {
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
      </div>
    </div>
  )
}

export default DatasetSidebar
