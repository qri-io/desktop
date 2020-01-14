import React from 'react'
import Navbar from '../app/components/nav/Navbar'
import { BrowserRouter as Router } from 'react-router-dom'

export default {
  title: 'Navbar',
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
