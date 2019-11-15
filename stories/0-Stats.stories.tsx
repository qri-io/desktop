import React from 'react'
import StatsChart from '../app/components/StatsChart.tsx'
import fjcReport from './data/stats_nyc_report_family_justice_center_stats.json'
import allTypes from './data/stats_all_types.json'

export default {
  title: 'Stats|Charts',
  parameters: {
    notes: `feeding different data to the stats component. 
    
stats data from the [nyc fjc report](https://data.cityofnewyork.us/Social-Services/Annual-Report-on-Family-Justice-Center-Client-Sati/g62n-cz6a)`
  }
}

export const overview = () => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {allTypes.map((d, i) => {
        return (
          <div key={i} style={{ margin: 15, minWidth: 300 }}>
            <p>{d.type}</p>
            <hr />
            <StatsChart data={d} />
          </div>
        )
      })}
    </div>
  )
}

overview.story = {
  name: 'All Stats',
  parameters: { note: 'idealized overview of each stat' }
}

const wrap = (component) => {
  return (
    <div style={{ maxWidth: 300, margin: '0 auto' }}>
      {component}
    </div>
  )
}

export const languages = () => wrap(<StatsChart data={fjcReport[3]} />)

languages.story = {
  name: 'String: Languages'
}

export const manyLongStrings = () => wrap(<StatsChart data={fjcReport[0]} />)

manyLongStrings.story = {
  name: 'String: Many Long',
}

export const empty = () => wrap(<StatsChart data={fjcReport[1]} />)

empty.story = {
  name: 'String: Empty'
}

export const yesNoBlank = () => wrap(<StatsChart data={fjcReport[2]} />)

yesNoBlank.story = {
  name: 'String: Yes/No/Blank'
}

const charityFdnGrant2016AmountStat =  {
  "count": 21159,
  "histogram": {
    "bins": [
      0,
      24500000.1,
      49000000.2,
      73500000.30000001,
      98000000.4,
      122500000.5,
      147000000.60000002,
      171500000.70000002,
      196000000.8,
      220500000.9,
      245000001
    ],
    "frequencies": [
      21141,
      14,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      1
    ]
  },
  "max": 245000000,
  "mean": 327137.47497518786,
  "median": 50000,
  "min": 0,
  "type": "numeric"
}

export const lopsided = () => wrap(<StatsChart data={charityFdnGrant2016AmountStat} />)

lopsided.story = {
  name: 'Numeric: Lopsided',
  parameters: { notes: 'bonkers histogram from charitable foundation donations in 2016'}
}