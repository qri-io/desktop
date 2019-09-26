import * as React from 'react'
import { Action } from 'redux'
import moment from 'moment'
import { CSSTransition } from 'react-transition-group'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'

import { ApiActionThunk } from '../store/api'
import SaveFormContainer from '../containers/SaveFormContainer'
import ComponentList from './ComponentList'

import classNames from 'classnames'
import Spinner from './chrome/Spinner'

import { WorkingDataset, ComponentType, Selections } from '../models/store'

interface HistoryListItemProps {
  path: string
  commitTitle: string
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
          {/* Bring back avatar later <img className= 'user-image' src = {props.avatarUrl} /> */}
          <div className='time-message'>
            <FontAwesomeIcon icon={faClock} size='sm'/> {props.timeMessage}
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
}

const DatasetSidebar: React.FunctionComponent<DatasetSidebarProps> = (props) => {
  const {
    selections,
    workingDataset,
    hideCommitNudge,
    setActiveTab,
    setSelectedListItem,
    fetchWorkingHistory,
    discardChanges,
    setHideCommitNudge
  } = props

  const { path, fsiPath, history, status, components } = workingDataset

  const {
    activeTab,
    component: selectedComponent,
    commit: selectedCommit,
    peername,
    name
  } = selections

  const { body } = components

  const datasetSelected = peername !== '' && name !== ''

  const historyLoaded = !history.pageInfo.isFetching
  const statusLoaded = !!status
  const bodyLoaded = !body.pageInfo.isFetching
  const noHistory = history.value.length === 0

  const handleHistoryScroll = (e: any) => {
    if (!(history && history.pageInfo)) {
      fetchWorkingHistory()
      return
    }
    if (e.target.scrollHeight === parseInt(e.target.scrollTop) + parseInt(e.target.offsetHeight)) {
      fetchWorkingHistory(history.pageInfo.page + 1, history.pageInfo.pageSize)
    }
  }

  const historyToolTip = path || !datasetSelected ? 'Explore older versions of this dataset' : 'This dataset has no previous versions'

  return (
    <div className='dataset-sidebar'>
      <div id='tabs' className='sidebar-list-item'>
        <div
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
          className={classNames('tab', { 'active': activeTab === 'history', 'disabled': (history.pageInfo.error && history.pageInfo.error.includes('no history')) || !datasetSelected })}
          onClick={() => {
            if ((!(history.pageInfo.error && history.pageInfo.error.includes('no history')) && datasetSelected)) {
              setActiveTab('history')
            }
          }}
          data-tip={historyToolTip}
        >
          History
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
          <div className='spinner'><Spinner /></div>
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
            id='history-content'
            className='sidebar-content'
            onScroll={(e) => handleHistoryScroll(e)}
            hidden = {activeTab === 'status'}
          >
            {
              history.value.map((props) => {
                const { path, timestamp, title } = props
                const timeMessage = moment(timestamp).fromNow()
                return (
                  <HistoryListItem
                    key={path}
                    path={path}
                    commitTitle={title}
                    timeMessage={timeMessage}
                    selected={selectedCommit === path}
                    onClick={setSelectedListItem}
                  />
                )
              })
            }
          </div>
        </CSSTransition>
        { console.log(!hideCommitNudge, bodyLoaded, statusLoaded, historyLoaded, noHistory, datasetSelected) }
        {
          !hideCommitNudge && bodyLoaded && statusLoaded && historyLoaded && noHistory && datasetSelected && (
            <div className='commit-nudge'>
              <div className='commit-nudge-text'>
                You&apos;re ready to make your first commit on this dataset! Verify that the body is accurate and add some metadata. When everything looks good, enter a commit message below, then click Submit.
              </div>
              <a
                className="close dark"
                onClick={setHideCommitNudge}
                aria-label="close"
                role="button" >
                <FontAwesomeIcon icon={faTimes} size='lg'/>
              </a>
            </div>
          )
        }
      </div>
      {
        fsiPath && activeTab === 'status' && <SaveFormContainer />
      }
    </div>
  )
}

export default DatasetSidebar
