import * as React from 'react'
import { Action } from 'redux'
import { ipcRenderer, shell } from 'electron'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Switch, Route, useLocation, useRouteMatch, Redirect } from 'react-router-dom'

import { RouteProps, VersionInfo } from '../../models/store'
import { Modal, ModalType } from '../../models/modals'
import { QriRef, qriRefFromRoute } from '../../models/qriRef'

import { setModal, setSidebarWidth } from '../../actions/ui'

import {
  selectFsiPath,
  selectWorkingDatasetIsPublished,
  selectSessionUsername,
  selectShowDetailsBar,
  selectSidebarWidth,
  selectHasDatasets,
  selectLogLatestVersion
} from '../../selections'

import { defaultSidebarWidth } from '../../reducers/ui'

import { Resizable } from '../Resizable'
import DetailsBar from '../DetailsBar'
import Dataset from './Dataset'
import { pathToNoDatasetSelected, pathToEdit, pathToDataset, pathToCollection } from '../../paths'
import CollectionHome from './collectionHome/CollectionHome'

import EditDataset from './EditDataset'
import { connectComponentToProps } from '../../utils/connectComponentToProps'

// TODO (b5) - is this still required?
require('../../assets/qri-blob-logo-tiny.png')

export interface CollectionProps extends RouteProps {
  // display details
  qriRef: QriRef
  isPublished: boolean
  fsiPath: string
  hasDatasets: boolean
  showDetailsBar: boolean
  sidebarWidth: number
  latestVersion: VersionInfo
  inNamespace: boolean

  // setting actions
  setModal: (modal: Modal) => void
  setSidebarWidth: (type: string, sidebarWidth: number) => Action
}

export class CollectionComponent extends React.Component<CollectionProps> {
  constructor (props: CollectionProps) {
    super(props);

    [
      'openWorkingDirectory',
      'publishUnpublishDataset'
    ].forEach((m) => { this[m] = this[m].bind(this) })
  }

  componentDidMount () {
    // electron menu events
    ipcRenderer.on('open-working-directory', this.openWorkingDirectory)
    ipcRenderer.on('publish-unpublish-dataset', this.publishUnpublishDataset)
  }

  componentWillUnmount () {
    ipcRenderer.removeListener('open-working-directory', this.openWorkingDirectory)
    ipcRenderer.removeListener('publish-unpublish-dataset', this.publishUnpublishDataset)
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
      sidebarWidth,
      inNamespace,
      latestVersion
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
        <CollectionRouter
          qriRef={qriRef}
          hasDatasets={hasDatasets}
          latestVersion={latestVersion}
          inNamespace={inNamespace}
        />
      </>
    )
  }
}

interface CollectionRouterProps {
  qriRef: QriRef
  hasDatasets: boolean
  latestVersion?: VersionInfo
  inNamespace: boolean
}

const CollectionRouter: React.FunctionComponent<CollectionRouterProps> = (props) => {
  const { hasDatasets, latestVersion, inNamespace } = props
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
            ipcRenderer.send('show-dataset-menu', false)
            return <CollectionHome />
          }} />
          <Route path={`${path}/edit/:username/:name`} render={() => {
            ipcRenderer.send('show-dataset-menu', true)
            return noDatasetsRedirect(
              <EditDataset />
            )
          }}/>
          <Route path={`${path}/:username/:name/at/ipfs/:path`} render={(props) => {
            ipcRenderer.send('show-dataset-menu', true)
            return noDatasetsRedirect(
              <Dataset {...props} />
            )
          } }/>
          <Route path={`${path}/:username/:name`} render={({ match }) => {
            const { params } = match
            if (!inNamespace) {
              if (latestVersion) {
                return <Redirect
                  to={pathToDataset(params.username, params.name, latestVersion.path)}
                />
              } else {
                return <Redirect
                  to={pathToCollection()}
                />
              }
            }
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
  CollectionComponent,
  (state: any, ownProps: CollectionProps) => {
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
      inNamespace: selectSessionUsername(state) === qriRef.username,
      latestVersion: selectLogLatestVersion(state),
      ...ownProps
    }
  },
  {
    setModal,
    setSidebarWidth
  }
)
