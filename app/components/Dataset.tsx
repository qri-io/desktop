import * as React from 'react'
import classNames from 'classnames'
import { Action } from 'redux'
import { ApiAction } from '../store/api'
import { Resizable } from '../components/resizable'
import DatasetSidebar from '../components/DatasetSidebar'
import DatasetListContainer from '../containers/DatasetListContainer'
import CommitDetailsContainer from '../containers/CommitDetailsContainer'
import MetadataContainer from '../containers/MetadataContainer'
import BodyContainer from '../containers/BodyContainer'
import SchemaContainer from '../containers/SchemaContainer'

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
  setSidebarWidth: (type: string, sidebarWidth: number) => Action
  setFilter: (filter: string) => Action
  setSelectedListItem: (type: string, activeTab: string) => Action
  setWorkingDataset: (peername: string, name: string) => Action
  fetchMyDatasets: () => Promise<ApiAction>
  fetchWorkingDatasetDetails: () => Promise<ApiAction>
  fetchWorkingStatus: () => Promise<ApiAction>
}

interface DatasetState {
  peername: string
  name: string
}

const logo = require('../assets/qri-blob-logo-tiny.png') //eslint-disable-line

export default class Dataset extends React.Component<DatasetProps> {
  // component state is used to compare changes when a new dataset is selected
  // see getDerivedStateFromProps() below
  state = {
    peername: null,
    name: null
  }

  componentDidMount () {
    // fetch datasets list TODO move this up to App
    this.props.fetchMyDatasets()
    // poll for status
    setInterval(() => { this.props.fetchWorkingStatus() }, 1000)
  }

  // using component state + getDerivedStateFromProps to determine when a new
  // working dataset is selected and trigger api call(s)
  static getDerivedStateFromProps (nextProps: DatasetProps, prevState: DatasetState) {
    const { peername: newPeername, name: newName } = nextProps.selections
    const { peername, name } = prevState

    // when new props arrive, compare selections.peername and selections.name to
    // previous.  If either is different, fetch data
    if ((newPeername !== peername) || (newName !== name)) {
      nextProps.fetchWorkingDatasetDetails()
      // close the dataset list if this is not the initial state comparison
      if (peername !== null) nextProps.toggleDatasetList()
      return {
        peername: newPeername,
        name: newName
      }
    }
    return null
  }

  render () {
    // unpack all the things
    const { ui, selections, workingDataset } = this.props
    const { showDatasetList, datasetSidebarWidth } = ui
    const {
      activeTab,
      component: selectedComponent,
      commit: selectedCommit
    } = selections
    const { name, history, status } = workingDataset

    // actions
    const {
      toggleDatasetList,
      setActiveTab,
      setSidebarWidth,
      setSelectedListItem
    } = this.props

    // mainContent will either be a loading spinner, or content based on the selected
    // sidebar list items
    let mainContent
    if (workingDataset.loading || workingDataset.peername === '') {
      // TODO (chriswhong) add a proper loading spinner
      mainContent = <div>Loading</div>
    } else {
      if (activeTab === 'status') {
        switch (selectedComponent) {
          case 'meta':
            mainContent = <MetadataContainer />
            break
          case 'body':
            mainContent = <BodyContainer />
            break
          case 'schema':
            mainContent = <SchemaContainer />
            break
          default:
            mainContent = <MetadataContainer />
        }
      } else {
        if (workingDataset.history) {
          mainContent = <CommitDetailsContainer />
        } else {
          mainContent = <div>Loading History</div>
        }
      }
    }

    return (
      <div id='dataset-container'>
        <div className='header'>
          <div
            className={classNames('current-dataset', 'header-column', { 'expanded': showDatasetList })}
            onClick={toggleDatasetList}
            style={{ width: datasetSidebarWidth }}
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
            width={datasetSidebarWidth}
            onResize={(width) => { setSidebarWidth('dataset', width) }}
            onReset={() => { setSidebarWidth('dataset', defaultSidebarWidth) }}
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
              style={{ width: datasetSidebarWidth }}
            >
              <DatasetListContainer />
            </div>
          )
        }
      </div>
    )
  }
}
