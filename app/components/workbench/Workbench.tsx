import * as React from 'react'
import { Action } from 'redux'
import { ipcRenderer, shell, clipboard } from 'electron'
import { CSSTransition } from 'react-transition-group'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen, faFile, faLink, faCloud, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'
import { withRouter, RouteComponentProps, Prompt } from 'react-router-dom'

import { QRI_CLOUD_URL } from '../../constants'
import { Details } from '../../models/details'
import { Session } from '../../models/session'
import {
  Selections,
  WorkingDataset,
  CommitDetails as ICommitDetails,
  History,
  ComponentType,
  SelectedComponent,
  Status
} from '../../models/store'
import Dataset from '../../models/dataset'
import { Modal, ModalType } from '../../models/modals'
import { ApiActionThunk, LaunchedFetchesAction } from '../../store/api'
import { defaultSidebarWidth } from '../../reducers/ui'

import { Resizable } from '../Resizable'
import Layout from '../Layout'
import DatasetComponent from './DatasetComponent'
import NoDatasetSelected from './NoDatasetSelected'
import HeaderColumnButton from '../chrome/HeaderColumnButton'
import Hamburger from '../chrome/Hamburger'
import WorkbenchSidebar from './WorkbenchSidebar'
import DetailsBarContainer from '../../containers/DetailsBarContainer'
import CommitDetails from './CommitDetails'
import NoDatasets from '../NoDatasets'
import NotInNamespace from './NotInNamespace'

// TODO (b5) - is this still required?
require('../../assets/qri-blob-logo-tiny.png')

export interface WorkbenchData {
  location: string

  workingDataset: WorkingDataset
  head: ICommitDetails
  history: History
  status: Status

  // mutations
  mutationsDataset: Dataset
}

export interface WorkbenchProps extends RouteComponentProps {
  data: WorkbenchData

  // display details
  selections: Selections
  session: Session
  hasDatasets: boolean
  showDetailsBar: boolean
  sidebarWidth: number
  details: Details
  inNamespace: boolean

  // only used if there is no fsiPath
  modified?: boolean

  // setting actions
  setModal: (modal: Modal) => void
  setActiveTab: (activeTab: string) => Action
  setSidebarWidth: (type: string, sidebarWidth: number) => Action
  setCommit: (path: string) => Action
  setComponent: (type: ComponentType, activeComponent: string) => Action
  resetMutationsDataset: () => Action
  resetMutationsStatus: () => Action

  // fetching actions
  fetchWorkbench: () => LaunchedFetchesAction
  fetchHistory: (page?: number, pageSize?: number) => ApiActionThunk
  fetchWorkingDatasetDetails: () => ApiActionThunk

  // api actions (that aren't fetching)
  publishDataset: () => ApiActionThunk
  unpublishDataset: () => ApiActionThunk
  discardChanges: (component: SelectedComponent) => ApiActionThunk
  discardMutationsChanges: (component: SelectedComponent) => Action
  renameDataset: (peername: string, name: string, newName: string) => ApiActionThunk
  fsiWrite: (peername: string, name: string, dataset: Dataset) => ApiActionThunk
}

class Workbench extends React.Component<WorkbenchProps, Status> {
  constructor (props: WorkbenchProps) {
    super(props);

    [
      'openWorkingDirectory',
      'publishUnpublishDataset',
      'handleShowStatus',
      'handleShowHistory',
      'handleDiscardChanges',
      'handleCopyLink'
    ].forEach((m) => { this[m] = this[m].bind(this) })
  }

  componentDidMount () {
    // electron menu events
    ipcRenderer.on('show-status', this.handleShowStatus)
    ipcRenderer.on('show-history', this.handleShowHistory)
    ipcRenderer.on('open-working-directory', this.openWorkingDirectory)
    ipcRenderer.on('publish-unpublish-dataset', this.publishUnpublishDataset)

    this.props.fetchWorkbench()
  }

  componentWillUnmount () {
    ipcRenderer.removeListener('show-status', this.handleShowStatus)
    ipcRenderer.removeListener('show-history', this.handleShowHistory)
    ipcRenderer.removeListener('open-working-directory', this.openWorkingDirectory)
    ipcRenderer.removeListener('publish-unpublish-dataset', this.publishUnpublishDataset)

    this.props.resetMutationsDataset()
    this.props.resetMutationsStatus()
  }

  private handleShowStatus () {
    this.props.setActiveTab('status')
  }

  private handleShowHistory () {
    this.props.setActiveTab('history')
  }

  private handleCopyLink () {
    clipboard.writeText(`${QRI_CLOUD_URL}/${this.props.data.workingDataset.peername}/${this.props.data.workingDataset.name}`)
  }

  async componentDidUpdate (prevProps: WorkbenchProps) {
    if (prevProps.data.location !== this.props.data.location) {
      // TODO (b5) - this was bailing early when fetch happened
      this.props.fetchWorkbench()
    }
  }

  openWorkingDirectory () {
    shell.openItem(this.props.data.workingDataset.fsiPath)
  }

  publishUnpublishDataset () {
    const { data, setModal } = this.props
    const { published } = data.workingDataset

    published
      ? setModal({ type: ModalType.UnpublishDataset })
      : setModal({ type: ModalType.PublishDataset })
  }

