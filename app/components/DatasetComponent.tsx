import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import MetadataContainer from '../containers/MetadataContainer'
import BodyContainer from '../containers/BodyContainer'
import SchemaContainer from '../containers/SchemaContainer'
import ParseError from './ParseError'
import { CSSTransition } from 'react-transition-group'
import SpinnerWithIcon from './chrome/SpinnerWithIcon'

import { getComponentDisplayProps, StatusDot } from './ComponentList'

import { ComponentStatus, SelectedComponent } from '../models/store'

interface DatasetComponentProps {
  isLoading: boolean
  component: SelectedComponent
  componentStatus: ComponentStatus
  history?: boolean
  linkpath?: string
}

const DatasetComponent: React.FunctionComponent<DatasetComponentProps> = (props: DatasetComponentProps) => {
  const { component: selectedComponent, componentStatus, isLoading, history = false, linkpath } = props

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
          <div id='transition-wrap'>
            <ParseError linkpath={linkpath || ''} filename={componentStatus && componentStatus.filepath} component={component} />
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
          <div id='transition-wrap'>
            <MetadataContainer history={history}/>
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
          <div id='transition-wrap'>
            <BodyContainer history={history}/>
          </div>
        </CSSTransition>
        <CSSTransition
          in={component === 'schema' && !isLoading && !hasParseError}
          classNames='fade'
          component='div'
          timeout={300}
          mountOnEnter
          unmountOnExit
          appear={true}
        >
          <div id='transition-wrap'>
            <SchemaContainer history={history}/>
          </div>
        </CSSTransition>
        <SpinnerWithIcon loading={isLoading}/>
      </div>
    </div>
  )
}
export default DatasetComponent
