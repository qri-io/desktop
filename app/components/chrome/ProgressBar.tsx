import React from 'react'
import { Line } from 'rc-progress'

interface ProgressBarProps {
  duration: number
  fileName: string
}

const ProgressBar: React.FunctionComponent<ProgressBarProps> = ({ duration, fileName }) => {
  const timeForOnePercent = duration / 100 // milliseconds
  const [ percent, setPercent ] = React.useState(0)

  let timer = setTimeout(() => {})

  const increase = () => {
    setPercent(percent + 1)
  }

  React.useEffect(() => {
    if (percent >= 100) {
      clearTimeout(timer)
      return
    }
    timer = setTimeout(increase, timeForOnePercent)
    return () => {
      clearTimeout(timer)
    }
  }, [ percent ])

  React.useEffect(() => {
    increase()
  }, [])

  return (
    <div className=''>
      <div className='import-message'>importing {fileName}...</div>
      <Line percent={percent} strokeWidth={4} strokeColor='#4FC7F3' />
    </div>
  )
}

export default ProgressBar
