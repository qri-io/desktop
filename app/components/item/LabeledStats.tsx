import React from 'react'
import classNames from 'classnames'

import fileSize, { abbreviateNumber } from '../../utils/fileSize'

export interface Stat {
  label: string
  value: any

  /**
   * if the value is a file, we should be displaying it differently than a regular
   * number. This only affects values with `number` types. Defaults to `false`
   */
  inBytes: boolean
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

const LabeledStats: React.FunctionComponent<LabeledStatsProps> = (props) => {
  const {
    data,
    color = 'dark',
    size = 'sm',
    uppercase = true
  } = props

  return (
    <div className='stats-values'>
      {data.map((stat, i) => {
        let displayVal: any = stat.value
        let displayDelta: any = stat.delta
        if (typeof displayVal === 'number') {
          if (stat.inBytes) {
            displayVal = fileSize(displayVal)
            // fileSize will return 0 if the input is negative
            displayDelta = stat.delta && fileSize(Math.abs(stat.delta))
            if (typeof stat.delta === 'number' && stat.delta < 0) {
              displayDelta = `-${displayDelta}`
            }
          } else {
            displayVal = abbreviateNumber(stat.value)
            displayDelta = stat.delta && abbreviateNumber(displayDelta)
          }
        }
        return (
          <div key={i} className={classNames('stats-value', { 'large': size === 'lg' })} >
            <label className={classNames('label', { uppercase, 'light': color === 'light', 'large': size === 'lg' })}>{stat.label}</label>
            <div className={classNames('value', { 'light': color === 'light', 'large': size === 'lg' })}>{displayVal}</div>
            {stat.delta
              ? <div className={classNames('delta', { 'negative': stat.delta < 0, 'light': color === 'light', 'large': size === 'lg' })}>{stat.delta > 0 && <span>+</span>}{displayDelta}</div>
              : <div className={classNames('delta-spacer', { 'large': size === 'lg' })}></div>}
          </div>
        )
      })}
    </div>
  )
}

export default LabeledStats
