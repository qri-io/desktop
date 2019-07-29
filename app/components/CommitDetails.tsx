import * as React from 'react'
import moment from 'moment'
import { Resizable } from '../components/resizable'
import { Action } from 'redux'
import ComponentList from '../components/ComponentList'
import MetadataContainer from '../containers/MetadataContainer'
import BodyContainer from '../containers/BodyContainer'
import SchemaContainer from '../containers/SchemaContainer'

import { ApiAction } from '../store/api'
import { Commit } from '../models/dataset'
import { CommitDetails as ICommitDetails, ComponentType, DatasetStatus } from '../models/Store'

import { defaultSidebarWidth } from '../reducers/ui'

interface CommitDetailsProps {
  commit: Commit
  selectedComponent: string
  sidebarWidth: number
  setSelectedListItem: (type: string, activeTab: string) => Action
  setSidebarWidth: (type: string, sidebarWidth: number) => Action
  fetchCommitDetail: () => Promise<ApiAction>
  commitDetails: ICommitDetails
}

const isEmpty = (status: DatasetStatus) => {
  const { body, meta, schema } = status
  if (body) return false
  if (meta) return false
  if (schema) return false
  return true
}

export default class CommitDetails extends React.Component<CommitDetailsProps> {
  state = { commit: '' }

  static getDerivedStateFromProps (nextProps: CommitDetailsProps, prevState: CommitDetailsProps) {
    const { commit: newCommit } = nextProps
    const { commit } = prevState

    // when new props arrive, compare commit to previous.  If different, fetch data
    if (newCommit !== commit) {
      nextProps.fetchCommitDetail()

      return { commit: newCommit }
    }

    return null
  }

  render () {
    const { selectedComponent } = this.props

    let mainContent

    switch (selectedComponent) {
      case 'meta':
        mainContent = <MetadataContainer history />
        break
      case 'body':
        mainContent = <BodyContainer />
        break
      case 'schema':
        mainContent = <SchemaContainer history />
        break
    }

    if (this.props.commit && !isEmpty(this.props.commitDetails.status)) {
      const { commit, sidebarWidth, setSidebarWidth, setSelectedListItem, commitDetails } = this.props
      const { status } = commitDetails
      const { title, timestamp } = commit
      const timeMessage = moment(timestamp).fromNow()
      return (
        <div id='commit-details' className='dataset-content'>
          <div className='commit-details-header text-column'>
            <div className='text'>{title}</div>
            <div className='subtext'>
              <img className= 'user-image' src = {'https://avatars0.githubusercontent.com/u/1154390?s=60&v=4'} />
              <div className='time-message'>
                {timeMessage}
              </div>
            </div>
          </div>
          <div className='columns'>
            <Resizable
              id='sidebar'
              width={sidebarWidth}
              onResize={(width) => { setSidebarWidth('commit', width) }}
              onReset={() => { setSidebarWidth('commit', defaultSidebarWidth) }}
              maximumWidth={348}
            >
              <ComponentList
                status={status}
                selectedComponent={selectedComponent}
                selectionType={'commitComponent' as ComponentType}
                onComponentClick={setSelectedListItem}
              />
            </Resizable>
            <div className='content-wrapper'>
              {mainContent}
            </div>
          </div>
        </div>
      )
    } else {
      return <div id='commit-details' className='dataset-content'>Loading</div>
    }
  }
}
