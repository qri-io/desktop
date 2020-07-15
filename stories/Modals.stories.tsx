import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { ModalType } from '../app/models/modals'
import { SearchComponent } from '../app/components/modals/SearchModal'

export default {
  title: 'Modals',
  parameters: {
    notes: ''
  }
}

export const std = () => {
  return (
    <div style={{ margin: 0, padding: 30, height: '100%', background: '#F5F7FA' }}>
      <div style={{ width: 800, margin: '2em auto' }}>
        <Router>
          <Route render={(props) => 
            <SearchComponent 
              {...props} 
              modal={{ type: ModalType.Search, q: '' }} 
              onDismissed={() => console.log('Search modal is dismissed.')} 
              setWorkingDataset={() => console.log('Working dataset has been set.')}
              />}
            />
        </Router>
      </div>
    </div>
  )
}

std.story = {
  name: 'Search',
  parameters: { note: 'search results modal' }
}
