import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie'
import * as React from 'react'
import numeral from 'numeral'

import LabeledStats from './LabeledStatsV1'

import styles from './statsChartV1.module.scss'

const primaryStatColor = '#0061A6'
const labelSkipWidth = 10

const labelFormat = (d: Number) => (
  <tspan y={-8}>{d >= 1000 ? numeral(d).format('0.0a') : d}</tspan>
)

interface StatsChartProps {
  height?: number
  data: Record<string, any>
  fontFamily: string // This is the consuming application's $font-family css variable
}

const StatsChart: React.FunctionComponent<StatsChartProps> = (
  props: StatsChartProps
) => {
  const { data, height = 250, fontFamily } = props
  switch (data.type) {
    case 'string':
      return <StringStat data={data} height={height} fontFamily={fontFamily}/>
    case 'numeric':
      return <NumericStat data={data} height={height} fontFamily={fontFamily}/>
    case 'boolean':
      return <BooleanStat data={data} height={height} fontFamily={fontFamily}/>
    default:
      return (
        <div>
          {data.count && (
            <LabeledStats
              fontFamily={fontFamily}
              data={[
                { label: 'count', value: data.count.toLocaleString() }
              ]}
            />
          )}
        </div>
      )
  }
}

export default StatsChart

const NumericStat: React.FunctionComponent<StatsChartProps> = (
  props: StatsChartProps
) => {
  const { data, height, fontFamily } = props
  let histogram

  if (data.histogram && data.histogram.frequencies) {
    histogram = data.histogram.frequencies.map((count: any, i: number) => {
      const label = `${data.histogram.bins[i]} - ${data.histogram.bins[i + 1]}`
      return {
        id: i,
        label,
        value: count
      }
    })
  }

  return (
    <div className={styles.StatsChartV1}>
      {histogram && (
        <div style={{ paddingLeft: 35 }}>
          <b>histogram</b>
        </div>
      )}
      {histogram && (
        <div style={{ height: height }}>
          <ResponsiveBar
            data={histogram}
            margin={{ top: 20, right: 10, bottom: 50, left: 60 }}
            padding={0.03}
            colors={() => primaryStatColor}
            tooltip={({ value, color, data }) => (
              <strong style={{ color }}>
                {data.label}: {value}
              </strong>
            )}
            theme={{
              tooltip: {
                container: {
                  background: '#B3CFE4'
                }
              }
            }}
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            axisLeft={{
              tickPadding: 5,
              tickRotation: 0
            }}
            axisBottom={null}
            labelSkipWidth={labelSkipWidth}
            labelSkipHeight={0}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            labelFormat={labelFormat as any}
          />
        </div>
      )}
      <LabeledStats
        data={[
          { label: 'count', value: data.count.toLocaleString() },
          { label: 'min', value: data.min.toLocaleString() },
          { label: 'max', value: data.max.toLocaleString() },
          { label: 'mean (avg)', value: data.mean.toLocaleString() },
          { label: 'median', value: data.median.toLocaleString() }
        ]}
        fontFamily={fontFamily}
      />
    </div>
  )
}

const StringStat: React.FunctionComponent<StatsChartProps> = (
  props: StatsChartProps
) => {
  const { data, height, fontFamily } = props
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
    }, [] as Array<{ id: string, label: string, value: any }>)
  }

  return (
    <div className={styles.StatsChartV1}>
      {frequencies && (
        <div style={{ paddingLeft: 35 }}>
          <b>frequencies</b>
        </div>
      )}
      {frequencies && (
        <div style={{ height: height }}>
          <ResponsiveBar
            data={frequencies}
            margin={{ top: 20, right: 10, bottom: 50, left: 40 }}
            padding={0.03}
            colors={() => primaryStatColor}
            tooltip={({ value, color, data }) => (
              <strong style={{ color }}>
                {data.label}: {value}
              </strong>
            )}
            theme={{
              tooltip: {
                container: {
                  background: '#B3CFE4'
                }
              }
            }}
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            axisLeft={{
              tickPadding: 5,
              tickRotation: 0
            }}
            axisBottom={null}
            labelSkipWidth={labelSkipWidth}
            labelSkipHeight={0}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            labelFormat={labelFormat as any}
          />
        </div>
      )}
      <LabeledStats
        data={[
          { label: 'count', value: data.count.toLocaleString() },
          { label: 'min length', value: data.minLength.toLocaleString() },
          { label: 'max length', value: data.maxLength.toLocaleString() }
        ]}
        fontFamily={fontFamily}
      />
    </div>
  )
}

const BooleanStat: React.FunctionComponent<StatsChartProps> = (
  props: StatsChartProps
) => {
  const { data, height, fontFamily } = props
  let frequencies = [
    {
      id: 'false',
      label: 'false',
      value: data.falseCount,
      color: '#EE325C'
    },
    {
      id: 'true',
      label: 'true',
      value: data.trueCount,
      color: primaryStatColor
    }
  ]

  const other = data.count - data.trueCount - data.falseCount
  if (other !== 0) {
    frequencies.push({
      id: 'other',
      label: 'other',
      value: other,
      color: '#F4A935'
    })
  }

  return (
    <div className={styles.StatsChartV1}>
      {frequencies && (
        <div style={{ paddingLeft: 35 }}>
          <b>frequencies</b>
        </div>
      )}
      {frequencies && (
        <div style={{ height: height }}>
          <ResponsivePie
            data={frequencies}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            colors={(d) => d.color as any}
            cornerRadius={3}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            radialLabelsSkipAngle={10}
            radialLabelsTextXOffset={6}
            radialLabelsTextColor="#333333"
            radialLabelsLinkOffset={0}
            radialLabelsLinkDiagonalLength={16}
            radialLabelsLinkHorizontalLength={0}
            radialLabelsLinkStrokeWidth={1}
            radialLabelsLinkColor={{ from: 'color' }}
            slicesLabelsSkipAngle={10}
            slicesLabelsTextColor="#333333"
            animate={true}
            motionStiffness={90}
            motionDamping={15}
          />
        </div>
      )}
      <LabeledStats
        data={[
          { label: 'count', value: data.count.toLocaleString() },
          { label: 'true', value: data.trueCount.toLocaleString() },
          { label: 'false', value: data.falseCount.toLocaleString() }
        ]}
        fontFamily={fontFamily}
      />
    </div>
  )
}
