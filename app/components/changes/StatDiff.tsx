import React from 'react'
import { IStatDiffRes, ISummaryStats } from '../../models/changes'
import Segment from '../chrome/Segment'
import LabeledStats, { Stat } from '../item/LabeledStats'
import { StatDiffRow } from '../item/StatDiffRow'

interface StatDiffProps {
  data: IStatDiffRes
}

const SummaryItem: React.FC<ISummaryStats> = (props) => {
  let statsList: Stat[] = []
  for (const [key, val] of Object.entries(props)) {
    if (key !== 'delta') {
      statsList.push({
        label: key,
        value: val,
        delta: props.delta && props.delta[key]
      })
    }
  }
  return <div className='margin'><LabeledStats data={statsList} uppercase={false}/></div>
}

const StatDiff: React.FC<StatDiffProps> = ({ data }) => {
  const {
    summary,
    columns,
    meta
  } = data

  const content = <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 20 }}>
    <thead>
      <tr><th colSpan={2} style={{ fontSize: 20 }}>Change Summary</th></tr>
      <tr>
        <th>
          <SummaryItem {...summary.left} />
        </th>
        <th>
          <SummaryItem {...summary.right} />
        </th>
      </tr>
      <tr><th colSpan={2} style={{ fontSize: 20 }}>Column Comparison</th></tr>
    </thead>
    <tbody>
      {columns.map((column, i) => <StatDiffRow last={columns.length - 1 === i} key={i} data={column} />)}
    </tbody>
  </table>

  return (
    <Segment
      name='Stats'
      collapsable
      componentStatus={meta && meta.status}
      animationOn={false}
      content={content}
    />

  )
}

export default StatDiff
