import React from 'react'

interface LabelledStatsProps {
  data: Array<[string, any]>
  light?: boolean
}

const LabelledStats: React.FunctionComponent<LabelledStatsProps> = ({ data, light }) => {
  return (
    <div className={`stats-values ${light && 'light'}`}>
      {data.map((stat, i) => {
        return (
          <div key={i} className="stats-value" style={{ marginLeft: 15 }}>
            <h4>{stat[1]}</h4>
            <label className="label">{stat[0]}</label>
          </div>
        )
      })}
    </div>
  )
}

export default LabelledStats
