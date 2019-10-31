import * as React from 'react'
import moment from 'moment'
import { Action } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'

import ComponentList from '../components/ComponentList'
import DatasetComponent from './DatasetComponent'
import { CSSTransition } from 'react-transition-group'
import SpinnerWithIcon from './chrome/SpinnerWithIcon'
import { ApiAction } from '../store/api'
import { Structure, Commit } from '../models/dataset'
import { CommitDetails as ICommitDetails, ComponentType } from '../models/Store'
import fileSize from '../utils/fileSize'

interface CommitDetailsHeaderProps {
  structure: Structure
  commit: Commit
}

const CommitDetailsHeader: React.FunctionComponent<CommitDetailsHeaderProps> = ({ structure, commit }) => {
  return (
    <div className='commit-details-header'>
      {structure && commit && <div className='details-flex'>
        <div className='text-column'>
          <div className='text'>{commit.title}</div>
          <div className='subtext'>
            {/* <img className= 'user-image' src = {'https://avatars0.githubusercontent.com/u/1154390?s=60&v=4'} /> */}
            <div className='time-message'>
              <FontAwesomeIcon icon={faClock} size='sm'/>&nbsp;
              {moment(commit.timestamp).format('MMMM Do YYYY, h:mm:ss a')}
            </div>
          </div>
        </div>
        <div className='details-column'>
          {structure.length && <div className='detail'>{fileSize(structure.length)}</div>}
          {structure.format && <div className='detail'>{structure.format.toUpperCase()}</div>}
          {structure.entries && <div className='detail'>{structure.entries.toLocaleString()} {structure.entries !== 1 ? 'entries' : 'entry'}</div>}
          {structure.errCount && <div className='detail'>{structure.errCount.toLocaleString()} {structure.errCount !== 1 ? 'errors' : 'error'}</div>}
        </div>
      </div>}
    </div>
  )
}

export interface CommitDetailsProps {
  peername: string
  name: string
  selectedCommitPath: string
  commit: Commit
  selectedComponent: 'meta' | 'body' | 'structure' | ''
  sidebarWidth: number
  commitDetails: ICommitDetails
  structure: Structure
  setSelectedListItem: (type: string, activeTab: string) => Action
  setSidebarWidth: (type: string, sidebarWidth: number) => Action
  fetchCommitDetail: () => Promise<ApiAction>
}

const CommitDetails: React.FunctionComponent<CommitDetailsProps> = ({
  peername,
  name,
  selectedCommitPath,
  commit,
  selectedComponent,
  setSelectedListItem,
  fetchCommitDetail,
  commitDetails,
  structure
}) => {
  // we have to guard against an odd case when we look at history
  // it is possible that we can get the history of a dataset, but
  // not have every version of that dataset in our repo
  // this will cause a specific error.
  // when we get that error, we should prompt the user to add that
  // version of the dataset.
  // for now, we will tell the user to run a command on the command line
  const [isLogError, setLogError] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const isLoadingRef = React.useRef(commitDetails.isLoading)

  const isLoadingTimeout = setTimeout(() => {
    if (isLoadingRef.current) {
      setLoading(true)
    }
    clearTimeout(isLoadingTimeout)
  }, 250)

  React.useEffect(() => {
    if (selectedCommitPath !== '') {
      fetchCommitDetail()
        .then(() => {
          if (isLogError) setLogError(false)
        })
        .catch(action => {
          const message: string = action.payload.err.message
          setLogError(message.includes('does not match datasetRef on file'))
        })
    }
  }, [selectedCommitPath])

  React.useEffect(() => {
    if (isLoadingRef.current !== commitDetails.isLoading) {
      isLoadingRef.current = commitDetails.isLoading
    }
    if (loading && isLoadingRef.current === false) {
      setLoading(false)
    }
  }, [commitDetails.isLoading])

  const { status } = commitDetails

  return (
    <div id='commit-details' className='dataset-content transition-group'>
      <CSSTransition
        in={!isLogError && !loading}
        classNames='fade'
        timeout={300}
        unmountOnExit
      >
        <div id='transition-wrap'>
          {<CommitDetailsHeader structure={structure} commit={commit}/>}
          <div className='columns'>
            <div
              className='commit-details-sidebar sidebar'
            >
              <ComponentList
                datasetSelected={peername !== '' && name !== ''}
                status={status}
                selectedComponent={selectedComponent}
                selectionType={'commitComponent' as ComponentType}
                onComponentClick={setSelectedListItem}
                fsiPath={'isLinked'}
              />
            </div>
            <div className='content-wrapper'>
              <DatasetComponent isLoading={loading} component={selectedComponent} componentStatus={status[selectedComponent]} history />
            </div>
          </div>
        </div>
      </CSSTransition>
      <SpinnerWithIcon loading={loading} />
      <SpinnerWithIcon loading={isLogError && !loading} title='Oh no!' spinner={false}>
        <p>Oops, you don&apos;t have this version of the dataset.</p>
        <p>Try adding it by using the terminal and the Qri command line tool that can be used when this desktop app is running!</p>
        <p>Open up the terminal and paste this command:</p>
        <div className='terminal'>{`qri add ${peername}/${name}/at${selectedCommitPath}`}</div>
      </SpinnerWithIcon>
    </div>
  )
}

export default CommitDetails
