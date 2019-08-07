import * as React from 'react'
import MetadataContainer from '../containers/MetadataContainer'
import BodyContainer from '../containers/BodyContainer'
import SchemaContainer from '../containers/SchemaContainer'

import { getComponentDisplayName, StatusDot } from './ComponentList'

import { ComponentStatus } from '../models/store'

interface DatasetComponentProps {
  component: string
  componentStatus: ComponentStatus
  history?: boolean
}

const DatasetComponent: React.FunctionComponent<DatasetComponentProps> = (props: DatasetComponentProps) => {
  const { component, componentStatus, history } = props
  let mainContent
  switch (component) {
    case 'meta':
      mainContent = <MetadataContainer history={history} />
      break
    case 'body':
      mainContent = <BodyContainer history={history} />
      break
    case 'schema':
      mainContent = <SchemaContainer history={history} />
      break
    default:
      mainContent = <MetadataContainer history={history} />
  }

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
      <div className='component-content'>
        {mainContent}
      </div>
    </div>
  )
}

export default DatasetComponent
