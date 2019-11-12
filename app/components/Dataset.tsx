import * as React from 'react'
import { Action } from 'redux'
import classNames from 'classnames'
import ReactTooltip from 'react-tooltip'
import { remote, ipcRenderer, shell, clipboard } from 'electron'
import { CSSTransition } from 'react-transition-group'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faFolderOpen, faCommentAlt } from '@fortawesome/free-regular-svg-icons'
import { faLink, faCloudUploadAlt, faCloud } from '@fortawesome/free-solid-svg-icons'

import { ApiAction } from '../store/api'
import ExternalLink from './ExternalLink'
import { Resizable } from './Resizable'
import { Session } from '../models/session'
import UnlinkedDataset from './UnlinkedDataset'
import NoDatasetSelected from './NoDatasetSelected'
import DatasetComponent from './DatasetComponent'
import { QRI_CLOUD_URL } from '../utils/registry'
import { Modal, ModalType } from '../models/modals'
import { defaultSidebarWidth } from '../reducers/ui'
import HeaderColumnButton from './chrome/HeaderColumnButton'
import DatasetListContainer from '../containers/DatasetListContainer'
import CommitDetailsContainer from '../containers/CommitDetailsContainer'
import DatasetSidebarContainer from '../containers/DatasetSidebarContainer'
import HeaderColumnButtonDropdown from './chrome/HeaderColumnButtonDropdown'

import {
  UI,
  Selections,
  WorkingDataset,
  Mutations,
  SelectedComponent
} from '../models/store'
import NoDatasets from './NoDatasets'
import { defaultPollInterval } from './App'

export interface DatasetProps {
  // redux state
  ui: UI
  selections: Selections
  workingDataset: WorkingDataset
  mutations: Mutations
  setModal: (modal: Modal) => void
  session: Session
  hasDatasets: boolean

  // actions
  toggleDatasetList: () => Action
  setActiveTab: (activeTab: string) => Action
  setSidebarWidth: (type: string, sidebarWidth: number) => Action
  fetchWorkingDatasetDetails: () => Promise<ApiAction>
  fetchWorkingStatus: () => Promise<ApiAction>
  fetchBody: (page: number) => Promise<ApiAction>
  fetchWorkingDataset: () => Promise<ApiAction>
  signout: () => Action
}

const logo = require('../assets/qri-blob-logo-tiny.png') //eslint-disable-line
const defaultPhoto = require('../assets/default_46x46.png') //eslint-disable-line

interface CurrentDatasetProps {
  onClick: () => {}
  expanded: boolean
  width?: number
  peername: string | null
  name: string | null
}

export const CurrentDataset: React.FunctionComponent<CurrentDatasetProps> = (props) => {
  const { onClick, expanded, width, peername, name } = props
  const datasetSelected = peername !== '' && name !== ''
  const alias = datasetSelected ? `${peername}/${name}` : ''

  return (
    <div
      id='current_dataset'
      className={classNames('current-dataset', 'header-column', 'sidebar-list-item', { 'expanded': expanded })}
      onClick={onClick}
      style={{ width: width || '100%' }}
    >
      <div className='header-column-icon'>
        <img className='app-loading-blob' src={logo} />
      </div>
      <div className='header-column-text'>
        <div className="label">{name ? 'Current Dataset' : 'Choose a Dataset'}</div>
        <div className="name">{alias}</div>
      </div>
      <div className='header-column-arrow'>
        {
          expanded
            ? <div className="arrow collapse">&nbsp;</div>
            : <div className="arrow expand">&nbsp;</div>
        }
      </div>
    </div>
  )
}

export default class Dataset extends React.Component<DatasetProps> {
  componentDidMount () {
    // poll for status
    this.statusInterval = setInterval(() => {
      if (this.props.workingDataset.peername !== '' || this.props.workingDataset.name !== '') {
        this.props.fetchWorkingStatus()
      }
    }, defaultPollInterval)

    this.openWorkingDirectory = this.openWorkingDirectory.bind(this)
    this.publishUnpublishDataset = this.publishUnpublishDataset.bind(this)

    // electron menu events
    ipcRenderer.on('show-status', () => {
      this.props.setActiveTab('status')
    })

    ipcRenderer.on('show-history', () => {
      this.props.setActiveTab('history')
    })

    ipcRenderer.on('toggle-dataset-list', () => {
      this.props.toggleDatasetList()
    })

    ipcRenderer.on('open-working-directory', this.openWorkingDirectory)

    ipcRenderer.on('publish-unpublish-dataset', this.publishUnpublishDataset)

    ipcRenderer.on('reload', () => {
      remote.getCurrentWindow().reload()
    })
  }

