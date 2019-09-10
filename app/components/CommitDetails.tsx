import * as React from 'react'
import moment from 'moment'
import { Action } from 'redux'
import ComponentList from '../components/ComponentList'
import DatasetComponent from './DatasetComponent'
import { CSSTransition } from 'react-transition-group'
import SpinnerWithIcon from './chrome/SpinnerWithIcon'
import { ApiAction } from '../store/api'
import { Commit } from '../models/dataset'
import { CommitDetails as ICommitDetails, ComponentType } from '../models/Store'

export interface CommitDetailsProps {
  peername: string
  name: string
  selectedCommitPath: string
  commit: Commit
  selectedComponent: 'meta' | 'body' | 'schema' | ''
  sidebarWidth: number
  setSelectedListItem: (type: string, activeTab: string) => Action
  setSidebarWidth: (type: string, sidebarWidth: number) => Action
  fetchCommitDetail: () => Promise<ApiAction>
  commitDetails: ICommitDetails
}

// const isEmpty = (status: DatasetStatus) => {
//   const { body, meta, schema } = status
//   if (body) return false
//   if (meta) return false
//   if (schema) return false
//   return true
// }

const CommitDetails: React.FunctionComponent<CommitDetailsProps> = ({
  peername,
  name,
  selectedCommitPath,
  commit,
  selectedComponent,
  setSelectedListItem,
  fetchCommitDetail,
  commitDetails
}) => {
  // we have to guard against an odd case when we look at history
  // it is possible that we can get the history of a dataset, but
  // not have every version of that dataset in our repo
  // this will cause a specific error.
  // when we get that error, we should prompt the user to add that
  // version of the dataset.
  // for now, we will tell the user to run a command on the command line
  const [isLogError, setLogError] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
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
    // make sure that the component we are trying to show actually exists in this version of the dataset
    // TODO (ramfox): there is a bug here when we try to switch to body, but body hasn't finished fetching yet
    // this will prematurely decide to switch away from body.
    if (!commitDetails.isLoading) {
      const { components } = commitDetails
      if (selectedComponent === '' || (!components[selectedComponent].value || components[selectedComponent].value.length === 0)) {
        if (status['meta']) {
          setSelectedListItem('commitComponent', 'meta')
          return
        }
        if (status['body']) {
          setSelectedListItem('commitComponent', 'body')
          return
        }
        setSelectedListItem('commitComponent', 'schema')
      }
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
          <div className='commit-details-header text-column'>
            <div className='text'>{commit && commit.title}</div>
            <div className='subtext'>
              {/* <img className= 'user-image' src = {'https://avatars0.githubusercontent.com/u/1154390?s=60&v=4'} /> */}
              <div className='time-message'>
                {commit && moment(commit.timestamp).fromNow()}
              </div>
            </div>
          </div>
          <div className='columns'>
            <div
              className='commit-details-sidebar sidebar'
            >
              <ComponentList
                status={status}
                selectedComponent={selectedComponent}
                selectionType={'commitComponent' as ComponentType}
                onComponentClick={setSelectedListItem}
                isLinked
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
