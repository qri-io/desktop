import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { NavbarComponent } from '../app/components/nav/Navbar'

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
        <Route render={(props) => {
          return <NavbarComponent setModal={() => console.log("set modal!")} {...props} />
        }}/>
      </Router>
    </div>
  )
}

std.story = {
  name: 'Standard',
  parameters: { note: 'basic navbar with no props' }
}
