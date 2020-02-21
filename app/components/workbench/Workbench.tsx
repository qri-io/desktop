import * as React from 'react'
import { Action } from 'redux'
import { ipcRenderer, shell, clipboard } from 'electron'
import { CSSTransition } from 'react-transition-group'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen, faFile, faLink, faCloud, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'

import { QRI_CLOUD_URL } from '../../constants'
import { Details } from '../../models/details'
import { Session } from '../../models/session'
import {
  Selections,
  WorkingDataset,
  CommitDetails as ICommitDetails,
  History,
  ComponentType,
  SelectedComponent
} from '../../models/store'
import { Modal, ModalType } from '../../models/modals'
import { ApiActionThunk, LaunchedFetchesAction } from '../../store/api'
import { defaultSidebarWidth } from '../../reducers/ui'

import { Resizable } from '../Resizable'
import Layout from '../Layout'
import UnlinkedDataset from './UnlinkedDataset'
import DatasetComponent from '../DatasetComponent'
import NoDatasetSelected from './NoDatasetSelected'
import HeaderColumnButton from '../chrome/HeaderColumnButton'
import Hamburger from '../chrome/Hamburger'
import WorkbenchSidebar from './WorkbenchSidebar'
import DetailsBarContainer from '../../containers/DetailsBarContainer'
import CommitDetails from '../CommitDetails'
import NoDatasets from '../NoDatasets'

// TODO (b5) - is this still required?
require('../../assets/qri-blob-logo-tiny.png')

export interface WorkbenchData {
  location: string

  workingDataset: WorkingDataset
  head: ICommitDetails
  history: History
}

export interface WorkbenchProps {
  data: WorkbenchData

  // display details
  selections: Selections
  session: Session
  hasDatasets: boolean
  showDetailsBar: boolean
  sidebarWidth: number
  details: Details

  // setting actions
  setModal: (modal: Modal) => void
  setActiveTab: (activeTab: string) => Action
  setSidebarWidth: (type: string, sidebarWidth: number) => Action
  setCommit: (path: string) => Action
  setComponent: (type: ComponentType, activeComponent: string) => Action
  setDetailsBar: (details: Record<string, any>) => Action

  // fetching actions
  fetchWorkbench: () => LaunchedFetchesAction
  fetchHistory: (page?: number, pageSize?: number) => ApiActionThunk
  fetchWorkingDataset: () => ApiActionThunk
  fetchWorkingStatus: () => ApiActionThunk
  fetchBody: (page: number) => ApiActionThunk

  fetchCommitDataset: () => ApiActionThunk
  fetchCommitBody: (page: number) => ApiActionThunk

  // api actions (that aren't fetching)
  publishDataset: () => ApiActionThunk
  unpublishDataset: () => ApiActionThunk
  discardChanges: (component: SelectedComponent) => ApiActionThunk
  renameDataset: (peername: string, name: string, newName: string) => ApiActionThunk
  fsiWrite: (peername: string, name: string, dataset: Dataset) => ApiActionThunk
}

class Workbench extends React.Component<WorkbenchProps> {
  constructor (props: WorkbenchProps) {
    super(props);

    [
      'openWorkingDirectory',
      'publishUnpublishDataset',
      'handleShowStatus',
      'handleShowHistory',
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
    const {
      data,
      fetchWorkingDataset,
      fetchBody
    } = this.props
    const { workingDataset } = data

    if (prevProps.data.location !== this.props.data.location) {
      // TODO (b5) - this was bailing early when fetch happened
      this.props.fetchWorkbench()
    }

    // map mtime deltas to a boolean to determine whether to update the workingDataset
    const { status } = workingDataset
    const { status: prevStatus } = prevProps.data.workingDataset

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
    shell.openItem(this.props.data.workingDataset.fsiPath)
  }

  publishUnpublishDataset () {
    const { data, setModal } = this.props
    const { published } = data.workingDataset

    published
      ? setModal({ type: ModalType.UnpublishDataset })
      : setModal({ type: ModalType.PublishDataset })
  }

  render () {
    const {
      data,

      selections,
      hasDatasets,
      sidebarWidth,
      session,
      details,

      setModal,
      setActiveTab,
      setCommit,
      setComponent,
      setDetailsBar,

      fetchHistory,
      fetchBody,
      fetchCommitBody,

      discardChanges,
      renameDataset,
      fsiWrite
    } = this.props
    const { peername: username } = session
    const {
      peername,
      name,
      activeTab,
      component: selectedComponent
    } = selections

    const datasetSelected = peername !== '' && name !== ''
    const { status, published, fsiPath } = data.workingDataset

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
        selections={selections}
        setModal={setModal}
        setActiveTab={setActiveTab}
        setCommit={setCommit}
        setComponent={setComponent}
        fetchHistory={fetchHistory}
        discardChanges={discardChanges}
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
          onClick={() => { setModal({ type: ModalType.LinkDataset }) }}
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
              in={datasetSelected && (activeTab === 'status') && !isLinked && !data.workingDataset.isLoading}
              classNames='fade'
              timeout={300}
              mountOnEnter
              unmountOnExit
            >
              <UnlinkedDataset setModal={setModal} inNamespace={username === peername}/>
            </CSSTransition>
            <CSSTransition
              in={datasetSelected && activeTab === 'status' && isLinked}
              classNames='fade'
              timeout={300}
              mountOnEnter
              unmountOnExit
            >
              <DatasetComponent
                details={details}
                data={data.workingDataset}
                setDetailsBar={setDetailsBar}
                fetchBody={fetchBody}
                fsiWrite={fsiWrite}
                component={selectedComponent}
                componentStatus={status[selectedComponent]}
                isLoading={data.workingDataset.isLoading}
                fsiPath={this.props.data.workingDataset.fsiPath}
              />
            </CSSTransition>
            <CSSTransition
              in={datasetSelected && activeTab === 'history'}
              classNames='fade'
              timeout={300}
              mountOnEnter
              unmountOnExit
            >
              <CommitDetails
                data={data.head}
                details={details}
                setDetailsBar={setDetailsBar}
                fetchCommitBody={fetchCommitBody}
                fsiWrite={fsiWrite}
                selections={selections}
                setComponent={setComponent}
              />
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

export default Workbench
