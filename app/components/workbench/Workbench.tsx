import * as React from 'react'
import { Action, Dispatch, bindActionCreators } from 'redux'
import { ipcRenderer, shell, clipboard } from 'electron'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen, faFile, faLink, faCloud, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'
import { RouteComponentProps, Prompt, Switch, Route, useLocation, useRouteMatch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import { QRI_CLOUD_URL } from '../../constants'
import { Details } from '../../models/details'
import { Session } from '../../models/session'
import { SelectedComponent } from '../../models/store'
import { Modal, ModalType } from '../../models/modals'
import { QriRef, qriRefFromRoute } from '../../models/qriRef'
import { ApiActionThunk, LaunchedFetchesAction } from '../../store/api'

import { setModal, setSidebarWidth } from '../../actions/ui'
import { setActiveTab } from '../../actions/selections'
import { resetMutationsDataset, discardMutationsChanges, resetMutationsStatus } from '../../actions/mutations'
import { fetchWorkbench } from '../../actions/workbench'
import { discardChanges, fetchWorkingDatasetDetails } from '../../actions/api'

import { selectHistory, selectFsiPath, selectDetails, selectWorkingDatasetIsPublished, selectSessionUsername, selectMyDatasets, selectSidebarWidth, selectShowDetailsBar, selectMutationsIsDirty } from '../../selections'

import { defaultSidebarWidth } from '../../reducers/ui'

import { Resizable } from '../Resizable'
import Layout from '../Layout'
import ComponentRouter from './ComponentRouter'
import NoDatasetSelected from './NoDatasetSelected'
import HeaderColumnButton from '../chrome/HeaderColumnButton'
import Hamburger from '../chrome/Hamburger'
import WorkbenchSidebar from './WorkbenchSidebar'
import DetailsBarContainer from '../../containers/DetailsBarContainer'
import CommitDetails from './CommitDetails'
import NoDatasets from '../NoDatasets'
// import NotInNamespace from './NotInNamespace'

// TODO (b5) - is this still required?
require('../../assets/qri-blob-logo-tiny.png')

export interface WorkbenchProps extends RouteComponentProps<QriRef> {
  // display details
  qriRef: QriRef
  isPublished: boolean
  // if latestPath is the empty string, this dataset does not have a history
  latestPath: string
  fsiPath: string
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
  resetMutationsDataset: () => Action
  resetMutationsStatus: () => Action

  // fetching actions
  fetchWorkbench: () => LaunchedFetchesAction
  fetchWorkingDatasetDetails: () => ApiActionThunk

  // api actions (that aren't fetching)
  discardChanges: (component: SelectedComponent) => ApiActionThunk
  discardMutationsChanges: (component: SelectedComponent) => Action
}

export class WorkbenchComponent extends React.Component<WorkbenchProps> {
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
    clipboard.writeText(`${QRI_CLOUD_URL}/${this.props.qriRef.username}/${this.props.qriRef.name}`)
  }

  async componentDidUpdate (prevProps: WorkbenchProps) {
    if (prevProps.qriRef.location !== this.props.qriRef.location) {
      // TODO (b5) - this was bailing early when fetch happened
      this.props.fetchWorkbench()
    }
  }

  openWorkingDirectory () {
    shell.openItem(this.props.fsiPath)
  }

  publishUnpublishDataset () {
    const { isPublished, setModal } = this.props

    isPublished
      ? setModal({
        type: ModalType.UnpublishDataset,
        username: this.props.qriRef.username,
        name: this.props.qriRef.name
      })
      : setModal({
        type: ModalType.PublishDataset,
        username: this.props.qriRef.username,
        name: this.props.qriRef.name
      })
  }

  handleDiscardChanges (component: SelectedComponent) {
    if (this.props.fsiPath !== '') {
      this.props.discardChanges(component)
      this.props.discardMutationsChanges(component)
      return
    }
    this.props.discardMutationsChanges(component)
  }

  render () {
    const {
      qriRef,
      isPublished,
      hasDatasets,
      sidebarWidth,
      modified = false,
      inNamespace,
      fsiPath,
      latestPath,

      setModal
    } = this.props

    const username = qriRef.username || ''
    const name = qriRef.name || ''
    // const activeTab = qriRef.path ? 'history' : 'status'

    const datasetSelected = username !== '' && name !== ''

    // isLinked is derived from fsiPath and only used locally
    const isLinked = fsiPath !== ''

    // actions
    const {
      setSidebarWidth,
      showDetailsBar
    } = this.props

    // const sidebarContent = (
    //   <WorkbenchSidebar qriRef={qriRef} />
    // )

    let linkButton
    if (datasetSelected) {
      linkButton = isLinked ? (
        <HeaderColumnButton
          id='show-files'
          icon={faFolderOpen}
          label='Show Files'
          onClick={this.openWorkingDirectory}
        />) : inNamespace && (
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
          onClick={() => { setModal({ type: ModalType.LinkDataset, username, name, modified }) }}
        />)
    }

    let publishButton
    if (inNamespace && datasetSelected) {
      publishButton = isPublished ? (
        <><HeaderColumnButton
          id='view-in-cloud'
          onClick={() => { shell.openExternal(`${QRI_CLOUD_URL}/${username}/${name}`) }}
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
            onClick: () => setModal({
              type: ModalType.UnpublishDataset,
              username: this.props.qriRef.username,
              name: this.props.qriRef.name
            })
          }
        ]} />
        </>
      ) : (
        <span data-tip={
          latestPath === ''
            ? 'The dataset must have at least one commit before you can publish'
            : 'Publish this dataset to Qri Cloud'
        }>
          <HeaderColumnButton
            id='publish-button'
            label='Publish'
            icon={faCloudUploadAlt}
            disabled={latestPath === ''}
            onClick={() => {
              setModal({
                type: ModalType.PublishDataset,
                username: this.props.qriRef.username || '',
                name: this.props.qriRef.name || ''
              })
            }}
          />
        </span>
      )
    }

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
        <WorkbenchRouter
          qriRef={qriRef}
          sidebarWidth={sidebarWidth}
          setModal={setModal}
          hasDatasets={hasDatasets}
          fetchWorkingDatasetDetails={fetchWorkingDatasetDetails}
          fsiPath={fsiPath}
          modified={modified}
          linkButton={linkButton}
          publishButton={publishButton}
          latestPath={latestPath}
        />
      </>
    )
  }
}

