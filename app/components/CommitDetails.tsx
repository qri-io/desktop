import * as React from 'react'
import moment from 'moment'
import { Resizable } from '../components/resizable'
import { Action } from 'redux'
import { FileRow } from '../components/DatasetSidebar'

import { ApiAction } from '../store/api'
import { Commit } from '../models/dataset'

import { defaultSidebarWidth } from '../reducers/ui'

interface CommitDetailsProps {
  commit: Commit
  selectedComponent: string
  sidebarWidth: number
  setSelectedListItem: (type: string, activeTab: string) => Action
  setSidebarWidth: (type: string, sidebarWidth: number) => Action
  fetchCommitDetail: () => Promise<ApiAction>
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
    const files = [
      {
        name: 'body',
        filepath: 'a/body.csv',
        status: 'modified'
      },
      {
        name: 'meta',
        filepath: 'a/meta.json',
        status: 'modified'
      },
      {
        name: 'schema',
        filepath: 'a/schema.json',
        status: 'modified'
      }
    ]

    if (this.props.commit) {
      const { commit, sidebarWidth, setSidebarWidth, setSelectedListItem } = this.props
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
              {
                files.map((file) => {
                  const { name, filepath, status: fileStatus } = file
                  const filename = filepath.substring((filepath.lastIndexOf('/') + 1))
                  return (
                    <FileRow
                      key={name}
                      name={name}
                      displayName={name}
                      filename={filename}
                      status={fileStatus}
                      selected={selectedComponent === name}
                      selectionType={'commitComponent'}
                      onClick={setSelectedListItem}
                    />
                  )
                })
              }
            </Resizable>
            <div className='content-wrapper'>
              Component commit details for {selectedComponent}.
            </div>
          </div>
        </div>
      )
    } else {
      return <div id='commit-details' className='dataset-content'>Loading</div>
    }
  }
}
