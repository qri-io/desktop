import React from 'react'
import classNames from 'classnames'

import { abbreviateNumber } from '../../utils/fileSize'

export interface Stat {
  label: string
  value: any
  /**
   * delta is only used for numerical values, intended to show the difference
   * between this number and some other value. negative numbers are showing in
   * red, positive in green
   */
  delta?: number
}

interface LabeledStatsProps {
  data: Stat[]
  // default is dark
  color?: 'light' | 'dark'
  // default sm
  size?: 'sm' | 'lg'
  // uppercase refers to the styling found in the label portion of the LabeledStat
  // defaults to true
  uppercase?: boolean
}

const LabeledStats: React.FunctionComponent<LabeledStatsProps> = ({ data, color = 'dark', size = 'sm', uppercase = true }) => {
  return (
    <div className='stats-values'>
      {data.map((stat, i) => {
        return (
          <div key={i} className={classNames('stats-value', { 'large': size === 'lg' })} >
            <label className={classNames('label', { uppercase, 'light': color === 'light', 'large': size === 'lg' })}>{stat.label}</label>
            <div className={classNames('value', { 'light': color === 'light', 'large': size === 'lg' })}>{typeof stat.value === 'number' ? abbreviateNumber(stat.value) : stat.value}</div>
            {stat.delta
              ? <div className={classNames('delta', { 'negative': stat.delta < 0, 'light': color === 'light', 'large': size === 'lg' })}>{abbreviateNumber(stat.delta)}</div>
              : <div className={classNames('delta-spacer', { 'large': size === 'lg' })}></div>}
          </div>
        )
      })}
    </div>
  )
}

export default LabeledStats
