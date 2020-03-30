import React from 'react'

import { Structure as IStructure } from '../../models/dataset'

import Segment from '../chrome/Segment'
import { StructureComponent } from '../Structure'

interface StructureSegmentProps {
  data: IStructure
  collapsable?: boolean
}

const StructureSegment: React.FunctionComponent<StructureSegmentProps> = ({ data, collapsable }) => {
  if (!data) { return null }

  return <Segment
    icon='structure'
    name='Structure'
    collapsable={collapsable}
    content={<StructureComponent data={data} showConfig={false} loading={!data}/>}
  />
}

export default StructureSegment
