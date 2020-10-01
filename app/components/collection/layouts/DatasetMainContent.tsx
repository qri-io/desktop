import * as React from 'react'

import LinkButton from '../headerButtons/LinkButton'
import PublishButton from '../headerButtons/PublishButton'

const DatasetMainContentComponent: React.FunctionComponent = (props) => {
  const {
    children
  } = props
  return <>
    <div className='main-content-header'>
      <LinkButton />
      <PublishButton />
    </div>
    {children}
  </>
}

export default DatasetMainContentComponent
