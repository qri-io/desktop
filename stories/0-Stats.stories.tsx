import React from 'react'
import Stat from '../app/components/stats/Stat.tsx'
import statsData from './data/nyc_report_family_justice_center_stats.json'

export default {
  title: 'Stats',
  parameters: {
    notes: `feeding different data to the stats component. 
    
stats data from the [nyc fjc report](https://data.cityofnewyork.us/Social-Services/Annual-Report-on-Family-Justice-Center-Client-Sati/g62n-cz6a)`
  }
}

export const zero = () => <Stat data={statsData[0]} />

zero.story = {
  name: 'Many Long String',
}

export const one = () => <Stat data={statsData[1]} />

one.story = {
  name: 'Empty String'
}

export const two = () => <Stat data={statsData[2]} />

two.story = {
  name: 'Yes/No/Blank String'
}


export const three = () => <Stat data={statsData[3]} />

three.story = {
  name: 'Languages String'
}
