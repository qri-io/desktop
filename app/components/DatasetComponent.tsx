import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import MetadataContainer from '../containers/MetadataContainer'
import MetadataEditorContainer from '../containers/MetadataEditorContainer'
import BodyContainer from '../containers/BodyContainer'
import StructureContainer from '../containers/StructureContainer'
import ParseError from './ParseError'
import ReadmeContainer from '../containers/ReadmeContainer'
import { CSSTransition } from 'react-transition-group'
import SpinnerWithIcon from './chrome/SpinnerWithIcon'

import { getComponentDisplayProps, StatusDot } from './ComponentList'

import { ComponentStatus, SelectedComponent } from '../models/store'

interface DatasetComponentProps {
  isLoading: boolean
  component: SelectedComponent
  componentStatus: ComponentStatus
  history?: boolean
  fsiPath?: string
}

const DatasetComponent: React.FunctionComponent<DatasetComponentProps> = (props: DatasetComponentProps) => {
  const { component: selectedComponent, componentStatus, isLoading, history = false, fsiPath } = props

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
            <ReadmeContainer />
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
          in={component === 'body' && !hasParseError && !isLoading}
          classNames='fade'
          component='div'
          timeout={300}
          mountOnEnter
          unmountOnExit
          appear={true}
        >
          <div className='transition-wrap'>
            <BodyContainer/>
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
        <SpinnerWithIcon loading={isLoading}/>
      </div>
    </div>
  )
}
export default DatasetComponent
