import * as React from 'react'
import classNames from 'classnames'
import { Action } from 'redux'
import { ipcRenderer, shell } from 'electron'
import ReactTooltip from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-regular-svg-icons'
import { faLink } from '@fortawesome/free-solid-svg-icons'

import { ApiAction, ApiActionThunk } from '../store/api'
import ExternalLink from './ExternalLink'
import { Resizable } from './Resizable'
import DatasetSidebar from './DatasetSidebar'
import DatasetComponent from './DatasetComponent'
import DatasetListContainer from '../containers/DatasetListContainer'
import CommitDetailsContainer from '../containers/CommitDetailsContainer'
import HeaderColumnButton from './chrome/HeaderColumnButton'
import HeaderColumnButtonDropdown from './chrome/HeaderColumnButtonDropdown'

import { CSSTransition } from 'react-transition-group'
import { Modal } from '../models/modals'

import { defaultSidebarWidth } from '../reducers/ui'

import { QRI_CLOUD_URL } from '../utils/registry'

import {
  UI,
  Selections,
  MyDatasets,
  WorkingDataset,
  Mutations
} from '../models/store'

import { Session } from '../models/session'

export interface DatasetProps {
  // redux state
  ui: UI
  selections: Selections
  myDatasets: MyDatasets
  workingDataset: WorkingDataset
  mutations: Mutations
  setModal: (modal: Modal) => void
  session: Session

  // actions
  toggleDatasetList: () => Action
  setActiveTab: (activeTab: string) => Action
  setSidebarWidth: (type: string, sidebarWidth: number) => Action
  setFilter: (filter: string) => Action
  setSelectedListItem: (type: string, activeTab: string) => Action
  setWorkingDataset: (peername: string, name: string, isLinked: boolean, published: boolean) => Action
  fetchWorkingDatasetDetails: () => Promise<ApiAction>
  fetchWorkingHistory: (page?: number, pageSize?: number) => ApiActionThunk
  fetchWorkingStatus: () => Promise<ApiAction>
  publishDataset: (dataset: WorkingDataset) => Action
  unpublishDataset: (dataset: WorkingDataset) => Action
  signout: () => Action
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
    // setInterval(() => { this.props.fetchWorkingStatus() }, 5000)
    const { selections, workingDataset } = this.props
    const { activeTab, isLinked } = selections
    if (activeTab === 'status' && !isLinked) {
      this.props.setActiveTab('history')
    } else if (activeTab === 'history' && workingDataset.history.pageInfo.error && workingDataset.history.pageInfo.error.includes('no history')) {
      this.props.setActiveTab('status')
    }

    this.openWorkingDirectory = this.openWorkingDirectory.bind(this)
    this.publishUnpublishDataset = this.publishUnpublishDataset.bind(this)

    // electron menu events
    ipcRenderer.on('show-status', () => {
      this.props.setActiveTab('status')
    })

    ipcRenderer.on('show-history', () => {
      this.props.setActiveTab('history')
    })

    ipcRenderer.on('show-datasets', () => {
      this.props.toggleDatasetList()
    })

    ipcRenderer.on('open-working-directory', this.openWorkingDirectory)

    ipcRenderer.on('publish-unpublish-dataset', this.publishUnpublishDataset)
  }

  componentDidUpdate () {
    // this "wires up" all of the tooltips, must be called on update, as tooltips
    // in descendents can come and go
    ReactTooltip.rebuild()
    const { selections, workingDataset } = this.props
    const { activeTab, isLinked } = selections
    if (activeTab === 'status' && !isLinked) {
      this.props.setActiveTab('history')
    } else if (activeTab === 'history' && workingDataset.history.pageInfo.error && workingDataset.history.pageInfo.error.includes('no history')) {
      this.props.setActiveTab('status')
    }
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
    // TODO (ramfox): there is a bug here when we try to switch to body, but body hasn't finished fetching yet
    // this will prematurely decide to switch away from body.
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

  openWorkingDirectory () {
    shell.openItem(this.props.workingDataset.linkpath)
  }

  publishUnpublishDataset () {
    const { publishDataset, unpublishDataset, selections, workingDataset } = this.props
    const { published } = selections

    published ? unpublishDataset(workingDataset) : publishDataset(workingDataset)
  }

  render () {
    // unpack all the things
    const { ui, selections, workingDataset, setModal, session } = this.props
    const { peername: username, photo: userphoto } = session
    const { showDatasetList, datasetSidebarWidth } = ui
    const {
      name,
      activeTab,
      component: selectedComponent,
      commit: selectedCommit,
      isLinked,
      published
    } = selections

    const { history, status, path } = workingDataset

    // actions
    const {
      toggleDatasetList,
      setActiveTab,
      setSidebarWidth,
      setSelectedListItem,
      fetchWorkingHistory,
      signout
    } = this.props

    const linkButton = isLinked ? (
      <HeaderColumnButton
        icon={'faFolderOpen'}
        tooltip={`Open ${workingDataset.linkpath}`}
        label='Show Files'
        onClick={this.openWorkingDirectory}
      />) : (
      <HeaderColumnButton
        label='link to filesystem'
        tooltip='Link this dataset to a folder on your computer'
        icon={(<>
          <FontAwesomeIcon icon={faFile} size='lg'/>
          <FontAwesomeIcon icon={faLink} transform="shrink-8" />
        </>)}
        onClick={() => { console.log('not finished: linking to filesystem') }}
      />
    )

    let publishButton
    if (username === workingDataset.peername) {
      publishButton = published ? (
        <HeaderColumnButtonDropdown
          onClick={() => { shell.openExternal(`http://localhost:3000/${workingDataset.peername}/${workingDataset.name}`) }}
          icon='faCloud'
          label='View in Cloud'
          items={[
            <a key={0} onClick={(e) => { shell.openExternal(`http://localhost:3000/${workingDataset.peername}/${workingDataset.name}`); e.stopPropagation() }}>Copy Link</a>,
            <a key={1} onClick={this.publishUnpublishDataset}>Unpublish</a>
          ]}
        />
      ) : (
        <HeaderColumnButton
          label='Publish'
          icon='faCloudUploadAlt'
          tooltip={'Publish this dataset on the Qri network'}
          onClick={this.publishUnpublishDataset}
        />
      )
    }

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
          {publishButton}
          <HeaderColumnButtonDropdown
            icon={<div className='header-column-icon' ><img src={userphoto} /></div>}
            label={username}
            items={[
              <ExternalLink key={0} href={`${QRI_CLOUD_URL}/${username}`}>Public Profile</ExternalLink>,
              <ExternalLink key={1} href={`${QRI_CLOUD_URL}/settings`}>Settings</ExternalLink>,
              <a key={2} onClick={signout}>Sign Out</a>
            ]}
          />
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
              <DatasetListContainer setModal={setModal} />
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
