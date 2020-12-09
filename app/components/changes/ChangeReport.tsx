import React from 'react'

import { IChangeReport } from '../../models/changes'

import DatasetSummaryDiff from './DatasetSummaryDiff'
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
    versionInfo
  } = props

  return (
    <div style={{ margin: 20 }}>
      <h2 id='change-report'>Changes</h2>
      <DatasetSummaryDiff {...versionInfo} />
      {readme && <StringDiff {...readme} name='readme' />}
      {meta && <StringDiff {...meta} name='meta' />}
      {structure && <StringDiff {...structure} name='structure' />}
      <StatDiff data={stats}/>
      {transform && <StringDiff {...transform} name='transform' />}
      {viz && <StringDiff {...viz} name='viz' />}
    </div>)
}

export default ChangeReport
