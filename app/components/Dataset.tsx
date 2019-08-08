import * as React from 'react'
import classNames from 'classnames'
import { Action } from 'redux'
import { shell } from 'electron'
import ReactTooltip from 'react-tooltip'

import { ApiAction, ApiActionThunk } from '../store/api'
import { Resizable } from './Resizable'
import DatasetSidebar from './DatasetSidebar'
import DatasetComponent from './DatasetComponent'
import DatasetListContainer from '../containers/DatasetListContainer'
import CommitDetailsContainer from '../containers/CommitDetailsContainer'

import { defaultSidebarWidth } from '../reducers/ui'

import {
  UI,
  Selections,
  MyDatasets,
  WorkingDataset,
  Mutations
} from '../models/store'
import { CSSTransition } from 'react-transition-group'
import SpinnerWithIcon from './chrome/SpinnerWithIcon'

export interface DatasetProps {
  // redux state
  ui: UI
  selections: Selections
  myDatasets: MyDatasets
  workingDataset: WorkingDataset
  mutations: Mutations
  // actions
  toggleDatasetList: () => Action
  setActiveTab: (activeTab: string) => Action
  setSidebarWidth: (type: string, sidebarWidth: number) => Action
  setFilter: (filter: string) => Action
  setSelectedListItem: (type: string, activeTab: string) => Action
  setWorkingDataset: (peername: string, name: string) => Action
  fetchWorkingDatasetDetails: () => Promise<ApiAction>
  fetchWorkingHistory: (page?: number, pageSize?: number) => ApiActionThunk
  fetchWorkingStatus: () => Promise<ApiAction>
}

interface DatasetState {
  peername: string
  name: string
  saveIsLoading: boolean
}

const logo = require('../assets/qri-blob-logo-tiny.png') //eslint-disable-line

export default class Dataset extends React.Component<DatasetProps> {
  // component state is used to compare changes when a new dataset is selected
  // see getDerivedStateFromProps() below
  state = {
    peername: null,
    name: null,
    saveIsLoading: false
  }

  componentDidMount () {
    // poll for status
    setInterval(() => { this.props.fetchWorkingStatus() }, 1000)
  }

  componentDidUpdate () {
    // this "wires up" all of the tooltips, must be called on update, as tooltips
    // in descendents can come and go
    ReactTooltip.rebuild()
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

    // check state to see if there was a successful save
    // successful save means mutations.save.isLoading was true and is now false,
    // and mutations.save.error is falsy
    const { isLoading: newSaveIsLoading, error: newSaveError } = nextProps.mutations.save
    const { saveIsLoading } = prevState

    if (
      (saveIsLoading === true && newSaveIsLoading === false) &&
      (!newSaveError)
    ) {
      nextProps.fetchWorkingDatasetDetails()
    }

    return {
      saveIsLoading: newSaveIsLoading
    }
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
    const { name, history, status, path } = workingDataset

    // actions
    const {
      toggleDatasetList,
      setActiveTab,
      setSidebarWidth,
      setSelectedListItem,
      fetchWorkingHistory
    } = this.props

    // mainContent will either be a loading spinner, or content based on the selected
    // sidebar list items
    let mainContent
    if ((activeTab === 'status' && workingDataset.isLoading) || workingDataset.peername === '' || (activeTab === 'history' && workingDataset.history.pageInfo.isFetching)) {
      mainContent = <SpinnerWithIcon loading={true}/>
    } else {
      if (activeTab === 'status') {
        const componentStatus = status[selectedComponent]
        mainContent = <DatasetComponent component={selectedComponent} componentStatus={componentStatus}/>
      } else {
        if (workingDataset.history) {
          mainContent = <CommitDetailsContainer />
        }
      }
    }

    // TODO (ramfox): since this loading boolean is controlling the entire
    // main-content section, it might make more sense for each container
    // (eg metadata container, commit details container) to control its own
    // loading
    const loading = workingDataset.isLoading || workingDataset.peername === ''

    const isLinked = !!workingDataset.linkpath
    const linkButton = isLinked ? (
      <div
        className='header-column'
        data-tip={workingDataset.linkpath}
        onClick={() => { shell.openItem(String(workingDataset.linkpath)) }}
      >
        <div className='header-column-icon'>
          <span className='icon-inline'>openfolder</span>
        </div>
        <div className='header-column-text'>
          <div className="label">Show Dataset Files</div>
        </div>
      </div>) : (
      <div className='header-column' data-tip='Link this dataset to a folder on your computer'>
        <div className='header-column-icon'>
          <span className='icon-inline'>link</span>
        </div>
        <div className='header-column-text'>
          <div className="label">Link to Filesystem</div>
        </div>
      </div>
    )

    return (
      <div id='dataset-container'>
        <div className='header'>
          <div
            className={classNames('current-dataset', 'header-column', { 'expanded': showDatasetList })}
            data-tip={`${workingDataset.peername}/${workingDataset.name}`}
            onClick={toggleDatasetList}
            style={{ width: datasetSidebarWidth }}
          >
            <div className='header-column-icon'>
              <img className='app-loading-blob' src={logo} />
            </div>
            <div className='header-column-text'>
              <div className="label">Current Dataset</div>
              <div className="name">{name}</div>
            </div>
            {
              showDatasetList
                ? <div className="arrow collapse">&nbsp;</div>
                : <div className="arrow expand">&nbsp;</div>
            }

          </div>
          {linkButton}
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
              path={path}
              isLinked={isLinked}
              activeTab={activeTab}
              selectedComponent={selectedComponent}
              selectedCommit={selectedCommit}
              history={history}
              status={status}
              onTabClick={setActiveTab}
              fetchWorkingHistory={fetchWorkingHistory}
              onListItemClick={setSelectedListItem}
            />
          </Resizable>
          <div className='content-wrapper'>
            {showDatasetList && <div className='overlay'></div>}
            <div className='main-content'>
              <div><SpinnerWithIcon loading={loading}/></div>
              <div><CSSTransition
                in={!loading}
                classNames='fade'
                component='div'
                timeout={300}
                unmountOnExit
              >
                {mainContent}
              </CSSTransition></div>
            </div>
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
        {/*
          This adds react-tooltip to all children of Dataset
          To add a tooltip to any element, add a data-tip={'tooltip text'} attribute
          See componentDidUpdate, which calls rebuild() to re-bind all tooltips
        */}
        <ReactTooltip
          place='bottom'
          type='dark'
          effect='solid'
          delayShow={1000}
          multiline
        />
      </div>
    )
  }
}
