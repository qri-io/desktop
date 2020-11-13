import React from 'react'
import { ComponentStatus } from '../../models/store'
import Segment from '../chrome/Segment'
import LabeledStats, { Stat } from '../item/LabeledStats'
import { ColumnStats, StatDiffRow } from '../item/StatDiffRow'

interface SummaryStats {
  [key: string]: any
  entries: number
  columns: number
  nullValues: number
  totalSize: number
  delta: SummaryStats
}

interface SummaryDiff {
  left: SummaryStats
  right: SummaryStats
}

interface ComponentMeta {
  status: ComponentStatus
}

interface StatDiffRes {
  summary: SummaryDiff
  columns: ColumnStats[]
  meta: ComponentMeta
}

interface StatDiffProps {
  data: StatDiffRes
}

const SummaryItem: React.FC<SummaryStats> = (props) => {
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

  const content = <table className='margin'>
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
      {columns.map((column, i) => <StatDiffRow key={i} data={column} />)}
    </tbody>
  </table>

  return (
    <Segment
      name='Stats'
      collapsable
      componentStatus={meta.status}
      animationOn={false}
      content={content}
    />

  )
}

export default StatDiff
