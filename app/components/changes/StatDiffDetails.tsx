import React from 'react'
import { IColumnStatsChanges } from '../../models/changes'

import { IStatTypes } from '../../models/dataset'
import Icon from '../chrome/Icon'
import StatsChart from '../StatsChart'
import LabeledStats, { Stat } from '../item/LabeledStats'

interface StatDiffItemProps {
  data: IStatTypes
  title?: string
  type?: 'boolean' | 'numeric' | 'string'
  delta?: IStatTypes
}

interface StatDiffDetailsHeaderProps {
  title?: string
  type?: 'boolean' | 'numeric' | 'string'
}

const StatDiffDetailsHeader: React.FC<StatDiffDetailsHeaderProps> = (props) => {
  const {
    title,
    type
  } = props
  return (<div className='margin-bottom' style={{ display: 'flex', alignItems: 'center', height: 30 }}>
    {title && <div className='padding-right' style={{ color: 'black', fontWeight: 500, fontSize: 20 }}>{title}</div>}
    {type && <div className='padding-left'><Icon icon={type} size='sm' color='medium' /><span style={{ marginLeft: 6, fontSize: 14 }}>{type}</span></div>}
  </div>)
}

export const StatDiffItem: React.FC<StatDiffItemProps> = (props) => {
  const {
    data,
    title,
    type,
    delta
  } = props

  if (!data || Object.keys(data).length === 0) {
    return <div className='margin' style={{ height: '100%', width: '100%', position: 'absolute' }}>
      <StatDiffDetailsHeader title={title} type={type}/>
      <div style={{ fontWeight: 600 }}>Column Does Not Exist in this Version</div>
    </div>
  }

  let statsList: Stat[] = []
  let chartName: string = ''

  for (const [key, val] of Object.entries(data)) {
    switch (key) {
      case 'type':
      case 'delta':
        continue
      case 'histogram':
      case 'frequencies':
        chartName = key
        continue
      default:
        statsList.push({
          label: key,
          value: val,
          delta: delta && delta[key]
        })
    }
  }

  /**
   * boolean is a special case where we derive the frequencies from
   * the stat values themselves, rather than a frequencies field, so
   * we need to make sure we actually print a chart
   */
  if (data.type === 'boolean') {
    chartName = 'frequencies'
  }

  if (data.type === 'string' && chartName) {
    if (Object.keys(data.frequencies).length >= 200) {
      chartName = 'frequencies of 200 most seen entries'
    }
  }
  return <div className='stat-diff-item margin'>
    <StatDiffDetailsHeader title={title} type={type}/>
    <div className='margin-bottom'>
      <div className='label small uppercase margin-bottom'>Column Stats</div>
      <LabeledStats data={statsList} uppercase={false}/>
    </div>
    <div className='margin-bottom'>
      {chartName && <div className='label small uppercase margin-bottom'>{chartName}</div>}
      {chartName
        ? <StatsChart data={data} delta={delta} title={chartName} />
        : <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>No chart available</div>
      }
    </div>
  </div>
}

export interface StatDiffDetailsProps {
  data: IColumnStatsChanges
}

export const StatDiffDetails: React.FC<StatDiffDetailsProps> = (props) => {
  const {
    data
  } = props

  const {
    left,
    right,
    delta,
    title
  } = data
  const { type } = right

  return (<table style={{ width: '100%', borderCollapse: 'separate', tableLayout: 'fixed' }}><tbody><tr style={{
    verticalAlign: 'top'
    // borderBottom: last ? 'none' : '1px solid #eee'
  }}>
    <td>
      <StatDiffItem data={left} title={title} type={type}/>
    </td>
    <td>
      <StatDiffItem data={right} delta={delta}/>
    </td>
  </tr></tbody></table>)
}