  handleDiscardChanges (component: SelectedComponent) {
    const { workingDataset } = this.props.data
    const { fsiPath } = workingDataset
    if (fsiPath !== '') {
      this.props.discardChanges(component)
      this.props.discardMutationsChanges(component)
      return
    }
    this.props.discardMutationsChanges(component)
  }

  render () {
    const {
      data,

      selections,
      hasDatasets,
      sidebarWidth,
      session,
      modified = false,
      inNamespace,

      setModal,
      setActiveTab,
      setCommit,
      setComponent,

      fetchHistory,

      renameDataset
    } = this.props
    const { peername: username } = session
    const {
      peername,
      name,
      activeTab
    } = selections

    const datasetSelected = peername !== '' && name !== ''

    const { workingDataset, status } = data
    const { published, fsiPath } = workingDataset

    // isLinked is derived from fsiPath and only used locally
    const isLinked = fsiPath !== ''

    // actions
    const {
      setSidebarWidth,
      showDetailsBar
    } = this.props

    const sidebarContent = (
      <WorkbenchSidebar
        data= {{ workingDataset: data.workingDataset, history: data.history }}
        status={status}
        selections={selections}
        setModal={setModal}
        setActiveTab={setActiveTab}
        setCommit={setCommit}
        setComponent={setComponent}
        fetchHistory={fetchHistory}
        discardChanges={this.handleDiscardChanges}
        renameDataset={renameDataset}
      />
    )

    let linkButton
    if (datasetSelected) {
      linkButton = isLinked ? (
        <HeaderColumnButton
          id='show-files'
          icon={faFolderOpen}
          label='Show Files'
          onClick={this.openWorkingDirectory}
        />) : username === peername && (
        <HeaderColumnButton
          id='checkout'
          label='checkout'
          tooltip='Checkout this dataset to a folder on your computer'
          icon={(
            <span className='fa-layers fa-fw'>
              <FontAwesomeIcon icon={faFile} size='lg'/>
              <FontAwesomeIcon icon={faLink} transform='shrink-8' />
            </span>
          )}
          onClick={() => { setModal({ type: ModalType.LinkDataset, modified }) }}
        />)
    }

    let publishButton
    if (username === peername && datasetSelected) {
      publishButton = published ? (
        <><HeaderColumnButton
          id='view-in-cloud'
          onClick={() => { shell.openExternal(`${QRI_CLOUD_URL}/${data.workingDataset.peername}/${data.workingDataset.name}`) }}
          icon={faCloud}
          label='View in Cloud'
        />
        <Hamburger id='workbench-hamburger' data={[
          {
            icon: 'clone',
            text: 'Copy Cloud Link',
            onClick: this.handleCopyLink
          },
          {
            icon: 'close',
            text: 'Unpublish',
            onClick: () => setModal({ type: ModalType.UnpublishDataset })
          }
        ]} />
        </>
      ) : (
        <span data-tip={
          data.workingDataset.history.value.length === 0
            ? 'The dataset must have at least one commit before you can publish'
            : 'Publish this dataset to Qri Cloud'
        }>
          <HeaderColumnButton
            id='publish-button'
            label='Publish'
            icon={faCloudUploadAlt}
            disabled={data.workingDataset.history.value.length === 0}
            onClick={() => { setModal({ type: ModalType.PublishDataset }) }}
          />
        </span>
      )
    }

    const mainContent = (
      <>
        <Prompt when={modified} message={(location) => {
          if (location.pathname.includes('workbench')) return false
          if (fsiPath !== '') {
            this.props.fetchWorkingDatasetDetails()
            return true
          }
          return `You have uncommited changes! Click 'cancel' and commit these changes before you navigate away or you will lose your work.`
        }}/>
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
              in={datasetSelected && activeTab === 'status'}
              classNames='fade'
              timeout={300}
              mountOnEnter
              unmountOnExit
            >
              { inNamespace
                ? <DatasetComponent />
                : <NotInNamespace />
              }
            </CSSTransition>
            <CSSTransition
              in={datasetSelected && activeTab === 'history'}
              classNames='fade'
              timeout={300}
              mountOnEnter
              unmountOnExit
            >
              <CommitDetails />
            </CSSTransition>
          </div>
        </div>
      </>
    )

    return (
      <>
        <div className='details-bar-wrapper'
          style={{ 'left': showDetailsBar ? 59 : sidebarWidth * -3 }}
        >
          <div className='details-bar-inner'
            style={{ 'opacity': showDetailsBar ? 1 : 0 }}
          >
            <Resizable
              id='details'
              width={sidebarWidth}
              onResize={(width) => { setSidebarWidth('dataset', width) }}
              onReset={() => { setSidebarWidth('dataset', defaultSidebarWidth) }}
              maximumWidth={495}
            >
              <DetailsBarContainer />
            </Resizable>
          </div>
        </div>
        <Layout
          id='dataset-container'
          sidebarContent={sidebarContent}
          sidebarWidth={sidebarWidth}
          onSidebarResize={(width) => { setSidebarWidth('dataset', width) }}
          maximumSidebarWidth={495}
          mainContent={mainContent}
        />
      </>
    )
  }
}

export default withRouter(Workbench)
