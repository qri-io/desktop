import React from 'react'

import Dataset from '../../models/dataset'
import Segment from '../chrome/Segment'
import BodyJson from '../BodyJson'
import BodyTablePreview from '../BodyTablePreview'

interface BodySegmentProps {
  name?: string
  data: Dataset
  collapsable?: boolean
}

const BodySegment: React.FunctionComponent<BodySegmentProps> = ({ data, collapsable }) => {
  const { body, structure } = data

  if (!body) {
    return null
  }

  let subhead = ''
  let bodyComponent

  if (structure) {
    subhead = `previewing ${body.length} of ${structure.entries} rows`
  }

  if (!structure || (structure && structure.format !== 'csv')) {
    bodyComponent =
    <div id='json-preview-container'>
      <BodyJson data={body} previewWarning={false}/>
    </div>
  } else {
    bodyComponent = <BodyTablePreview data={data} />
  }

  return <Segment
    icon='body'
    name='body'
    subhead={subhead}
    collapsable={collapsable}
    content={bodyComponent}
  />
}

export default BodySegment
