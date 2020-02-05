import React from 'react'

import { Dataset as IDataset, DatasetAction } from '../../models/dataset'

import BodySegment from './BodySegment'
import Overview from './Overview'
import ReadmeSegment from './ReadmeSegment'
import StructureSegment from './StructureSegment'
import CommitPreview from './CommitPreview'

interface DatasetProps {
  data: IDataset
  actions?: DatasetAction[]
}

const Dataset: React.FunctionComponent<DatasetProps> = (props) => {
  const { data, actions = [] } = props
  if (!data) { return null }

  const { commit = {}, peername, name, path, structure } = data

  return (
    <div className='dataset'>
      <Overview data={data} actions={actions} />
      <CommitPreview data={commit} />
      <ReadmeSegment peername={peername} name={name} path={path} collapsable />
      <StructureSegment data={structure} collapsable />
      <BodySegment data={data} collapsable />
    </div>
  )
}

export default Dataset
