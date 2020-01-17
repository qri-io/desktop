import * as React from 'react'

import Dataset from '../../models/dataset'
import DatasetDetailsSubtext from '../dataset/DatasetDetailsSubtext'

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
    <div className='dataset_item' key={path}>
      <a className='reference-link' href={`/${peername}/${name}`}>{hideUsername ? `${name}` : `${peername}/${name}`}</a>
      {meta && meta.theme && <div className='themes'>
        {meta.theme.map((keyword: string) => (
          <div key='theme' className='theme badge badge-secondary ml-2'>{keyword}</div>
        ))}
      </div>}
      <div className='title'>{ title }</div>
      <DatasetDetailsSubtext data={data} />
    </div>
  )
}

export default DatasetItem
