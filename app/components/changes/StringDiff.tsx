import React from 'react'
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer'
import { Meta, Structure } from '../../models/dataset'
import { ComponentStatus } from '../../models/store'

import Segment from '../chrome/Segment'

export interface IStructureDiff {
  left: Structure
  right: Structure
  name: string
  meta: IChangeReportMeta
}

export interface IMetaDiff {
  left: Meta
  right: Meta
  name: string
  meta: IChangeReportMeta
}

export interface IStringDiff {
  left: string
  right: string
  name: string
  meta: IChangeReportMeta
}

interface IChangeReportMeta {
  status: ComponentStatus
}

const StringDiff: React.FC<IStringDiff | IStructureDiff | IMetaDiff> = (props) => {
  const {
    left,
    right,
    name,
    meta
  } = props

  const { status } = meta
  if (!(left || right) || (Object.keys(left).length === 0 && Object.keys(right).length === 0)) {
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
