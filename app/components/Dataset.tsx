import * as React from 'react'
import { Resizable } from '../components/resizable'
import DatasetSidebar from '../components/DatasetSidebar'
import DatasetList from '../components/DatasetList'

const defaultSidebarWidth = 250
const logo = require('../assets/qri-blob-logo-tiny.png') //eslint-disable-line

export default class Dataset extends React.Component<{}, { showDatasetList: boolean, sidebarWidth: number }> {
  constructor (p: {}) {
    super(p)
    this.state = {
      showDatasetList: false,
      sidebarWidth: defaultSidebarWidth
    }
  }

  handleSidebarResize (width: number) {
    this.setState({ sidebarWidth: width })
  }

  handleSidebarReset () {
    this.setState({ sidebarWidth: defaultSidebarWidth })
  }

  toggleDatasetList () {
    this.setState({ showDatasetList: !this.state.showDatasetList })
  }

  render () {
    const { showDatasetList, sidebarWidth } = this.state
    const expandedClass = showDatasetList ? 'expanded' : ''

    return (
      <div id='dataset-container'>
        <div className='header'>
          <div
            className={'current-dataset header-column ' + expandedClass}
            onClick={() => this.toggleDatasetList()}
            style={{ width: sidebarWidth }}
          >
            <img className='app-loading-blob' src={logo} />
            <div className='text'>
              <div className="label">Current Dataset</div>
              <div className="name">usgs_earthquakes</div>
            </div>
            {
              showDatasetList
                ? <div className="arrow collapse">&nbsp;</div>
                : <div className="arrow expand">&nbsp;</div>
            }

          </div>
        </div>
        <div className='columns'>
          <Resizable
            id='sidebar'
            width={this.state.sidebarWidth}
            onResize={(width) => this.handleSidebarResize(width)}
            onReset={() => this.handleSidebarReset()}
            maximumWidth={495}
          >
            <DatasetSidebar />
          </Resizable>
          <div className='content'>
            {showDatasetList && <div className='overlay'></div>}
            Content goes here
          </div>

        </div>
        {
          showDatasetList && (
            <div
              className='dataset-list'
              style={{ width: sidebarWidth }}
            >
              <DatasetList />
            </div>
          )
        }
      </div>
    )
  }
}
