import * as React from 'react'
import { Action } from 'redux'
import classNames from 'classnames'
import ReactTooltip from 'react-tooltip'
import { ipcRenderer, shell } from 'electron'
import { CSSTransition } from 'react-transition-group'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { faFile } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ApiAction, ApiActionThunk } from '../store/api'
import ExternalLink from './ExternalLink'
import { Resizable } from './Resizable'
import { Session } from '../models/session'
import DatasetSidebar from './DatasetSidebar'
import UnlinkedDataset from './UnlinkedDataset'
import DatasetComponent from './DatasetComponent'
import { QRI_CLOUD_URL } from '../utils/registry'
import { Modal, ModalType } from '../models/modals'
import { defaultSidebarWidth } from '../reducers/ui'
import HeaderColumnButton from './chrome/HeaderColumnButton'
import DatasetListContainer from '../containers/DatasetListContainer'
import CommitDetailsContainer from '../containers/CommitDetailsContainer'
import HeaderColumnButtonDropdown from './chrome/HeaderColumnButtonDropdown'

import {
  UI,
  Selections,
  MyDatasets,
  WorkingDataset,
  Mutations,
  DatasetStatus,
  SelectedComponent,
  ComponentType
} from '../models/store'

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
  resetBody: () => Promise<ApiAction>
  resetOtherComponents: () => Promise<ApiAction>
  publishDataset: (dataset: WorkingDataset) => Action
  unpublishDataset: (dataset: WorkingDataset) => Action
  signout: () => Action
  discardChanges: (component: ComponentType) => ApiActionThunk
}

interface DatasetState {
  peername: string
  name: string
  saveIsLoading: boolean
  workingDatasetIsLoading: boolean
  activeTab: string
  status: DatasetStatus
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
    activeTab: this.props.selections.activeTab,
    status: this.props.workingDataset.status
  }

  componentDidMount () {
    // poll for status
    setInterval(() => { this.props.fetchWorkingStatus() }, 3000)

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

  componentDidUpdate (prevProps: DatasetProps) {
    // map mtime deltas to a boolean to determine whether to update the workingDataset
    const { workingDataset, resetBody, resetOtherComponents } = this.props
    const { status } = workingDataset
    const { status: prevStatus } = prevProps.workingDataset
    if (status) {
      // create an array of components that need updating
      const componentsToReset: SelectedComponent[] = []

      Object.keys(status).forEach((component: SelectedComponent) => {
        const currentMtime = status[component].mtime
        const prevMtime = prevStatus[component] && prevStatus[component].mtime
        if (currentMtime && prevMtime) {
          if (currentMtime.getTime() !== prevMtime.getTime()) componentsToReset.push(component)
        }
      })

      // reset components
      if (componentsToReset.includes('body')) resetBody()
      if (componentsToReset.includes('schema') || componentsToReset.includes('meta')) resetOtherComponents()
    }

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
      published
    } = selections

    // don't use isLinked from selections
    const isLinked = workingDataset.linkpath !== ''

    const { status } = workingDataset

    // actions
    const {
      toggleDatasetList,
      setActiveTab,
      setSidebarWidth,
      setSelectedListItem,
      fetchWorkingHistory,
      signout,
      discardChanges
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
        icon={(
          <span className='fa-layers fa-fw'>
            <FontAwesomeIcon icon={faFile} size='lg'/>
            <FontAwesomeIcon icon={faLink} transform="shrink-8" />
          </span>
        )}
        onClick={() => { setModal({ type: ModalType.LinkDataset }) }}
      />
    )

    let publishButton
    if (username === workingDataset.peername) {
      publishButton = published ? (
        <HeaderColumnButtonDropdown
          onClick={() => { shell.openExternal(`${QRI_CLOUD_URL}/${workingDataset.peername}/${workingDataset.name}`) }}
          icon='faCloud'
          label='View in Cloud'
          items={[
            <a key={0} onClick={(e) => { shell.openExternal(`${QRI_CLOUD_URL}/${workingDataset.peername}/${workingDataset.name}`); e.stopPropagation() }}>Copy Link</a>,
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
            <div className='header-column-arrow'>
              {
                showDatasetList
                  ? <div className="arrow collapse">&nbsp;</div>
                  : <div className="arrow expand">&nbsp;</div>
              }
            </div>
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
              isLinked={isLinked}
              activeTab={activeTab}
              selectedComponent={selectedComponent}
              selectedCommit={selectedCommit}
              workingDataset={workingDataset}
              onTabClick={setActiveTab}
              fetchWorkingHistory={fetchWorkingHistory}
              onListItemClick={setSelectedListItem}
              discardChanges={discardChanges}
            />
          </Resizable>
          <div className='content-wrapper'>
            {/* Show the overlay to dim the rest of the app when the sidebar is open */}
            {showDatasetList && <div className='overlay' onClick={toggleDatasetList}></div>}
            <div className='transition-group' >
              <CSSTransition
                in={(activeTab === 'status') && !isLinked}
                classNames='fade'
                timeout={300}
                mountOnEnter
                unmountOnExit
              >
                <UnlinkedDataset setModal={setModal}/>
              </CSSTransition>
              <CSSTransition
                in={activeTab === 'status' && isLinked}
                classNames='fade'
                timeout={300}
                mountOnEnter
                unmountOnExit
              >
                <DatasetComponent component={selectedComponent} componentStatus={status[selectedComponent]} isLoading={workingDataset.isLoading} />
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
          delayShow={500}
          multiline
        />
      </div>
    )
  }
}
