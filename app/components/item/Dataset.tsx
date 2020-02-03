import * as React from 'react'

import Dataset from '../../models/dataset'
import DatasetDetailsSubtext from '../dataset/DatasetDetailsSubtext'
import Tag from './Tag'

interface DatasetItemProps {
  data: Dataset

  path?: string
  hideUsername?: boolean
}

const DatasetItem: React.FunctionComponent<DatasetItemProps> = ({ data, path, hideUsername }) => {
  if (!data) { return null }
  const { meta, peername, name } = data
  const title = (meta && meta.title) ? meta.title : `No Title - ${name}`

  return (
    <div className='dataset-item' key={path}>
      <div className='header'>
        <a href={`/${peername}/${name}`}>{hideUsername ? `${name}` : `${peername}/${name}`}</a>
        {meta && meta.themes && meta.themes.length > 1 && <Tag type='category' tag={meta.themes[0]} />}
      </div>
      <div className='title'>{ title }</div>
      <div className='details'><DatasetDetailsSubtext data={data} color='muted' /></div>
    </div>
  )
}

export default DatasetItem
