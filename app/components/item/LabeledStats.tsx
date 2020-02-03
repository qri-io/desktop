import React from 'react'
import classNames from 'classnames'

export interface Stat {
  label: string
  value: any
}

interface LabeledStatsProps {
  data: Stat[]
  // default is dark
  color?: 'light' | 'dark'
  // default sm
  size?: 'sm' | 'lg'
}

const LabeledStats: React.FunctionComponent<LabeledStatsProps> = ({ data, color = 'dark', size = 'sm' }) => {
  return (
    <div className='stats-values'>
      {data.map((stat, i) => {
        return (
          <div key={i} className={classNames('stats-value', { 'large': size === 'lg' })} >
            <label className={classNames('label', { 'light': color === 'light', 'large': size === 'lg' })}>{stat.label}</label>
            <div className={classNames('value', { 'light': color === 'light', 'large': size === 'lg' })}>{stat.value}</div>
          </div>
        )
      })}
    </div>
  )
}

export default LabeledStats
