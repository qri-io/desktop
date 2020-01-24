import React from 'react'
import DatasetItem from '../app/components/item/Dataset'
import LabeledStats, { Stat } from '../app/components/item/LabeledStats'

export default {
  title: 'Items',
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

export const labeledStats = () => {
  const data: Stat[] = [{ value: '8', label: 'qri peers' }, { value: '300', label: 'conns.' }, { value: '3.48Mb/s', label: 'data transfer' }]
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'space-between', height: 200 }}>
        <LabeledStats
          color='dark'
          data={data}
          size='sm'
        />
        <LabeledStats
          color='dark'
          data={data}
          size='lg'
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'space-between', height: 200, background: 'grey' }}>
        <LabeledStats
          color='light'
          data={data}
          size='sm'
        />
        <LabeledStats
          color='light'
          data={data}
          size='lg'
        />
      </div>
    </div>
  )
}

labeledStats.story = {
  name: 'Labeled Stats',
  parameters: { note: 'large/small, dark/light, top/bottom' }
}
