import React from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAlt } from '@fortawesome/free-solid-svg-icons'

import { DetailedDatasetRef } from '../../models/store'
import { detailedDatasetRefToDataset } from '../../actions/mappingFuncs'
import DatasetDetailsSubtext from '../dataset/DatasetDetailsSubtext'

interface DetailedDatasetRefItemProps {
  data: DetailedDatasetRef
  selected?: boolean

  onClick: (data: DetailedDatasetRef, e?: React.MouseEvent) => void
}

const DetailedDatasetRefItem: React.FunctionComponent<DetailedDatasetRefItemProps> = ({ data, selected = false, onClick }) => {
  const { username, name } = data
  return (
    <div
      id={`${username}-${name}`}
      key={`${username}/${name}`}
      className={classNames('sidebar-list-item', 'sidebar-list-item-text', {
        'selected': selected
      })}
      onClick={(e: React.MouseEvent) => { onClick(data, e) }}
    >
      <div className='icon-column'>
        <FontAwesomeIcon icon={faFileAlt} size='lg'/>
      </div>
      <div className='text-column'>
        <div className='text'>{username}/{name}</div>
        <DatasetDetailsSubtext data={detailedDatasetRefToDataset(data)} />
      </div>
    </div>
  )
}

export default DetailedDatasetRefItem
