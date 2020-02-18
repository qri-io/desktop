import * as React from 'react'

import { VersionInfo } from '../../models/store'
import DatasetDetailsSubtext from '../dataset/DatasetDetailsSubtext'
import Tag from './Tag'
import classNames from 'classnames'

interface DatasetItemProps {
  id?: string
  data: VersionInfo
  onClick: (username: string, name: string) => void
  fullWidth: boolean
  path?: string
  hideUsername?: boolean
}

const DatasetItem: React.FunctionComponent<DatasetItemProps> = ({ id, data, path, hideUsername, fullWidth = false, onClick }) => {
  if (!data) { return null }
  const { metaTitle, themeList, username, name } = data

  return (
    <div id={id} className={classNames('dataset-item', { 'full': fullWidth })} key={path} data-ref={`${username}/${name}`}>
      <div className='header'>
        <a onClick={() => onClick(username, name)}>{hideUsername ? `${name}` : `${username}/${name}`}</a>
        {themeList && themeList.length > 0 && <Tag type='category' tag={themeList[0]} />}
      </div>
      <div className='title'>{ metaTitle }</div>
      <div className='details'><DatasetDetailsSubtext data={data} color='muted' /></div>
    </div>
  )
}

export default DatasetItem
