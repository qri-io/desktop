import React from 'react'
import DatasetItem from '../app/components/item/Dataset'

export default {
  title: 'Dataset List Item',
  parameters: {
    notes: ''
  }
}

const worldBank = {
  peername: 'galgamesh',
  name: 'world_bank_population',
  commit: {
    timestamp: new Date()
  },
  meta: {
    title: 'World Bank Population - Geographic Regions Only',
    themes: ['population', 'world bank statistics']
  }
}

export const std = () => {
  return (
    <div style={{ margin: 0, padding: 30, height: '100%', background: '#F5F7FA' }}>
      <div style={{ width: 800, margin: '2em auto' }}>
        <DatasetItem path='foo/bar' data={worldBank} />
      </div>
    </div>
  )
}

std.story = {
  name: 'Standard',
  parameters: { note: 'basic, ideal-input dataset item' }
}
