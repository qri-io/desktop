import * as React from 'react'
import { Action } from 'redux'
import { ipcRenderer, shell } from 'electron'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Switch, Route, useLocation, useRouteMatch, Redirect } from 'react-router-dom'

import { Details } from '../../models/details'
import { Session } from '../../models/session'
import { SelectedComponent, RouteProps } from '../../models/store'
import { Modal, ModalType } from '../../models/modals'
import { QriRef, qriRefFromRoute } from '../../models/qriRef'
import { ApiActionThunk, LaunchedFetchesAction } from '../../store/api'

import { setModal, setSidebarWidth } from '../../actions/ui'
import { setActiveTab } from '../../actions/selections'
import { resetMutationsDataset, discardMutationsChanges, resetMutationsStatus } from '../../actions/mutations'
import { fetchWorkbench } from '../../actions/workbench'
import { discardChangesAndFetch, fetchWorkingDatasetDetails } from '../../actions/api'

import {
  selectFsiPath,
  selectDetails,
  selectWorkingDatasetIsPublished,
  selectSessionUsername,
  selectShowDetailsBar,
  selectMutationsIsDirty,
  selectSidebarWidth,
  selectHasDatasets
} from '../../selections'

import { defaultSidebarWidth } from '../../reducers/ui'

import { Resizable } from '../Resizable'
import DetailsBar from '../DetailsBar'
import Dataset from './Dataset'
import { pathToNoDatasetSelected, pathToEdit } from '../../paths'
import NoDatasets from './NoDatasets'
import EditDataset from './EditDataset'
import { connectComponentToProps } from '../../utils/connectComponentToProps'

// TODO (b5) - is this still required?
require('../../assets/qri-blob-logo-tiny.png')

export interface WorkbenchProps extends RouteProps {
  // display details
  qriRef: QriRef
  isPublished: boolean
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
  fetchWorkbench: (qriRef: QriRef) => LaunchedFetchesAction
  fetchWorkingDatasetDetails: (username: string, name: string) => ApiActionThunk

  // api actions (that aren't fetching)
  discardChangesAndFetch: (username: string, name: string, component: SelectedComponent) => ApiActionThunk
  discardMutationsChanges: (component: SelectedComponent) => Action
}

export class WorkbenchComponent extends React.Component<WorkbenchProps> {
  constructor (props: WorkbenchProps) {
    super(props);

    [
      'openWorkingDirectory',
      'publishUnpublishDataset',
      'handleShowStatus',
      'handleShowHistory'
    ].forEach((m) => { this[m] = this[m].bind(this) })
  }

  componentDidMount () {
    // electron menu events
    ipcRenderer.on('show-status', this.handleShowStatus)
    ipcRenderer.on('show-history', this.handleShowHistory)
    ipcRenderer.on('open-working-directory', this.openWorkingDirectory)
    ipcRenderer.on('publish-unpublish-dataset', this.publishUnpublishDataset)

    this.props.fetchWorkbench(this.props.qriRef)
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

  async componentDidUpdate (prevProps: WorkbenchProps) {
    if (prevProps.qriRef.location !== this.props.qriRef.location) {
      // TODO (b5) - this was bailing early when fetch happened
      this.props.fetchWorkbench(this.props.qriRef)
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

  render () {
    const {
      qriRef,
      hasDatasets,
      sidebarWidth
    } = this.props

    // actions
    const {
      setSidebarWidth,
      showDetailsBar
    } = this.props

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
              onResize={(width) => { setSidebarWidth('workbench', width) }}
              onReset={() => { setSidebarWidth('workbench', defaultSidebarWidth) }}
              maximumWidth={495}
            >
              <DetailsBar />
            </Resizable>
          </div>
        </div>
        <WorkbenchRouter
          qriRef={qriRef}
          hasDatasets={hasDatasets}
        />
      </>
    )
  }
}

interface WorkbenchRouterProps {
  qriRef: QriRef
  hasDatasets: boolean
}

const WorkbenchRouter: React.FunctionComponent<WorkbenchRouterProps> = (props) => {
  const { hasDatasets } = props
  const location = useLocation()
  const { path } = useRouteMatch()

  const noDatasetsRedirect = (component: JSX.Element) => {
    if (!hasDatasets) {
      return <Redirect to={pathToNoDatasetSelected()} />
    } else {
      return component
    }
  }

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        id='workbench-router-transition'
        key={location.key}
        classNames="fade"
        timeout={300}
      >
        <Switch location={location}>
          <Route exact path={path} render={() => {
            return <NoDatasets />
          } }/>
          <Route path={`${path}/edit/:username/:name`} render={() => {
            return noDatasetsRedirect(
              <EditDataset />
            )
          }}/>
          <Route path={`${path}/:username/:name/at/ipfs/:path`} render={(props) => {
            return noDatasetsRedirect(
              <Dataset {...props} />
            )
          } }/>
          <Route path={`${path}/:username/:name`} render={({ match }) => {
            const { params } = match
            return <Redirect
              to={pathToEdit(params.username, params.name)}
            />
          }}/>
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  )
}

export default connectComponentToProps(
  WorkbenchComponent,
  (state: any, ownProps: WorkbenchProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      qriRef,
      /**
       * TODO (ramfox): when we have a more sophisticated view of publish/unpublish
       * we should pull the published status of the specific version being shown
       * rather then the status of the dataset at head.
       */
      isPublished: selectWorkingDatasetIsPublished(state),
      fsiPath: selectFsiPath(state),
      hasDatasets: selectHasDatasets(state),
      showDetailsBar: selectShowDetailsBar(state),
      sidebarWidth: selectSidebarWidth(state, 'workbench'),
      details: selectDetails(state),
      inNamespace: selectSessionUsername(state) === qriRef.username,
      modified: selectMutationsIsDirty(state),
      ...ownProps
    }
  },
  {
    setModal,
    setActiveTab,
    resetMutationsDataset,
    resetMutationsStatus,
    fetchWorkbench,
    setSidebarWidth,
    fetchWorkingDatasetDetails,
    discardChangesAndFetch,
    discardMutationsChanges
  }
)