  componentWillUnmount () {
    clearInterval(this.statusInterval)
  }

  componentDidUpdate (prevProps: DatasetProps) {
    // map mtime deltas to a boolean to determine whether to update the workingDataset
    const { workingDataset, fetchWorkingDataset, fetchBody } = this.props
    const { status } = workingDataset
    const { status: prevStatus } = prevProps.workingDataset

    if ((this.props.selections.peername !== prevProps.selections.peername) || (this.props.selections.name !== prevProps.selections.name)) {
      this.props.fetchWorkingDatasetDetails()
      return
    }

    if (status) {
      // create an array of components that need updating
      const componentsToReset: SelectedComponent[] = []

      const statusKeys = Object.keys(status)
      const prevStatusKeys = Object.keys(prevStatus)

      statusKeys.forEach((component: SelectedComponent) => {
        const currentMtime = status[component].mtime
        const prevMtime = prevStatus[component] && prevStatus[component].mtime
        if (currentMtime && prevMtime) {
          if (currentMtime.getTime() !== prevMtime.getTime()) {
            componentsToReset.push(component)
          }
        }
      })

      // if the number of files has changed,
      // make sure we fetchWorkingDataset
      // ignore if prevStatusKeys is empty
      if (prevStatusKeys.length > 0) {
        const difference = statusKeys
          .filter((component: SelectedComponent) => !prevStatusKeys.includes(component))
          .concat(prevStatusKeys.filter((component: SelectedComponent) => !statusKeys.includes(component)))
        difference.forEach((component: SelectedComponent) => componentsToReset.push(component))
      }

      // reset components
      if (componentsToReset.includes('body')) fetchBody(-1)
      if (
        componentsToReset.includes('structure') ||
        componentsToReset.includes('meta') ||
        componentsToReset.includes('readme')
      ) fetchWorkingDataset()
    }

    // this "wires up" all of the tooltips, must be called on update, as tooltips
    // in descendents can come and go
    ReactTooltip.rebuild()
  }

  openWorkingDirectory () {
    shell.openItem(this.props.workingDataset.fsiPath)
  }

  publishUnpublishDataset () {
    const { workingDataset, setModal } = this.props
    const { published } = workingDataset

    published
      ? setModal({ type: ModalType.UnpublishDataset })
      : setModal({ type: ModalType.PublishDataset })
  }

