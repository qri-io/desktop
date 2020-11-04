import React from 'react'
import { Action } from 'redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Switch, Route, useLocation, useRouteMatch, Redirect } from 'react-router-dom'

import {
  showDatasetMenu
} from './platformSpecific/Collection.TARGET_PLATFORM'

import { RouteProps, VersionInfo } from '../../models/store'
import { QriRef, qriRefFromRoute } from '../../models/qriRef'

import { setSidebarWidth } from '../../actions/ui'

import {
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

export interface CollectionProps extends RouteProps {
  // display details
  qriRef: QriRef
  hasDatasets: boolean
  showDetailsBar: boolean
  sidebarWidth: number
  latestVersion: VersionInfo
  sessionUsername: string

  // setting actions
  setSidebarWidth: (type: string, sidebarWidth: number) => Action
}

export class CollectionComponent extends React.Component<CollectionProps> {
  render () {
    const {
      qriRef,
      hasDatasets,
      sidebarWidth,
      sessionUsername,
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
          sessionUsername={sessionUsername}
        />
      </>
    )
  }
}

interface CollectionRouterProps {
  qriRef: QriRef
  hasDatasets: boolean
  latestVersion?: VersionInfo
  sessionUsername: string
}

const CollectionRouter: React.FunctionComponent<CollectionRouterProps> = (props) => {
  const { hasDatasets, latestVersion, sessionUsername } = props
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
            showDatasetMenu(false)
            return <CollectionHome />
          }} />
          {!__BUILD__.REMOTE && <Route path={`${path}/edit/:username/:name`} render={() => {
            showDatasetMenu(true)
            return noDatasetsRedirect(
              <EditDataset />
            )
          }}/>}
          <Route path={`${path}/:username/:name/at/ipfs/:path`} render={(props) => {
            showDatasetMenu(true)
            return noDatasetsRedirect(
              <Dataset {...props} />
            )
          } }/>
          <Route path={`${path}/:username/:name`} render={({ match }) => {
            const { params } = match
            if (sessionUsername !== params.username) {
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
            return __BUILD__.REMOTE
              ? <Redirect to={pathToCollection()}/>
              : <Redirect
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
      hasDatasets: selectHasDatasets(state),
      showDetailsBar: selectShowDetailsBar(state),
      sidebarWidth: selectSidebarWidth(state, 'workbench'),
      sessionUsername: selectSessionUsername(state),
      latestVersion: selectLogLatestVersion(state),
      ...ownProps
    }
  },
  {
    setSidebarWidth
  }
)
