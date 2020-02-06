import * as React from 'react'

import Dataset from '../../models/dataset'
import DatasetDetailsSubtext from '../dataset/DatasetDetailsSubtext'
import Tag from './Tag'
import classNames from 'classnames'

interface DatasetItemProps {
  data: Dataset
  onClick: (username: string, name: string) => void
  fullWidth: boolean
  path?: string
  hideUsername?: boolean
}

const DatasetItem: React.FunctionComponent<DatasetItemProps> = ({ data, path, hideUsername, fullWidth = false, onClick }) => {
  if (!data) { return null }
  const { meta, username, name } = data
  const title = (meta && meta.title) ? meta.title : `No Title - ${name}`

  return (
    <div className={classNames('dataset-item', { 'full': fullWidth })} key={path}>
      <div className='header'>
        <a onClick={() => onClick(username, name)}>{hideUsername ? `${name}` : `${username}/${name}`}</a>
        {meta && meta.theme && meta.theme.length > 0 && <Tag type='category' tag={meta.theme[0]} />}
      </div>
      <div className='title'>{ title }</div>
      <div className='details'><DatasetDetailsSubtext data={data} color='muted' /></div>
    </div>
  )
}

export default DatasetItem
