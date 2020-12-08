import React from 'react'
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer'
import { IStringDiff, IStructureDiff, IMetaDiff } from '../../models/changes'

import Segment from '../chrome/Segment'

const StringDiff: React.FC<IStringDiff | IStructureDiff | IMetaDiff> = (props) => {
  const {
    left,
    right,
    name,
    about
  } = props

  const { status } = about
  if (!(left || right) || (Object.keys(left).length === 0 && Object.keys(right).length === 0) || status === 'missing') {
    return null
  }

  const styles = {
    contentText: { fontSize: 14, wordBreak: "break-all" }
  }

  return <Segment
    name={name || 'diff'}
    collapsable
    componentStatus={status}
    animationOn={false}
    content={<ReactDiffViewer
      styles={styles}
      oldValue={typeof left === 'string' ? left : JSON.stringify(left, null, 2)}
      newValue={typeof right === 'string' ? right : JSON.stringify(right, null, 2)}
      splitView={true}
      compareMethod={DiffMethod.WORDS}
    />}
  />
}

export default StringDiff
