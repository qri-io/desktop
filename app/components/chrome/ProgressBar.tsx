import React from 'react'
import { Line } from 'rc-progress'

interface ProgressBarProps {
  percent: number
  color?: string
}

const ProgressBar: React.FunctionComponent<ProgressBarProps> = ({ percent, color = '#777' }) => (
  <div className='progress-bar'>
    <Line percent={percent} strokeWidth={4} strokeColor={color} />
  </div>
)

export default ProgressBar
