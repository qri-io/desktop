import * as React from 'react'
import moment from 'moment'
import { Action } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'

import HistoryComponentList from '../components/HistoryComponentList'
import DatasetComponent from './DatasetComponent'
import SidebarLayout from './SidebarLayout'
import { Structure, Commit } from '../models/dataset'
import { CommitDetails as ICommitDetails, ComponentType, SelectedComponent, Selections } from '../models/Store'
import fileSize from '../utils/fileSize'
import { Details } from '../models/details'
import { ApiActionThunk } from '../store/api'

interface CommitDetailsHeaderProps {
  structure: Structure
  commit: Commit
}

const CommitDetailsHeader: React.FunctionComponent<CommitDetailsHeaderProps> = ({ structure, commit }) => {
  return (
    <div className='commit-details-header'>
      {structure && commit && <div className='details-flex'>
        <div className='text-column'>
          <div id='commit-title' className='text'>{commit.title}</div>
          <div className='subtext'>
            {/* <img className= 'user-image' src = {'https://avatars0.githubusercontent.com/u/1154390?s=60&v=4'} /> */}
            <div className='time-message'>
              <FontAwesomeIcon icon={faClock} size='sm'/>&nbsp;
              {moment(commit.timestamp).format('MMMM Do YYYY, h:mm:ss a')}
            </div>
          </div>
        </div>
        <div className='details-column'>
          {structure.length && <div className='detail' id='commit-details-header-file-size'>{fileSize(structure.length)}</div>}
          {structure.format && <div className='detail' id='commit-details-header-format'>{structure.format.toUpperCase()}</div>}
          {structure.entries && <div className='detail' id='commit-details-header-entries'>{structure.entries.toLocaleString()} {structure.entries !== 1 ? 'entries' : 'entry'}</div>}
          {structure.errCount && <div className='detail' id='commit-details-header-errors'>{structure.errCount.toLocaleString()} {structure.errCount !== 1 ? 'errors' : 'error'}</div>}
        </div>
      </div>}
    </div>
  )
}

export interface CommitDetailsProps {
  data: ICommitDetails
  selections: Selections
  details: Details

  fetchCommitBody: (page?: number, pageSize?: number) => ApiActionThunk
  setDetailsBar: (details: Record<string, any>) => Action
  setComponent: (type: ComponentType, activeComponent: string) => Action
}

const CommitDetails: React.FunctionComponent<CommitDetailsProps> = ({
  data,
  // display details
  details,
  selections,

  // setting actions
  setDetailsBar,
  setComponent,

  // fetching api actions
  fetchCommitBody
}) => {
  // we have to guard against an odd case when we look at history
  // it is possible that we can get the history of a dataset, but
  // not have every version of that dataset in our repo
  // this will cause a specific error.
  // when we get that error, we should prompt the user to add that
  // version of the dataset.
  // for now, we will tell the user to run a command on the command line
  const { peername, name, status, components, isLoading, path } = data
  const { structure, commit } = components

  const { commitComponent: selectedComponent } = selections

  const getComponents = () => {
    const components: SelectedComponent[] = []
    if (data && data.components) {
      Object.keys(data.components).forEach((component: SelectedComponent) => {
        if (component !== '' && data.components[component].value) components.push(component)
      })
    }
    return components
  }

  const loading = !path || path !== selections.commit || isLoading

  return (
    <div id='commit-details' className='dataset-content transition-group'>
      <CommitDetailsHeader structure={structure.value} commit={data.components && commit.value}/>
      <SidebarLayout
        id={'commit-details'}
        sidebarContent={(
          <HistoryComponentList
            datasetSelected={peername !== '' && name !== ''}
            status={status}
            components={getComponents()}
            selectedComponent={selectedComponent}
            selectionType={'commitComponent' as ComponentType}
            onComponentClick={setComponent}
          />
        )}
        sidebarWidth={150}
        mainContent={(
          <DatasetComponent
            data={data}
            details={details}
            setDetailsBar={setDetailsBar}
            fetchBody={fetchCommitBody}
            isLoading={loading}
            component={selectedComponent}
            componentStatus={status[selectedComponent]}
            history
          />
        )}
      />
    </div>
  )
}

export default CommitDetails
