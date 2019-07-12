import * as React from 'react'
import { Resizable } from '../components/resizable'
import DatasetSidebar from '../containers/DatasetSidebar'
import DatasetList from '../components/DatasetList'

const logo = require('../assets/qri-blob-logo-tiny.png') //eslint-disable-line

interface DatasetProps {
  showDatasetList: boolean
  sidebarWidth: number
  toggleDatasetList: () => void
  handleResize: (sidebarWidth: number) => void
  handleReset: () => void
}

export default class Dataset extends React.Component<DatasetProps> {
  render () {
    const {
      showDatasetList,
      sidebarWidth,
      toggleDatasetList,
      handleResize,
      handleReset
    } = this.props
    const expandedClass = showDatasetList ? 'expanded' : ''

    return (
      <div id='dataset-container'>
        <div className='header'>
          <div
            className={'current-dataset header-column ' + expandedClass}
            onClick={toggleDatasetList}
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
            width={sidebarWidth}
            onResize={handleResize}
            onReset={handleReset}
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
