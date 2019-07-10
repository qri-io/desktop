import * as React from 'react'

interface FileRowProps {
  name: string
}

const FileRow: React.SFC<FileRowProps> = (props) => {
  return (
    <div className='file-row sidebar-row'>
      <div className='label'>{props.name}</div>
    </div>
  )
}

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
      <div id='dataset-sidebar'>
        <div id='tabs' className='sidebar-row'>
          <div className={'tab ' + (activeTab === 'status' ? 'active' : '')} onClick={() => this.handleTabClick('status')}>Status</div>
          <div className={'tab ' + (activeTab === 'status' ? '' : 'active')} onClick={() => this.handleTabClick('history')}>History</div>
        </div>
        <div id='content'>
          <div id='status-content' className='sidebar-content' hidden = {activeTab !== 'status'}>
            <div className='sidebar-row'>
              <div className='changes'>
                Changes
              </div>
            </div>
            <FileRow name='Meta' />
            <FileRow name='Body' />
            <FileRow name='Schema' />
          </div>
          <div id='history-content' className='sidebar-content' hidden = {activeTab === 'status'}>
            <FileRow name='Last Commit' />
            <FileRow name='Some other Commit' />
            <FileRow name='First Commit' />
          </div>
        </div>
      </div>
    )
  }
}
