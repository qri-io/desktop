import * as React from 'react'
import { Action } from 'redux'
import { withRouter } from 'react-router-dom'
import { remote, ipcRenderer, shell, clipboard } from 'electron'
import { CSSTransition } from 'react-transition-group'

import { ApiAction } from '../store/api'
import { Resizable } from './Resizable'
import { Session } from '../models/session'
import SidebarLayout from './SidebarLayout'
import UnlinkedDataset from './UnlinkedDataset'
import { QRI_CLOUD_URL } from '../constants'
import DatasetComponent from './DatasetComponent'
import NoDatasetSelected from './NoDatasetSelected'
import { Modal, ModalType } from '../models/modals'
import { defaultSidebarWidth } from '../reducers/ui'
import HeaderColumnButton from './chrome/HeaderColumnButton'
import HeaderColumnButtonDropdown from './chrome/HeaderColumnButtonDropdown'
import CommitDetailsContainer from '../containers/CommitDetailsContainer'
import DatasetSidebarContainer from '../containers/DatasetSidebarContainer'
import DetailsBarContainer from '../containers/DetailsBarContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen, faFile, faLink, faCloud, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'

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
  showDetailsBar: boolean

  // actions
  setActiveTab: (activeTab: string) => Action
  setSidebarWidth: (type: string, sidebarWidth: number) => Action
  fetchWorkingDatasetDetails: () => Promise<ApiAction>
  fetchWorkingStatus: () => Promise<ApiAction>
  fetchBody: (page: number) => Promise<ApiAction>
  fetchWorkingDataset: () => Promise<ApiAction>
}

const logo = require('../assets/qri-blob-logo-tiny.png') //eslint-disable-line

class Dataset extends React.Component<DatasetProps> {
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

    ipcRenderer.on('open-working-directory', this.openWorkingDirectory)

    ipcRenderer.on('publish-unpublish-dataset', this.publishUnpublishDataset)

    ipcRenderer.on('reload', () => {
      remote.getCurrentWindow().reload()
    })

    this.props.fetchWorkingDatasetDetails()
  }

  componentWillUnmount () {
    clearInterval(this.statusInterval)
  }

  componentDidUpdate (prevProps: DatasetProps) {
    // map mtime deltas to a boolean to determine whether to update the workingDataset
    const { workingDataset, fetchWorkingDataset, fetchBody } = this.props
    const { status } = workingDataset
    const { status: prevStatus } = prevProps.workingDataset

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
        componentsToReset.includes('readme') ||
        componentsToReset.includes('transform')
      ) fetchWorkingDataset()
    }
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
    const { ui, selections, workingDataset, setModal, hasDatasets, session } = this.props
    const { peername: username } = session
    const { datasetSidebarWidth } = ui
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
      setSidebarWidth,
      showDetailsBar
    } = this.props

    const sidebarContent = (
      <DatasetSidebarContainer setModal={setModal} />
    )

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
          label='checkout'
          tooltip='Checkout this dataset to a folder on your computer'
          icon={(
            <span className='fa-layers fa-fw'>
              <FontAwesomeIcon icon={faFile} size='lg'/>
              <FontAwesomeIcon icon={faLink} transform='shrink-8' />
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

    const mainContent = (
      <>
        <div className='main-content-header'>
          {linkButton}
          {publishButton}
        </div>
        <div className='main-content-flex'>
          <div className='transition-group' >
            <CSSTransition
              in={!peername && !name}
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
              <NoDatasetSelected />
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
      </>
    )

    return (
      <>
        <div className='details-bar-wrapper'
          style={{ 'left': showDetailsBar ? 0 : datasetSidebarWidth * -2 }}
        >
          <div className='details-bar-inner'
            style={{ 'opacity': showDetailsBar ? 1 : 0 }}
          >
            <Resizable
              id='details'
              width={datasetSidebarWidth}
              onResize={(width) => { setSidebarWidth('dataset', width) }}
              onReset={() => { setSidebarWidth('dataset', defaultSidebarWidth) }}
              maximumWidth={495}
            >
              <DetailsBarContainer />
            </Resizable>
          </div>
        </div>
        <SidebarLayout
          id='dataset-container'
          sidebarContent={sidebarContent}
          sidebarWidth={datasetSidebarWidth}
          onSidebarResize={(width) => { setSidebarWidth('dataset', width) }}
          maximumSidebarWidth={495}
          mainContent={mainContent}
        />
      </>
    )
  }
}

export default withRouter(Dataset)
