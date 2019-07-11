import * as React from 'react'

interface FileRowProps {
  name: string
  filename: string
}

const FileRow: React.FunctionComponent<FileRowProps> = (props) => {
  return (
    <div className='sidebar-list-item sidebar-list-item-text '>
      <div className='text'>{props.name}</div>
      <div className='subtext'>{props.filename}</div>
    </div>
  )
}

interface HistoryListItemProps {
  commitTitle: string
  avatarUrl: string
  userTimeMessage: string
}

const HistoryListItem: React.FunctionComponent<HistoryListItemProps> = (props) => {
  return (
    <div className='sidebar-list-item sidebar-list-item-text'>
      <div className='text'>{props.commitTitle}</div>
      <div className='subtext'>
        <img className= 'user-image' src = {props.avatarUrl} />
        <div className='time-message'>
          {props.userTimeMessage}
        </div>
      </div>
    </div>
  )
}

let dummyCommits = [
  {
    id: 1,
    commitTitle: 'cleaned up schema',
    avatarUrl: 'https://avatars0.githubusercontent.com/u/1154390?s=60&v=4',
    userTimeMessage: 'Brendan Obrien committed just now'
  },
  {
    id: 2,
    commitTitle: 'added about column, converted all strings to lowercase, modified metadata',
    avatarUrl: 'https://avatars0.githubusercontent.com/u/1833820?s=40&v=4',
    userTimeMessage: 'Chris Whong committed 16 hours ago'
  },
  {
    id: 3,
    commitTitle: 'First Commit',
    avatarUrl: 'https://avatars0.githubusercontent.com/u/1833820?s=40&v=4',
    userTimeMessage: 'Chris Whong committed 3 days ago'
  }
]

export default class DatasetSidebar extends React.Component<{}, { activeTab: string }> {
  constructor (p: {}) {
    super(p)
    this.state = {
      activeTab: 'status'
    }
  }

  handleTabClick (activeTab: string) {
    this.setState({ activeTab })
  }

  render () {
    const { activeTab } = this.state
    return (
      <div className='dataset-sidebar'>
        <div id='tabs' className='sidebar-list-item'>
          <div className={'tab ' + (activeTab === 'status' ? 'active' : '')} onClick={() => this.handleTabClick('status')}>Status</div>
          <div className={'tab ' + (activeTab === 'status' ? '' : 'active')} onClick={() => this.handleTabClick('history')}>History</div>
        </div>
        <div id='content'>
          <div id='status-content' className='sidebar-content' hidden = {activeTab !== 'status'}>
            <div className='sidebar-list-item'>
              <div className='changes'>
                Changes
              </div>
            </div>
            <FileRow name='Meta' filename='meta.json' />
            <FileRow name='Body' filename='body.csv' />
            <FileRow name='Schema' filename='schema.json' />
          </div>
          <div id='history-content' className='sidebar-content' hidden = {activeTab === 'status'}>
            {
              dummyCommits.map(({ id, commitTitle, avatarUrl, userTimeMessage }) => (
                <HistoryListItem
                  key={id}
                  commitTitle={commitTitle}
                  avatarUrl={avatarUrl}
                  userTimeMessage={userTimeMessage}
                />
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}
