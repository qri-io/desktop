import * as React from 'react'
import { Action, bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import path from 'path'
import { useLocation, Switch, useRouteMatch, Redirect, Route, RouteComponentProps, withRouter } from 'react-router-dom'

import { ApiActionThunk } from '../../store/api'
import Store, { StatusInfo, SelectedComponent, ToastType } from '../../models/store'
import Dataset from '../../models/dataset'
import { QriRef, qriRefFromRoute } from '../../models/qriRef'

import { openToast, closeToast } from '../../actions/ui'
import { writeDataset } from '../../actions/workbench'

import { selectWorkingDatasetIsLoading, selectWorkingDataset, selectSelectedComponent, selectStatusFromMutations, selectHistoryStatus, selectFsiPath, selectHistoryDatasetIsLoading, selectSelectedCommitComponent } from '../../selections'

import Body from './Body'
import { getComponentDisplayProps } from './WorkingComponentList'
import CalloutBlock from '../chrome/CalloutBlock'
import CommitEditor from './CommitEditor'
import Commit from './Commit'
import DropZone from '../chrome/DropZone'
import Icon from '../chrome/Icon'
import Metadata from './Metadata'
import MetadataEditor from './MetadataEditor'
import ReadmeEditor from './ReadmeEditor'
import Readme from './Readme'
import ParseError from './ParseError'
import StatusDot from '../chrome/StatusDot'
import Structure from '../Structure'
import Transform from './Transform'
import StructureEditor from './StructureEditor'

interface ComponentRouterProps extends RouteComponentProps {
  // setting actions
  openToast: (type: ToastType, name: string, message: string) => Action
  closeToast: () => Action
  write: (peername: string, name: string, dataset: Dataset) => ApiActionThunk | void

  isLoading: boolean
  component: SelectedComponent
  statusInfo: StatusInfo
  fsiPath?: string
  bodyPath?: string

  qriRef: QriRef
}

export const ComponentRouterComponent: React.FunctionComponent<ComponentRouterProps> = (props) => {
  const {
    component: selectedComponent,
    statusInfo,
    fsiPath,
    bodyPath,
    write,
    openToast,
    closeToast,
    qriRef
  } = props

  const showHistory = !!qriRef.path
  const username = qriRef.username || ''
  const name = qriRef.name || ''

  const hasParseError = statusInfo && statusInfo.status === 'parse error'
  const component = selectedComponent || 'meta'
  const { displayName, icon, tooltip } = getComponentDisplayProps(component)

  const [dragging, setDragging] = React.useState(false)

  const location = useLocation()
  const { path: routePath, url } = useRouteMatch()

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
      <div className='component-content transition-group' onDragEnter={dragHandler(true)}>
        <TransitionGroup component={null}>
          <CSSTransition
            key={location.key}
            classNames='fade'
            component='div'
            timeout={300}
            mountOnEnter
            unmountOnExit
            appear={true}
          >
            <Switch location={location}>
              <Route exact path={routePath}>
                { routePath.includes('/edit')
                  ? <Redirect to={`${url}/readme`} />
                  : <Redirect to={`${url}/commit`} />
                }
              </Route>
              <Route path={`${routePath}/meta`} render={(props) => {
                if (routePath.includes('/edit')) {
                  if (hasParseError) {
                    return <ParseError fsiPath={fsiPath || ''} filename={statusInfo && statusInfo.filepath} component={component} />
                  }
                  return <MetadataEditor {...props} />
                }
                return <Metadata {...props} />
              }}>
              </Route>
              <Route path={`${routePath}/readme`} render={(props) => {
                if (routePath.includes('/edit')) {
                  if (hasParseError) {
                    return <ParseError fsiPath={fsiPath || ''} filename={statusInfo && statusInfo.filepath} component={component} />
                  }
                  return <ReadmeEditor {...props} />
                }
                return <Readme {...props} />
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
                  {routePath.includes('/edit') && bodyPath && <CalloutBlock
                    type='info'
                    text={`body will be replaced with file: ${bodyPath} when you commit`}
                    cancelText='unstage file'
                    onCancel={() => { write(username, name, { bodyPath: '' }) }}
                  />}
                  { hasParseError
                    ? <ParseError fsiPath={fsiPath || ''} filename={statusInfo && statusInfo.filepath} component={component} />
                    : <Body {...props} />
                  }
                </>
              }}>
              </Route>
              <Route path={`${routePath}/structure`} render={(props) => {
                if (routePath.includes('/edit')) {
                  if (hasParseError) {
                    return <ParseError fsiPath={fsiPath || ''} filename={statusInfo && statusInfo.filepath} component={component} />
                  }
                  return <StructureEditor {...props} />
                }
                return <Structure {...props} />
              }
              }>
              </Route>
              <Route path={`${routePath}/transform`} render={(props) => {
                if (hasParseError) {
                  return <ParseError fsiPath={fsiPath || ''} filename={statusInfo && statusInfo.filepath} component={component} />
                }
                return <Transform {...props} />
              }
              }>
              </Route>
              <Route path={`${routePath}/commit`} render={(props) => {
                if (routePath.includes('/edit')) {
                  if (hasParseError) {
                    return <ParseError fsiPath={fsiPath || ''} filename={statusInfo && statusInfo.filepath} component={component} />
                  }
                  return <CommitEditor {...props} />
                }
                return <Commit {...props} />
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

const mapStateToProps = (state: Store, ownProps: ComponentRouterProps) => {
  const qriRef = qriRefFromRoute(ownProps)
  const showHistory = !!qriRef.path
  const selectedComponent = showHistory ? selectSelectedCommitComponent(state) : selectSelectedComponent(state)
  const status = showHistory ? selectHistoryStatus(state) : selectStatusFromMutations(state)
  return {
    isLoading: showHistory ? selectWorkingDatasetIsLoading(state) : selectHistoryDatasetIsLoading(state),
    component: selectedComponent,
    statusInfo: status[selectedComponent],
    fsiPath: selectFsiPath(state),
    bodyPath: showHistory ? selectWorkingDataset(state).bodyPath : '',
    qriRef
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    openToast,
    closeToast,
    write: writeDataset
  }, dispatch)
}

const mergeProps = (props: any, actions: any): ComponentRouterProps => {
  return { ...props, ...actions }
}
// TODO (b5) - this component doesn't need to be a container. Just feed it the right data
export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(ComponentRouterComponent))
