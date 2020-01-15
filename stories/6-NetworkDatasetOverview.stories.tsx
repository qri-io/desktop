import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import Navbar from '../app/components/nav/Navbar'
import DatasetOverview from '../app/components/network/DatasetOverview'

const cities = require('./data/cities.dataset.json')

export default {
  title: 'Network | Dataset Overview',
  parameters: {
    notes: ''
  }
}

export const std = () => {
  return (
    <div style={{ margin: 0, padding: 30, height: '100%', background: '#F5F7FA' }}>
      <div style={{ width: 800, margin: '2em auto' }}>
        <Router>
          <Navbar location='foo/bar' />
          <DatasetOverview
            dataset={cities}
            peername='galgamesh'
            name='world_bank_population'
            />
        </Router>
      </div>
    </div>
  )
}

std.story = {
  name: 'Standard',
  parameters: { note: 'basic, ideal-input dataset overview' }
}
