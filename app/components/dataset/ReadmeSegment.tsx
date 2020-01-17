import React from 'react'
import Segment from '../chrome/Segment'
import Readme from '../../models/dataset'

interface ReadmeSegmentProps {
  data: Readme
  subhead?: string
}

const ReadmeSegment: React.FunctionComponent<ReadmeSegmentProps> = ({ subhead, data }) => {
  if (!data) { return null }

  return <Segment
    icon='readme'
    name='readme'
    subhead={subhead}
    content={<h3>Huh?</h3>}
  />
}

export default ReadmeSegment
