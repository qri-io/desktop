import * as React from 'react'
import { Action, bindActionCreators, Dispatch } from 'redux'
import { connect, useSelector } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import path from 'path'
import { useLocation, Switch, useRouteMatch, Redirect, Route, withRouter } from 'react-router-dom'

import { ApiActionThunk } from '../../store/api'
import Store, { SelectedComponent, ToastType, RouteProps } from '../../models/store'
import Dataset from '../../models/dataset'
import { QriRef, qriRefFromRoute } from '../../models/qriRef'
import { isEditPath } from '../../paths'

import { openToast, closeToast } from '../../actions/ui'
import { writeDataset } from '../../actions/workbench'
import { setRecentEditRef, setRecentHistoryRef } from '../../actions/workbenchRoutes'

import { selectWorkingDatasetIsLoading, selectWorkingDataset, selectFsiPath, selectHistoryDatasetIsLoading, selectHistoryStatusInfo, selectStatusInfoFromMutations } from '../../selections'

import Body from './components/Body'
import CalloutBlock from '../chrome/CalloutBlock'
import CommitEditor from './components/CommitEditor'
import Commit from './components/Commit'
import DropZone from '../chrome/DropZone'
import Icon from '../chrome/Icon'
import Metadata from './components/Metadata'
import MetadataEditor from './components/MetadataEditor'
import ReadmeEditor from './components/ReadmeEditor'
import Readme from './components/Readme'
import Structure from '../Structure'
import Transform from './components/Transform'
import StructureEditor from './components/StructureEditor'
import StatusDot from '../chrome/StatusDot'
import { getComponentDisplayProps } from './WorkingComponentList'

interface ComponentRouterProps extends RouteProps {
  // setting actions
  openToast: (type: ToastType, name: string, message: string) => Action
  closeToast: () => Action
  write: (peername: string, name: string, dataset: Dataset) => ApiActionThunk | void
  setRecentHistoryRef: (qriRef: QriRef) => Action
  setRecentEditRef: (qriRef: QriRef) => Action

  isLoading: boolean
  component: SelectedComponent
  fsiPath?: string
  bodyPath?: string

  qriRef: QriRef
}

