import React from 'react'
import Segment from '../chrome/Segment'
import { Structure as IStructure } from '../../models/dataset'
import Structure from '../Structure'

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
    content={<Structure data={data} showConfig={false} history />}
  />
}

export default StructureSegment