interface WorkbenchRouterProps {
  qriRef: QriRef
  sidebarWidth: number
  hasDatasets: boolean
  setModal: (modal: Modal) => void
  fsiPath: string
  fetchWorkingDatasetDetails: () => ApiActionThunk
  linkButton: boolean | JSX.Element | undefined
  publishButton: boolean | JSX.Element | undefined
  modified: boolean
  latestPath: string
}

const WorkbenchRouter: React.FunctionComponent<WorkbenchRouterProps> = (props) => {
  const { sidebarWidth, latestPath, modified, hasDatasets, setModal, fsiPath, linkButton, publishButton } = props
  const location = useLocation()
  const { path } = useRouteMatch()

  const wrap = <><Prompt when={modified} message={(location) => {
    if (location.pathname.includes('workbench')) return false
    if (fsiPath !== '') {
      fetchWorkingDatasetDetails()
      return true
    }
    return `You have uncommited changes! Click 'cancel' and commit these changes before you navigate away or you will lose your work.`
  }}/>
  <div className='main-content-header'>
    {linkButton}
    {publishButton}
  </div>
  </>

  return (
    <TransitionGroup component={null}>
      {/*
      This is no different than other usage of
      <CSSTransition>, just make sure to pass
      `location` to `Switch` so it can match
      the old location as it animates out.
    */}
      <CSSTransition
        id='workbench-router-transition'
        key={location.key}
        classNames="fade"
        timeout={300}
      >
        <Switch location={location}>
          <Route exact path={path} render={() => {
            return (
              <Layout
                id='dataset-container'
                sidebarContent={<WorkbenchSidebar />}
                sidebarWidth={sidebarWidth}
                onSidebarResize={(width) => { setSidebarWidth('dataset', width) }}
                maximumSidebarWidth={495}
                mainContent={<>{wrap}{hasDatasets ? <NoDatasetSelected /> : <NoDatasets setModal={setModal} />}</>}
              />
            )
          } }/>
          <Route path={`${path}/edit/:username/:name`} render={() => {
            return (
              <Layout
                id='dataset-container'
                sidebarContent={<WorkbenchSidebar />}
                sidebarWidth={sidebarWidth}
                onSidebarResize={(width) => { setSidebarWidth('dataset', width) }}
                maximumSidebarWidth={495}
                mainContent={<>{wrap}{hasDatasets ? <ComponentRouter /> : <NoDatasets setModal={setModal} />}</>}
              />
            )
          } }/>
          <Route path={`${path}/:username/:name/at/ipfs/:path`} render={(props) => {
            console.log('workbench in route')
            console.log(props)
            return (
              <Layout
                id='dataset-container'
                sidebarContent={<WorkbenchSidebar />}
                sidebarWidth={sidebarWidth}
                onSidebarResize={(width) => { setSidebarWidth('dataset', width) }}
                maximumSidebarWidth={495}
                mainContent={<>{wrap}{hasDatasets ? <CommitDetails /> : <NoDatasets setModal={setModal} />}</>}
              />
            )
          } }/>
          <Route path={`${path}/:username/:name`} render={({ match }) => {
            const { params } = match
            if (latestPath === '') {
              return <Redirect
                to={`/workbench/edit/${params.username}/${params.name}`}
              />
            }
            return <Redirect
              to={`/workbench/${params.username}/${params.name}/at${latestPath}`}
            />
          }}/>
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  )
}

const mapStateToProps = (state: any, ownProps: WorkbenchProps) => {
  const qriRef = qriRefFromRoute(ownProps)
  const versions = selectHistory(state)
  return {
    qriRef,
    /**
     * TODO (ramfox): when we have a more sophisticated view of publish/unpublish
     * we should pull the published status of the specific version being shown
     * rather then the status of the dataset at head.
     */
    isPublished: selectWorkingDatasetIsPublished(state),
    latestPath: versions.value.length !== 0 ? versions.value[0].path : '',
    fsiPath: selectFsiPath(state),
    hasDatasets: selectMyDatasets(state).length,
    showDetailsBar: selectShowDetailsBar(state),
    sidebarWidth: selectSidebarWidth(state, 'workbench'),
    details: selectDetails(state),
    inNamespace: selectSessionUsername(state) === qriRef.username,
    modified: selectMutationsIsDirty(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    setModal,
    setActiveTab,
    setSidebarWidth,
    resetMutationsDataset,
    resetMutationsStatus,
    fetchWorkbench,
    fetchWorkingDatasetDetails,
    discardChanges,
    discardMutationsChanges
  }, dispatch)
}

const mergeProps = (props: any, actions: any): WorkbenchProps => {
  return { ...props, ...actions }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(WorkbenchComponent)
