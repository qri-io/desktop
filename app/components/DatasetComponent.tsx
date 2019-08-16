import * as React from 'react'
import MetadataContainer from '../containers/MetadataContainer'
import BodyContainer from '../containers/BodyContainer'
import SchemaContainer from '../containers/SchemaContainer'
import { CSSTransition } from 'react-transition-group'
import SpinnerWithIcon from './chrome/SpinnerWithIcon'

import { getComponentDisplayName, StatusDot } from './ComponentList'

import { ComponentStatus } from '../models/store'

interface DatasetComponentProps {
  isLoading: boolean
  component: string
  componentStatus: ComponentStatus
  history?: boolean
}

const DatasetComponent: React.FunctionComponent<DatasetComponentProps> = (props: DatasetComponentProps) => {
  const { component, componentStatus, isLoading, history = false } = props

  return (
    <div className='component-container'>
      <div className='component-header'>
        <div className='component-display-name-container'>
          {getComponentDisplayName(component)}
        </div>
        <div className='status-dot-container'>
          {componentStatus && <StatusDot status={componentStatus.status} />}
        </div>
      </div>
      <div className='component-content transition-group'>
        <CSSTransition
          in={component === 'meta' && !isLoading}
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
          in={component === 'body'}
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
          in={component === 'schema' && !isLoading}
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
