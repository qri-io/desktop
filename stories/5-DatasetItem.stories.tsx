import React from 'react'
import DatasetItem from '../app/components/item/Dataset'

export default {
  title: 'List Items | Dataset',
  parameters: {
    notes: ''
  }
}

export const std = () => {
  return (
    <div style={{ margin: 0, padding: 30, height: '100%', background: '#F5F7FA' }}>
      <div style={{ width: 800, margin: '2em auto' }}>
        <DatasetItem
          location='foo/bar'
          path='foo/bar'
          peername='galgamesh'
          name='world_bank_population'
          meta={{ title: 'World Bank Population - Geographic Regions Only' }}
          structure={{}}
          commit={{}}
        />
      </div>
    </div>
  )
}

std.story = {
  name: 'Standard',
  parameters: { note: 'basic, ideal-input dataset item' }
}
