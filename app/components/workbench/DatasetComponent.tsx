import * as React from 'react'
import { Action, bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import path from 'path'
import { CSSTransition } from 'react-transition-group'

import { openToast, closeToast } from '../../actions/ui'
import Store, { StatusInfo, SelectedComponent, ToastType } from '../../models/store'
import Dataset from '../../models/dataset'
import { ApiActionThunk } from '../../store/api'
import { getComponentDisplayProps } from '../ComponentList'
import { ToastTypes } from '../chrome/Toast'
import { writeDataset } from '../../actions/workbench'
import { selectWorkingDatasetIsLoading, selectOnHistoryTab, selectWorkingDataset, selectSelectedComponent, selectStatusFromMutations, selectHistoryStatus, selectFsiPath, selectHistoryDatasetIsLoading, selectSelectedCommitComponent, selectWorkingDatasetPeername, selectHistoryDatasetPeername, selectWorkingDatasetName, selectHistoryDatasetName } from '../../selections'

import Body from './Body'
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
import SpinnerWithIcon from '../chrome/SpinnerWithIcon'
import Transform from './Transform'
import StructureEditor from './StructureEditor'

interface DatasetComponentProps {
  // setting actions
  openToast: (type: ToastType, name: string, message: string) => Action
  closeToast: () => Action
  write: (peername: string, name: string, dataset: Dataset) => ApiActionThunk | void

  isLoading: boolean
  component: SelectedComponent
  statusInfo: StatusInfo
  history?: boolean
  fsiPath?: string
  bodyPath?: string
  peername: string
  name: string
}

export const DatasetComponent: React.FunctionComponent<DatasetComponentProps> = (props) => {
  const {
    component: selectedComponent,
    statusInfo,
    isLoading,
    history = false,
    fsiPath,
    bodyPath,
    write,
    openToast,
    closeToast,
    peername,
    name
  } = props

  const hasParseError = statusInfo && statusInfo.status === 'parse error'
  const component = selectedComponent || 'meta'
  const { displayName, icon, tooltip } = getComponentDisplayProps(component)

  const [dragging, setDragging] = React.useState(false)

  const dragHandler = (drag: boolean) => (e: React.DragEvent) => {
    if (history) {
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

    write(peername, name, { bodyPath: e.dataTransfer.files[0].path })
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
      <div className='component-content transition-group'>
        <CSSTransition
          in={!!statusInfo && hasParseError}
          classNames='fade'
          component='div'
          timeout={300}
          mountOnEnter
          unmountOnExit
          appear={true}
        >
          <div className='transition-wrap'>
            <ParseError fsiPath={fsiPath || ''} filename={statusInfo && statusInfo.filepath} component={component} />
          </div>
        </CSSTransition>
        <CSSTransition
          in={(component === 'readme') && !isLoading && !hasParseError}
          classNames='fade'
          component='div'
          timeout={300}
          mountOnEnter
          unmountOnExit
          appear={true}
        >
          <div className='transition-wrap'>
            {history
              ? <Readme />
              : <ReadmeEditor />}
          </div>
        </CSSTransition>
        <CSSTransition
          in={(component === 'meta') && !isLoading && !hasParseError}
          classNames='fade'
          component='div'
          timeout={300}
          mountOnEnter
          unmountOnExit
          appear={true}
        >
          <div className='transition-wrap'>
            {
              history
                ? <Metadata />
                : <MetadataEditor />
            }
          </div>
        </CSSTransition>
        <CSSTransition
          in={component === 'body' && !isLoading && !hasParseError}
          classNames='fade'
          component='div'
          timeout={300}
          mountOnEnter
          unmountOnExit
          appear={true}
        >
          <div className='transition-wrap'
            onDragEnter={dragHandler(true)}
          >
            {dragging && fsiPath === '' && <DropZone
              title='Drop a body update'
              subtitle='import either csv or json file'
              setDragging={setDragging}
              onDrop={dropHandler}
            />}
            {!history && bodyPath && <CalloutBlock
              type='info'
              text={`body will be replaced with file: ${bodyPath} when you commit`}
              cancelText='unstage file'
              onCancel={() => { write(peername, name, { bodyPath: '' }) }}
            />}
            <Body />
          </div>
        </CSSTransition>
        <CSSTransition
          in={component === 'structure' && !isLoading && !hasParseError}
          classNames='fade'
          component='div'
          timeout={300}
          mountOnEnter
          unmountOnExit
          appear={true}
        >
          <div className='transition-wrap'>
            {
              history
                ? <Structure />
                : <StructureEditor />
            }
          </div>
        </CSSTransition>
        <CSSTransition
          in={(component === 'transform') && !isLoading && !hasParseError}
          classNames='fade'
          component='div'
          timeout={300}
          mountOnEnter
          unmountOnExit
          appear={true}
        >
          <div className='transition-wrap'>
            <Transform />
          </div>
        </CSSTransition>
        <CSSTransition
          in={(component === 'commit') && !isLoading && !hasParseError}
          classNames='fade'
          component='div'
          timeout={300}
          mountOnEnter
          unmountOnExit
          appear={true}
        >
          <div className='transition-wrap'>
            {
              history
                ? <Commit />
                : <CommitEditor />
            }
          </div>
        </CSSTransition>
        <SpinnerWithIcon loading={isLoading}/>
      </div>
    </div>
  )
}

const mapStateToProps = (state: Store, ownProps: DatasetComponentProps) => {
  const history = selectOnHistoryTab(state)
  const selectedComponent = history ? selectSelectedCommitComponent(state) : selectSelectedComponent(state)
  const status = history ? selectHistoryStatus(state) : selectStatusFromMutations(state)
  return {
    isLoading: history ? selectWorkingDatasetIsLoading(state) : selectHistoryDatasetIsLoading(state),
    history,
    component: selectedComponent,
    statusInfo: status[selectedComponent],
    fsiPath: selectFsiPath(state),
    bodyPath: history ? selectWorkingDataset(state).bodyPath : '',
    peername: history ? selectHistoryDatasetPeername(state) : selectWorkingDatasetPeername(state),
    name: history ? selectHistoryDatasetName(state) : selectWorkingDatasetName(state)

  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    openToast,
    closeToast,
    write: writeDataset
  }, dispatch)
}

const mergeProps = (props: any, actions: any): DatasetComponentProps => {
  return { ...props, ...actions }
}
// TODO (b5) - this component doesn't need to be a container. Just feed it the right data
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(DatasetComponent)
