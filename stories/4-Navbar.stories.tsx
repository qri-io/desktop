import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import Navbar from '../app/components/nav/Navbar'

export default {
  title: 'Chrome | Navbar',
  parameters: {
    notes: ''
  }
}

export const std = () => {
  return (
    <div style={{ width: 800, margin: '10px auto' }}>
      <Router>
        <Navbar location='foo/bar' />
      </Router>
    </div>
  )
}

std.story = {
  name: 'Standard',
  parameters: { note: 'basic navbar with no props' }
}
