import * as React from 'react'
import { Action } from 'redux'
import { ApiAction } from '../store/api'
import { Resizable } from '../components/resizable'
import DatasetSidebar from '../components/DatasetSidebar'
import DatasetListContainer from '../containers/DatasetListContainer'
import CommitDetailsContainer from '../containers/CommitDetailsContainer'
import MetadataContainer from '../containers/MetadataContainer'

import { defaultSidebarWidth } from '../reducers/ui'

import {
  UI,
  Selections,
  MyDatasets,
  WorkingDataset
} from '../models/store'

interface DatasetProps {
  // redux state
  ui: UI
  selections: Selections
  myDatasets: MyDatasets
  workingDataset: WorkingDataset
  // actions
  toggleDatasetList: () => Action
  setActiveTab: (activeTab: string) => Action
  setSidebarWidth: (sidebarWidth: number) => Action
  setFilter: (filter: string) => Action
  setSelectedListItem: (type: string, activeTab: string) => Action
  setWorkingDataset: (peername: string, name: string) => Action
  fetchMyDatasetsAndWorkbench: () => Promise<ApiAction>
  fetchWorkingDataset: () => Promise<ApiAction>
  fetchWorkingStatus: () => Promise<ApiAction>
}

// using component state + getDerivedStateFromProps to determine when a new
// working dataset is selected and trigger api call(s)
interface DatasetState {
  peername: string
  name: string
}

const logo = require('../assets/qri-blob-logo-tiny.png') //eslint-disable-line

export default class Dataset extends React.Component<DatasetProps> {
  state = {
    peername: null,
    name: null
  };

  componentDidMount () {
    // fetch datasets list, working dataset, and working dataset history
    this.props.fetchMyDatasetsAndWorkbench()
    setInterval(() => { this.props.fetchWorkingStatus() }, 1000)
  }

  static getDerivedStateFromProps (nextProps: DatasetProps, prevState: DatasetState) {
    const { peername: newPeername, name: newName } = nextProps.selections
    const { peername, name } = prevState

    // when new props arrive, compare selections.peername and selections.name to
    // previous.  If different, fetch data
    if ((newPeername !== peername) && (newName !== name)) {
      nextProps.fetchWorkingDataset()
      // if this isn't the first time, close the dataset list
      if (peername !== null) nextProps.toggleDatasetList()
      return {
        peername: newPeername,
        name: newName
      }
    }

    return null
  }

  render () {
    // app state props
    const { ui, selections, workingDataset } = this.props
    const { showDatasetList, sidebarWidth } = ui
    const {
      activeTab,
      component: selectedComponent,
      commit: selectedCommit
    } = selections
    const { name, history, status } = workingDataset

    // action props
    const {
      toggleDatasetList,
      setActiveTab,
      setSidebarWidth,
      setSelectedListItem
    } = this.props

    const expandedClass = showDatasetList ? 'expanded' : ''

    let mainContent

    if (activeTab === 'status') {
      if (selectedComponent === 'meta') {
        mainContent = (
          <MetadataContainer />
        )
      } else {
        mainContent = (
          <div>Content for the {selectedComponent} component</div>
        )
      }
    } else {
      mainContent = (
        <CommitDetailsContainer />
      )
    }

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
              <div className="name">{name}</div>
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
            onResize={(width) => { setSidebarWidth(width) }}
            onReset={() => { setSidebarWidth(defaultSidebarWidth) }}
            maximumWidth={495}
          >
            <DatasetSidebar
              activeTab={activeTab}
              selectedComponent={selectedComponent}
              selectedCommit={selectedCommit}
              history={history}
              status={status}
              onTabClick={setActiveTab}
              onListItemClick={setSelectedListItem}
            />
          </Resizable>
          <div className='content-wrapper'>
            {showDatasetList && <div className='overlay'></div>}
            {mainContent}
          </div>

        </div>
        {
          showDatasetList && (
            <div
              className='dataset-list'
              style={{ width: sidebarWidth }}
            >
              <DatasetListContainer />
            </div>
          )
        }
      </div>
    )
  }
}
