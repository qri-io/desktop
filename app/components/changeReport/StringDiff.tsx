import React from 'react'
import ReactDiffViewer from 'react-diff-viewer'

import Segment from '../chrome/Segment'

interface StringDiffProps {
  left: Object | string
  right: Object | string
  name: string
}

const StringDiff: React.FC<StringDiffProps> = (props) => {
  const {
    left,
    right,
    name
  } = props
  if (!(left || right) || (Object.keys(left).length === 0 && Object.keys(right).length === 0)) {
    return null
  }
  return <Segment
    name={name}
    collapsable
    contentHeight={1000}
    content={<ReactDiffViewer
      oldValue={typeof left === 'string' ? left : JSON.stringify(left, null, 2)}
      newValue={typeof right === 'string' ? right : JSON.stringify(right, null, 2)}
      splitView={true}
      disableWordDiff={true}
    />}
  />
}

export default StringDiff
