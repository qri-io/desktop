import React from 'react'
import DatasetItem from '../app/components/item/DatasetItem'
import { datasetToVersionInfo } from '../app/actions/mappingFuncs'
import LabeledStats, { Stat } from '../app/components/item/LabeledStats'
import Tag from '../app/components/item/Tag'

export default {
  title: 'Items',
  parameters: {
    notes: ''
  }
}

const worldBank = {
  peername: 'galgamesh',
  name: 'world_bank_population_2019-2020',
  commit: {
    timestamp: new Date(),
    count: 3
  },
  structure: { length: 239940, format: 'csv', errCount: 0, entries: 220 },
  meta: {
    title: 'World Bank Population - Geographic Regions Only',
    theme: ['population', 'world bank statistics']
  }
}

export const dataset = () => {
  return (
    <div style={{ margin: 0, padding: 30, height: '100%', background: '#F5F7FA' }}>
      <div style={{ width: 800, margin: '2em auto' }}>
        <DatasetItem path='foo/bar' data={datasetToVersionInfo(worldBank)} />
      </div>
    </div>
  )
}

dataset.story = {
  name: 'Standard',
  parameters: { note: 'basic, ideal-input dataset item' }
}

export const labeledStats = () => {
  const data: Stat[] = [{ value: '8', label: 'qri peers' }, { value: '300', label: 'conns.' }, { value: '3.48Mb/s', label: 'data transfer' }]
  const dataWithDelta: Stat[] = [{ value: '8', label: 'qri peers', delta: -1000 }, { value: '300', label: 'conns.', delta: 500000000 }, { value: '3.48Mb/s', label: 'data transfer' }]
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'space-between', height: 400 }}>
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
        <LabeledStats
          color='dark'
          data={dataWithDelta}
          size='sm'
          uppercase={false}
        />
        <LabeledStats
          color='dark'
          data={dataWithDelta}
          size='lg'
          uppercase={false}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'space-between', height: 400, background: 'grey' }}>
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
        <LabeledStats
          color='light'
          data={dataWithDelta}
          size='sm'
          uppercase={false}
        />
        <LabeledStats
          color='light'
          data={dataWithDelta}
          size='lg'
          uppercase={false}
        />
      </div>
    </div>
  )
}

labeledStats.story = {
  name: 'Labeled Stats',
  parameters: { note: 'large/small, dark/light, top/bottom' }
}

export const tag = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', height: 200 }}>
      <Tag type='category' tag='geology' />
      <Tag type='keyword' tag='global affairs' />
    </div>
  )
}

tag.story = {
  name: 'Tag',
  parameters: { note: 'category/keyword' }
}