export const ComponentRouterComponent: React.FunctionComponent<ComponentRouterProps> = (props) => {
  const {
    fsiPath,
    bodyPath,
    write,
    openToast,
    closeToast,
    setRecentHistoryRef,
    setRecentEditRef,
    qriRef
  } = props

  const showHistory = !!qriRef.path
  const username = qriRef.username || ''
  const name = qriRef.name || ''

  const [dragging, setDragging] = React.useState(false)

  const location = useLocation()
  const { path: routePath, url } = useRouteMatch()

  React.useEffect(() => {
    if (isEditPath(routePath)) {
      setRecentEditRef(qriRef)
    } else {
      setRecentHistoryRef(qriRef)
    }
  }, [qriRef.location])

  const dragHandler = (drag: boolean) => (e: React.DragEvent) => {
    if (showHistory) {
      return
    }
    e.preventDefault()
    setDragging(drag)
  }

  const dropHandler = (e: React.DragEvent) => {
    setDragging(false)
    e.preventDefault()
    const ext = path.extname(e.dataTransfer.files[0].path)
    if (!(ext === '.csv' || ext === '.json')) {
      // open toast for 1 second
      openToast(ToastTypes.error, 'drag-drop', 'unsupported file format: only json and csv supported')
      setTimeout(closeToast, 1000)
      return
    }

    write(username, name, { bodyPath: e.dataTransfer.files[0].path })
  }

  return (
    <div className='component-container'>
      <div className='component-content transition-group' onDragEnter={dragHandler(true)}>
        <TransitionGroup component={null}>
          <CSSTransition
            key={location.key}
            classNames='fade'
            component='div'
            timeout={300}
          >
            <Switch location={location}>
              <Route exact path={routePath}>
                <Redirect to={`${url}/body`} />
              </Route>
              <Route path={`${routePath}/meta`} render={(props) => {
                if (isEditPath(routePath)) {
                  return <><ComponentHeader {...props} /><MetadataEditor {...props} /></>
                }
                return <><ComponentHeader {...props} /><Metadata {...props} /></>
              }}>
              </Route>
              <Route path={`${routePath}/readme`} render={(props) => {
                if (isEditPath(routePath)) {
                  return <><ComponentHeader {...props} /><ReadmeEditor {...props} /></>
                }
                return <><ComponentHeader {...props} /><Readme {...props} /></>
              }
              }>
              </Route>
              <Route path={`${routePath}/body`} render={(props) => {
                return <>
                  {dragging && fsiPath === '' && <DropZone
                    title='Drop a body update'
                    subtitle='import either csv or json file'
                    setDragging={setDragging}
                    onDrop={dropHandler}
                  />}
                  {isEditPath(routePath) && bodyPath && <CalloutBlock
                    type='info'
                    text={`body will be replaced with file: ${bodyPath} when you commit`}
                    cancelText='unstage file'
                    onCancel={() => { write(username, name, { bodyPath: '' }) }}
                  />}
                  <><ComponentHeader {...props} /><Body {...props} /></>
                </>
              }}>
              </Route>
              <Route path={`${routePath}/structure`} render={(props) => {
                if (isEditPath(routePath)) {
                  return <><ComponentHeader {...props} /><StructureEditor {...props} /></>
                }
                return <><ComponentHeader {...props} /><Structure {...props} /></>
              }
              }>
              </Route>
              <Route path={`${routePath}/transform`} render={(props) => {
                return <><ComponentHeader {...props} /><Transform {...props} /></>
              }
              }>
              </Route>
              <Route path={`${routePath}/commit`} render={(props) => {
                if (isEditPath(routePath)) {
                  return <><ComponentHeader {...props} /><CommitEditor {...props} /></>
                }
                return <><ComponentHeader {...props} /><Commit {...props} /></>
              }
              }>
              </Route>
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
  )
}

const ComponentHeader: React.FunctionComponent<RouteProps> = (props) => {
  const qriRef = qriRefFromRoute(props)
  const { component = '' } = qriRef
  const { path: routePath } = useRouteMatch()
  const statusInfo = useSelector((state: Store) => {
    if (isEditPath(routePath)) {
      return selectStatusInfoFromMutations(state, component as SelectedComponent)
    } else {
      return selectHistoryStatusInfo(state, component as SelectedComponent)
    }
  })
  const { displayName, icon, tooltip } = getComponentDisplayProps(component)
  return (
    <div className='component-header'>
      <div className='component-display-name-container'>
        <div className='component-display-name' data-tip={tooltip}>
          <Icon icon={icon} size='sm'/> {displayName}
        </div>
      </div>
      <div className='status-dot-container'>
        {statusInfo && <StatusDot status={statusInfo.status} />}
      </div>
    </div>
  )
}

const mapStateToProps = (state: Store, ownProps: ComponentRouterProps) => {
  const qriRef = qriRefFromRoute(ownProps)
  const showHistory = !!qriRef.path
  return {
    ...ownProps,
    isLoading: showHistory ? selectWorkingDatasetIsLoading(state) : selectHistoryDatasetIsLoading(state),
    fsiPath: selectFsiPath(state),
    bodyPath: showHistory ? selectWorkingDataset(state).bodyPath : '',
    qriRef
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    openToast,
    closeToast,
    write: writeDataset,
    setRecentEditRef,
    setRecentHistoryRef
  }, dispatch)
}

const mergeProps = (props: any, actions: any): ComponentRouterProps => {
  return { ...props, ...actions }
}
// TODO (b5) - this component doesn't need to be a container. Just feed it the right data
export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(ComponentRouterComponent))
