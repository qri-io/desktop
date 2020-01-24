import React from 'react'
import classNames from 'classnames'

export interface Stat {
  label: string
  value: any
}

interface LabeledStatsProps {
  // data is an array of arrays
  // the inner array has stat[0] as the label and stat[1] as the value
  data: Stat[]
  color?: 'light' | 'dark'
  size?: 'sm' | 'lg'
}

const LabeledStats: React.FunctionComponent<LabeledStatsProps> = ({ data, color = 'dark', size = 'sm' }) => {
  return (
    <div className='stats-values'>
      {data.map((stat, i) => {
        return (
          <div key={i} className="stats-value" style={{ marginLeft: 15 }}>
            <label className={classNames('label', { 'light': color === 'light', 'large': size === 'lg' })}>{stat.label}</label>
            <div className={classNames('value', { 'light': color === 'light', 'large': size === 'lg' })}>{stat.value}</div>
          </div>
        )
      })}
    </div>
  )
}

export default LabeledStats
