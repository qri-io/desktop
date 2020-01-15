import React from 'react'
import Segment from '../chrome/Segment'
import Dataset from '../../models/dataset'

interface ReadmeSegmentProps {
  subhead?: string
  data: Dataset
}

const ReadmeSegment: React.FunctionComponent<ReadmeSegmentProps> = ({ subhead, data }) => {
  if (!data.readme) {
    return null
  }

  return <Segment icon='readme' name='readme' subhead={subhead} content={<h3>Huh?</h3>} />
}

export default ReadmeSegment
