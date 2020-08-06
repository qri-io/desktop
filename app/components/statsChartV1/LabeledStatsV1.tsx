import React from 'react'
import classNames from 'classnames'
import styles from './statsChartV1.module.scss'

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
  fontFamily: string
}

const LabeledStats: React.FunctionComponent<LabeledStatsProps> = ({ data, color = 'dark', size = 'sm', fontFamily }) => {
  return (
    <div className={styles['labeled-stats']}>
      {data.map((stat, i) => {
        return (
          <div key={i} className={classNames(styles['stats-value'], { 'large': size === 'lg' })} >
            <label className={classNames(styles.label, { 'light': color === 'light', 'large': size === 'lg' }, fontFamily)}>{stat.label}</label>
            <div className={classNames(styles.value, { 'light': color === 'light', 'large': size === 'lg' }, fontFamily)}>{stat.value}</div>
          </div>
        )
      })}
    </div>
  )
}

export default LabeledStats
