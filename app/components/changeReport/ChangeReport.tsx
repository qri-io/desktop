import React from 'react'
import CommitDiff, { ICommitDiff } from './CommitDiff'
import StatDiff, { StatDiffRes } from './StatDiff'

import StringDiff, { IMetaDiff, IStringDiff, IStructureDiff } from './StringDiff'

interface IChangeReport {
  meta?: IMetaDiff
  structure: IStructureDiff
  readme?: IStringDiff
  transform?: IStringDiff
  viz?: IStringDiff
  stats: StatDiffRes
  commit: ICommitDiff
  name: string
  username: string
}

const ChangeReport: React.FC<IChangeReport> = (props) => {
  const {
    name,
    username,
    meta,
    structure,
    readme,
    transform,
    viz,
    stats,
    commit
  } = props

  const commitDiff = {
    left: {
      ...commit.left,
      username,
      name,
      bodySize: structure.left.length,
      bodyRows: structure.left.entries
    },
    right: {
      ...commit.right,
      username,
      name,
      bodySize: structure.right.length,
      bodyRows: structure.right.entries
    }
  }

  return (
    <div style={{ margin: 20 }}>
      <h2>Changes</h2>
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
