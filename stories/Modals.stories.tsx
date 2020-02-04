import React from 'react'

import SearchModal from '../app/components/modals/SearchModal'

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
        <SearchModal q='' />
      </div>
    </div>
  )
}

std.story = {
  name: 'Search',
  parameters: { note: 'search results modal' }
}
