import React from 'react'

import { IChangeReport } from '../../models/changes'

import CommitDiff from './CommitDiff'
import StatDiff from './StatDiff'

import StringDiff from './StringDiff'

const ChangeReport: React.FC<IChangeReport> = (props) => {
  const {
    meta,
    structure,
    readme,
    transform,
    viz,
    stats,
    commit
  } = props

  return (
    <div style={{ margin: 20 }}>
      <h2 id='change-report'>Changes</h2>
      <CommitDiff {...commit} />
      {readme && <StringDiff {...readme} name='readme' />}
      {meta && <StringDiff {...meta} name='meta' />}
      {structure && <StringDiff {...structure} name='structure' />}
      <StatDiff data={stats}/>
      {transform && <StringDiff {...transform} name='transform' />}
      {viz && <StringDiff {...viz} name='viz' />}
    </div>)
}

export default ChangeReport
