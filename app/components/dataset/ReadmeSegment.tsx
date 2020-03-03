import React from 'react'
import Segment from '../chrome/Segment'
import { ReadmeHistoryComponent } from '../workbench/ReadmeHistory'

interface ReadmeSegmentProps {
  peername: string
  name: string
  path: string
  subhead?: string
  collapsable: boolean
}

const ReadmeSegment: React.FunctionComponent<ReadmeSegmentProps> = ({ subhead, peername, name, path, collapsable }) => {
  if (!peername || !name) { return null }

  return <Segment
    icon='readme'
    name='readme'
    collapsable={collapsable}
    subhead={subhead}
    content={<ReadmeHistoryComponent peername={peername} name={name} path={path} />}
  />
}

export default ReadmeSegment
