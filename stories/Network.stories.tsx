import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { NetworkHome } from '../app/components/network/NetworkHome'

export default {
  title: 'Network',
  parameters: {
    notes: ''
  }
}

export const Home = () =>
  <Router>
    <Route render={(props) => <NetworkHome {...props} />} />
  </Router>

Home.story = {
  name: 'Home',
  parameters: { note: 'caution: uses live data' }
}
