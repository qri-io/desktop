import React from 'react'
import { IStatDiff, ISummaryStats } from '../../models/changes'
import Segment from '../chrome/Segment'
import LabeledStats, { Stat } from '../item/LabeledStats'
import { StatDiffRow } from '../item/StatDiffRow'

interface StatDiffProps {
  data: IStatDiff
}

const SummaryItem: React.FC<ISummaryStats> = (props) => {
  let statsList: Stat[] = []
  for (const [key, val] of Object.entries(props)) {
    if (key !== 'delta') {
      statsList.push({
        label: key === 'totalSize' ? 'File Size' : key,
        value: val,
        inBytes: key === 'totalSize',
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
    about
  } = data

  if (about && about.status === 'missing') {
    return null
  }

  const content = <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 20 }}>
    <thead>
      <tr><th colSpan={2} style={{ fontSize: 20 }}>Change Summary</th></tr>
      <tr>
        <th>
          <SummaryItem {...summary.left} />
        </th>
        <th>
          <SummaryItem {...summary.right} delta={summary.delta} />
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
      name='stats'
      collapsable
      componentStatus={about && about.status}
      animationOn={false}
      content={content}
    />

  )
}

export default StatDiff
