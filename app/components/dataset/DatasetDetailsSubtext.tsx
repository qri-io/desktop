import React from 'react'
import moment from 'moment'
import filesize from 'filesize'
import classNames from 'classnames'
// TODO (b5) - move these into icon component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faClock } from '@fortawesome/free-regular-svg-icons'

import { VersionInfo } from '../../models/store'

// component for rendering dataset format, timestamp, size, etc
export interface DatasetDetailsSubtextProps {
  data: VersionInfo

  // if true, omit display of commit timestamp
  noTimestamp?: boolean
  size?: 'sm' | 'md'
  color?: 'light' | 'muted' | 'dark'
}

export const DatasetDetailsSubtext: React.FunctionComponent<DatasetDetailsSubtextProps> = ({ data, size = 'md', color = 'dark', noTimestamp }) => {
  if (!data) { return null }
  const { commitTime, bodyFormat, numVersions, bodySize } = data

  return (
    <div className={classNames('dataset-details', { 'small': size === 'sm', 'light': color === 'light', 'muted': color === 'muted' }) }>
      {bodyFormat && <span className='dataset-details-item'> {bodyFormat}</span>}
      {(!noTimestamp && commitTime) && <span className='dataset-details-item'><FontAwesomeIcon icon={faClock} size='sm'/> {moment(commitTime).fromNow()}</span>}
      {numVersions && <span className='dataset-details-item'>{`${numVersions} ${numVersions === 1 ? 'commits' : 'commits'}`}</span>}
      {bodySize && <span className='dataset-details-item'><FontAwesomeIcon icon={faFile} size='sm'/> {filesize(bodySize)}</span>}
    </div>
  )
}

export default DatasetDetailsSubtext
