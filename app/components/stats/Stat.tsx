import { ResponsiveBar } from '@nivo/bar'
import * as React from 'react'

interface StatProps {
  height: number
  data: Record<string, any>
}

const Stat: React.FunctionComponent<StatProps> = (props: StatProps) => {
  const { data, height = 250 } = props
  switch (data.type) {
    case 'string':
      return <StringStat data={data} height={height} />
    default:
      return (
        <span>
          {data.count && <p>Count: {data.count}</p>}
        </span>
      )
  }
}

export default Stat

const StringStat: React.FunctionComponent<StatProps> = (props: StatProps) => {
  const { data, height } = props
  let frequencies

  if (data.frequencies) {
    frequencies = Object.keys(data.frequencies).reduce((acc, key) => {
      let label = key
      if (label.length > 20) {
        label = label.slice(0, 18) + '...'
      } else if (label === '') {
        label = '""'
      }
      acc.push({
        id: key,
        label,
        value: data.frequencies[key]
      })
      return acc
    }, [])
  }

  return (
    <div style={{ height: height }}>
      <p>Count: {data.count}<br/>Min Chracter Length: {data.minLength}<br/>Max String Length: {data.maxLength}<br/></p>
      {frequencies && <ResponsiveBar
        data={frequencies}
        margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: 'nivo' }}
        tooltip={({ value, color, data }) => (
          <strong style={{ color }}>
            {data.label}: {value}
          </strong>
        )}
        theme={{
          tooltip: {
            container: {
              background: '#333'
            }
          }
        }}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'count',
          legendPosition: 'middle',
          legendOffset: -40
        }}
        axisBottom={null}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />}
    </div>
  )
}
