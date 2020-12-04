import React from 'react'
import { IChangeReport } from '../../models/changes'
import { QriRef } from '../../models/qriRef'
import CommitDiff from './CommitDiff'
import StatDiff from './StatDiff'

import StringDiff from './StringDiff'

interface ChangeReportParams {
  leftRef: QriRef
  rightRef: QriRef
  data: IChangeReport
}

const ChangeReport: React.FC<ChangeReportParams> = (props) => {
  const {
    leftRef,
    rightRef,
    data
  } = props

  const {
    meta,
    structure,
    readme,
    transform,
    viz,
    stats,
    commit
  } = data

  const commitDiff = {
    left: {
      ...commit.left,
      username: leftRef.username,
      name: leftRef.name,
      bodySize: structure.left.length,
      bodyRows: structure.left.entries
    },
    right: {
      ...commit.right,
      username: rightRef.username,
      name: rightRef.name,
      bodySize: structure.right.length,
      bodyRows: structure.right.entries
    }
  }

  return (
    <div style={{ margin: 20 }}>
      <h2 id='change-report'>Changes</h2>
      <CommitDiff {...commitDiff} />
      {readme && <StringDiff {...readme} name='readme' />}
      {meta && <StringDiff {...meta} name='meta' />}
      {structure && <StringDiff {...structure} name='structure' />}
      <StatDiff data={stats}/>
      {transform && <StringDiff {...transform} name='transform' />}
      {viz && <StringDiff {...viz} name='viz' />}
    </div>)
}

export default ChangeReport
