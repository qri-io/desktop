import React from 'react'

import DatasetDetailsSubtext from '../app/components/dataset/DatasetDetailsSubtext'
import Dataset from '../app/models/dataset'

export default {
  title: 'Dataset',
  parameters: {
    notes: `Dataset components`
  }
}

export const detailsSubtext = () => {
  const date: Date = new Date(1579892323028)
  const data: Dataset = {
    commit: { timestamp: date, count: 14 },
    structure: { length: 349200, format: 'csv' }
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
      <div style={{ background: 'grey' }}>
        <DatasetDetailsSubtext data={data} size='sm' color='light' />
      </div>
      <div style={{ background: 'grey' }}>
        <DatasetDetailsSubtext data={data} color='light' />
      </div>
      <div>
        <DatasetDetailsSubtext data={data} size='sm' color='muted' />
      </div>
      <div>
        <DatasetDetailsSubtext data={data} color='muted' />
      </div>
      <div>
        <DatasetDetailsSubtext data={data} size='sm' color='dark' />
      </div>
      <div>
        <DatasetDetailsSubtext data={data} color='dark' />
      </div>
      <div style={{ background: 'grey' }}>
        <DatasetDetailsSubtext data={data} size='sm' color='light' noTimestamp />
      </div>
      <div style={{ background: 'grey' }}>
        <DatasetDetailsSubtext data={data} color='light' noTimestamp/>
      </div>
      <div>
        <DatasetDetailsSubtext data={data} size='sm' color='muted' noTimestamp/>
      </div>
      <div>
        <DatasetDetailsSubtext data={data} color='muted' noTimestamp/>
      </div>
      <div>
        <DatasetDetailsSubtext data={data} size='sm' color='dark' noTimestamp/>
      </div>
      <div>
        <DatasetDetailsSubtext data={data} color='dark' noTimestamp />
      </div>
    </div>
  )
}

detailsSubtext.story = {
  name: 'Details Subtext',
  parameters: {
    notes: 'sm/md, light/muted/dark'
  }
}
