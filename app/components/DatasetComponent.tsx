import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import MetadataContainer from '../containers/MetadataContainer'
import MetadataEditorContainer from '../containers/MetadataEditorContainer'
import StructureContainer from '../containers/StructureContainer'
import ParseError from './ParseError'
import ReadmeContainer from '../containers/ReadmeContainer'
import TransformContainer from '../containers/TransformContainer'
import ReadmeHistoryContainer from '../containers/ReadmeHistoryContainer'
import { CSSTransition } from 'react-transition-group'
import SpinnerWithIcon from './chrome/SpinnerWithIcon'
import CommitHistoryContainer from '../containers/CommitHistoryContainer'
import CommitContainer from '../containers/CommitContainer'

import { getComponentDisplayProps, StatusDot } from './ComponentList'

import { ComponentStatus, SelectedComponent, CommitDetails } from '../models/store'
import Body from './Body'
import { Details } from '../models/details'
import { ApiActionThunk } from '../store/api'
import { Action } from 'redux'

interface DatasetComponentProps {
  data: CommitDetails

  // display details
  details: Details

  // seting actions
  setDetailsBar: (details: {[key: string]: any}) => Action

  // fetching api actions
  fetchBody: (page?: number, pageSize?: number) => ApiActionThunk

  isLoading: boolean
  component: SelectedComponent
  componentStatus: ComponentStatus
  history?: boolean
  fsiPath?: string
}

const DatasetComponent: React.FunctionComponent<DatasetComponentProps> = (props: DatasetComponentProps) => {
  const { component: selectedComponent, componentStatus, isLoading, history = false, fsiPath, data, details, setDetailsBar, fetchBody } = props

  const hasParseError = componentStatus && componentStatus.status === 'parse error'
  const component = selectedComponent || 'meta'
  const { displayName, icon, tooltip } = getComponentDisplayProps(component)

  return (
    <div className='component-container'>
      <div className='component-header'>
        <div className='component-display-name-container'>
          <div className='component-display-name' data-tip={tooltip}>
            <FontAwesomeIcon icon={icon} size='sm'/> {displayName}
          </div>
        </div>
        <div className='status-dot-container'>
          {componentStatus && <StatusDot status={componentStatus.status} />}
        </div>
      </div>
      <div className='component-content transition-group'>
        <CSSTransition
          in={!!componentStatus && hasParseError}
          classNames='fade'
          component='div'
          timeout={300}
          mountOnEnter
          unmountOnExit
          appear={true}
        >
          <div className='transition-wrap'>
            <ParseError fsiPath={fsiPath || ''} filename={componentStatus && componentStatus.filepath} component={component} />
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
              ? <ReadmeHistoryContainer />
              : <ReadmeContainer />}
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
                ? <MetadataContainer />
                : <MetadataEditorContainer />
            }
          </div>
        </CSSTransition>
        <CSSTransition
          in={component === 'body' && !hasParseError}
          classNames='fade'
          component='div'
          timeout={300}
          mountOnEnter
          unmountOnExit
          appear={true}
        >
          <div className='transition-wrap'>
            <Body
              data={data}
              fetchBody={fetchBody}
              setDetailsBar={setDetailsBar}
              details={details}
            />
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
            <StructureContainer history={history}/>
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
            <TransformContainer />
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
                ? <CommitHistoryContainer />
                : <CommitContainer />
            }
          </div>
        </CSSTransition>
        <SpinnerWithIcon loading={isLoading}/>
      </div>
    </div>
  )
}
export default DatasetComponent
