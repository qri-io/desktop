import React from 'react'
import { IColumnStatsChanges, IStatDiff, ISummaryStats } from '../../models/changes'
import Segment from '../chrome/Segment'
import LabeledStats, { Stat } from '../item/LabeledStats'
import StatDiffRow from '../item/StatDiffRow'

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

  const content = <>
    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 20 }}>
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
      </thead>
    </table>
    <StatDiffTable data={columns}/>
  </>

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

interface StatDiffTableProps {
  data: IColumnStatsChanges[]
}

const StatDiffTable: React.FunctionComponent<StatDiffTableProps> = ({ data }) => {
  return (
    <div style={{ margin: 20 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #E0E0E0' }}>
            <th></th>
            <th style={{ paddingLeft: 30, paddingBottom: 10 }}>
            column name
            </th>
            <th style={{ paddingBottom: 10, paddingLeft: 10 }}>
            type
            </th>
            <th style={{ paddingBottom: 10, paddingRight: 20, textAlign: 'right' }}>
            summary
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((column, i) => <StatDiffRow last={data.length - 1 === i} key={i} data={column} />)}
        </tbody>
      </table>
    </div>
  )
}
