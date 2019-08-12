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

import { CSSTransition } from 'react-transition-group'

import { defaultSidebarWidth } from '../reducers/ui'

import {
  UI,
  Selections,
  MyDatasets,
  WorkingDataset,
  Mutations
} from '../models/store'

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
  workingDatasetIsLoading: boolean
  activeTab: string
}

const logo = require('../assets/qri-blob-logo-tiny.png') //eslint-disable-line

export default class Dataset extends React.Component<DatasetProps> {
  // component state is used to compare changes when a new dataset is selected
  // see getDerivedStateFromProps() below
  state = {
    peername: null,
    name: null,
    saveIsLoading: false,
    workingDatasetIsLoading: true,
    activeTab: this.props.selections.activeTab
  }

  componentDidMount () {
    // poll for status
    setInterval(() => { this.props.fetchWorkingStatus() }, 5000)
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
    const { peername, name, workingDatasetIsLoading, activeTab } = prevState
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

    // make sure that the component we are trying to show actually exists in this version of the dataset
    if ((workingDatasetIsLoading && !nextProps.workingDataset.isLoading && nextProps.selections.activeTab === 'status') ||
        (activeTab === 'history' && nextProps.selections.activeTab === 'status')) {
      const { workingDataset, selections, setSelectedListItem } = nextProps
      const { component } = selections
      const { status } = workingDataset
      if (component === '' || !status[component]) {
        if (status['meta']) {
          setSelectedListItem('component', 'meta')
        }
        if (status['body']) {
          setSelectedListItem('component', 'body')
        }
        setSelectedListItem('component', 'schema')
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
      saveIsLoading: newSaveIsLoading,
      activeTab: nextProps.selections.activeTab,
      workingDatasetIsLoading: nextProps.workingDataset.isLoading
    }
  }

  render () {
    // unpack all the things
    const { ui, selections, workingDataset } = this.props
    const { showDatasetList, datasetSidebarWidth } = ui
    const {
      name,
      activeTab,
      component: selectedComponent,
      commit: selectedCommit
    } = selections

    const { history, status, path } = workingDataset

    // actions
    const {
      toggleDatasetList,
      setActiveTab,
      setSidebarWidth,
      setSelectedListItem,
      fetchWorkingHistory
    } = this.props

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
              <div className="label">{name ? 'Current Dataset' : 'Choose a Dataset'}</div>
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
            {showDatasetList && <div className='overlay' onClick={toggleDatasetList}></div>}
            <div className='transition-group' >
              <CSSTransition
                in={activeTab === 'status'}
                classNames='fade'
                timeout={300}
                mountOnEnter
                unmountOnExit
              >
                <DatasetComponent component={selectedComponent} componentStatus={status[selectedComponent]} isLoading={workingDataset.isLoading}/>
              </CSSTransition>
              <CSSTransition
                in={activeTab === 'history'}
                classNames='fade'
                timeout={300}
                mountOnEnter
                unmountOnExit
              >
                <CommitDetailsContainer />
              </CSSTransition>
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
