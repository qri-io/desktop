import React from 'react'
import Stat from '../app/components/stats/Stat.tsx'
import fjcReport from './data/stats_nyc_report_family_justice_center_stats.json'

export default {
  title: 'Stats',
  parameters: {
    notes: `feeding different data to the stats component. 
    
stats data from the [nyc fjc report](https://data.cityofnewyork.us/Social-Services/Annual-Report-on-Family-Justice-Center-Client-Sati/g62n-cz6a)`
  }
}

const wrap = (component) => {
  return (
    <div style={{ maxWidth: 300, margin: '0 auto' }}>
      {component}
    </div>
  )
}

export const zero = () => wrap(<Stat data={fjcReport[0]} />)

zero.story = {
  name: 'Many Long String',
}

export const one = () => wrap(<Stat data={fjcReport[1]} />)

one.story = {
  name: 'Empty String'
}

export const two = () => wrap(<Stat data={fjcReport[2]} />)

two.story = {
  name: 'Yes/No/Blank String'
}


export const three = () => wrap(<Stat data={fjcReport[3]} />)

three.story = {
  name: 'Languages String'
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

export const four = () => wrap(<Stat data={charityFdnGrant2016AmountStat} />)

four.story = {
  name: 'Lopsided Numeric',
  parameters: { notes: 'bonkers histogram from charitable foundation donations in 2016'}
}