  render () {
    // unpack all the things
    const { ui, selections, workingDataset, setModal, session, hasDatasets } = this.props
    const { peername: username, photo: userphoto } = session
    const { showDatasetList, datasetSidebarWidth } = ui
    const {
      peername,
      name,
      activeTab,
      component: selectedComponent
    } = selections

    const datasetSelected = peername !== '' && name !== ''
    const { status, published, fsiPath } = workingDataset

    // isLinked is derived from fsiPath and only used locally
    const isLinked = fsiPath !== ''

    // actions
    const {
      toggleDatasetList,
      setSidebarWidth,
      signout
    } = this.props

    let linkButton
    if (datasetSelected) {
      linkButton = isLinked ? (
        <HeaderColumnButton
          id='linkButton'
          icon={faFolderOpen}
          label='Show Files'
          onClick={this.openWorkingDirectory}
        />) : (
        <HeaderColumnButton
          id='linkButton'
          label='link to filesystem'
          tooltip='Link this dataset to a folder on your computer'
          icon={(
            <span className='fa-layers fa-fw'>
              <FontAwesomeIcon icon={faFile} size='lg'/>
              <FontAwesomeIcon icon={faLink} transform="shrink-8" />
            </span>
          )}
          onClick={() => { setModal({ type: ModalType.LinkDataset }) }}
        />)
    }

    let publishButton
    if (username === peername && datasetSelected) {
      publishButton = published ? (
        <HeaderColumnButtonDropdown
          id='publishButton'
          onClick={() => { shell.openExternal(`${QRI_CLOUD_URL}/${workingDataset.peername}/${workingDataset.name}`) }}
          icon={faCloud}
          label='View in Cloud'
          items={[
            <li key={0} onClick={(e) => {
              e.stopPropagation()
              clipboard.writeText(`${QRI_CLOUD_URL}/${workingDataset.peername}/${workingDataset.name}`)
            }}>Copy Link</li>,
            <li key={1} onClick={(e) => {
              e.stopPropagation()
              setModal({ type: ModalType.UnpublishDataset })
            }}>Unpublish</li>
          ]}
        />
      ) : (
        <span data-tip={
          workingDataset.history.value.length === 0
            ? 'The dataset must have at least one commit before you can publish'
            : 'Publish this dataset to Qri Cloud'
        }>
          <HeaderColumnButton
            id='publishButton'
            label='Publish'
            icon={faCloudUploadAlt}
            disabled={workingDataset.history.value.length === 0}
            onClick={() => { setModal({ type: ModalType.PublishDataset }) }}
          />
        </span>
      )
    }

    return (
      <div id='dataset-container'>
        {/* Show the overlay to dim the rest of the app when the sidebar is open */}
        {showDatasetList && <div className='overlay' onClick={toggleDatasetList}></div>}
        <div className='header'>
          <div className='header-left'>
            <CurrentDataset
              onClick={toggleDatasetList}
              expanded={showDatasetList}
              width={datasetSidebarWidth}
              peername={peername}
              name={name}
            />
            {linkButton}
            {publishButton}
          </div>
          <div className='header-right'>
            <HeaderColumnButton
              id={'beta-flag'}
              label={'BETA'}
              onClick={() => { shell.openExternal('https://qri.io/beta') }}
            />
            <HeaderColumnButton
              icon={faCommentAlt}
              tooltip={'Need help? Ask questions<br/> in our Discord channel'}
              onClick={() => { shell.openExternal('https://discordapp.com/invite/thkJHKj') }}
            />
            <HeaderColumnButtonDropdown
              icon={<div className='header-column-icon' ><img src={userphoto || defaultPhoto} /></div>}
              label={username}
              items={[
                <li key={0}><ExternalLink href={`${QRI_CLOUD_URL}/${username}`}>Public Profile</ExternalLink></li>,
                <li key={1}><ExternalLink href={`${QRI_CLOUD_URL}/settings`}>Settings</ExternalLink></li>,
                <li key={2}><a onClick={signout}>Sign Out</a></li>
              ]}
            />
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
            <DatasetSidebarContainer setModal={setModal} />
          </Resizable>
          <div className='content-wrapper'>
            <div className='transition-group' >
              <CSSTransition
                in={!hasDatasets}
                classNames='fade'
                timeout={300}
                mountOnEnter
                unmountOnExit
              >
                <NoDatasets setModal={setModal} />
              </CSSTransition>
              <CSSTransition
                in={!datasetSelected && hasDatasets}
                classNames='fade'
                timeout={300}
                mountOnEnter
                unmountOnExit
              >
                <NoDatasetSelected toggleDatasetList={toggleDatasetList}/>
              </CSSTransition>
              <CSSTransition
                in={datasetSelected && (activeTab === 'status') && !isLinked && !workingDataset.isLoading}
                classNames='fade'
                timeout={300}
                mountOnEnter
                unmountOnExit
              >
                <UnlinkedDataset setModal={setModal}/>
              </CSSTransition>
              <CSSTransition
                in={datasetSelected && activeTab === 'status' && isLinked}
                classNames='fade'
                timeout={300}
                mountOnEnter
                unmountOnExit
              >
                <DatasetComponent component={selectedComponent} componentStatus={status[selectedComponent]} isLoading={workingDataset.isLoading} fsiPath={this.props.workingDataset.fsiPath}/>
              </CSSTransition>
              <CSSTransition
                in={datasetSelected && activeTab === 'history'}
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
              id='dataset-list'
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
