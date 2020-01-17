import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import Navbar from '../app/components/nav/Navbar'
import DatasetOverview from '../app/components/dataset/DatasetOverview'
import Dataset from '../app/models/dataset'

const cities = require('./data/cities.dataset.json')

export default {
  title: 'Network | Dataset Overview',
  parameters: {
    notes: ''
  }
}


export const std = () => {
  const handle = (label: string) => {
    return (d: Dataset, e: React.SyntheticEvent) => {
      alert(`${label}: ${d.peername}/${d.name}`)
    }
  }

  return (
    <div style={{ margin: 0, padding: 30, minHeight: '100%', background: '#F5F7FA' }}>
      <div style={{ width: 800, margin: '2em auto' }}>
        <Router>
          <Navbar location='foo/bar' />
          <DatasetOverview data={cities} onClone={handle('clone')} onEdit={handle('edit')} onExport={handle('export')} />
        </Router>
      </div>
    </div>
  )
}

std.story = {
  name: 'Standard',
  parameters: { note: 'basic, ideal-input dataset overview' }
}
